"use client";

import React, {useState} from "react";
import {
    ArrowRight,
    UserRound,
    Headphones,
    Clock3,
    CheckCircle2,
    CircleDot,
    Send,
} from "lucide-react";

import TicketItem from "@/components/modules/TicketItem/TicketItem";
import {
    TicketType,

} from "@/types/Ticket";
import {TicketMessageType} from "@/types/TicketMessage";
import {showCustomToast} from "@/components/modules/layout/toast/toast";
import {useRouter} from "next/navigation";

type TicketChatProps = {
    ticket: TicketType;
    messages: TicketMessageType[];
};

export default function TicketChat({
                                       messages,
                                       ticket,
                                   }: TicketChatProps) {


    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const [message, setMessage] = useState("");




    const handleSendMessage = async () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || isLoading) return;
        if (ticket.status === "closed") {
            showCustomToast("خطا", "این تیکت بسته شده است و امکان ثبت پیام وجود ندارد", "x", "error");
            return;
        }

        try {
            setIsLoading(true);
            const newMessage = {
                ticketId: ticket._id,
                senderRole: "Admin",
                body: message.trim()
            };

            const res = await fetch("/api/ticket/ticketMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMessage),
            })

            const data = await res.json();

            if (res.ok) {
                setMessage("");
                router.refresh();
                setIsLoading(false);
            }
            if (!res.ok) {
                showCustomToast(
                    "خطا",
                    `${data.message}`,
                    "x",
                    "error"
                )
                setIsLoading(false);
            }

        } catch (error) {
            console.error("SEND TICKET MESSAGE ERROR:", error);
            showCustomToast("خطا", "خطایی در ارتباط با سرور رخ داده است", "x", "error");
        } finally {
            setIsLoading(false);
        }
    };


const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
};
const getStatusLabel = (status: TicketType["status"]) => {
    switch (status) {
        case "open":
            return "باز";

        case "pending":
            return "در انتظار";

        case "closed":
            return "بسته شده";

        default:
            return status;
    }
};

const getPriorityLabel = (
    priority: TicketType["priority"]
) => {
    switch (priority) {
        case "low":
            return "کم";

        case "medium":
            return "متوسط";

        case "high":
            return "زیاد";

        default:
            return priority;
    }
};

return (
    <div
        dir="rtl"
        className="mx-auto w-full max-w-[1000px]"
    >
        {/* Back */}
        <button
            type="button"
            onClick={() => {
                router.push("panel/tickets")
            }}
            className="mb-5 flex items-center gap-2 text-sm text-gray-500 transition hover:text-[var(--primary)]"
        >
            <ArrowRight size={18}/>
            بازگشت به تیکت‌ها
        </button>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* Header */}
            <div
                className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
                        <Headphones size={21}/>
                    </div>

                    <div>
                        <h1 className="text-base font-bold text-gray-900 sm:text-lg">
                            {ticket.title}
                        </h1>
                    </div>

                </div>

                {/* Status */}
                <div
                    className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
                    <CircleDot size={13}/>
                    {getStatusLabel(ticket.status)}
                </div>

            </div>

            {/* Ticket Info */}
            <div
                className="grid grid-cols-1 gap-4 border-b border-gray-100 bg-gray-50/70 p-4 sm:grid-cols-3 sm:p-5">

                <TicketItem
                    icon={<UserRound size={17}/>}
                    label="دپارتمان"
                    value={ticket.department?.title ?? "-"}
                />

                <TicketItem
                    icon={<Clock3 size={17}/>}
                    label="تاریخ ایجاد"
                    value={new Date(
                        ticket.createdAt
                    ).toLocaleDateString("fa-IR")}
                />

                <TicketItem
                    icon={<CheckCircle2 size={17}/>}
                    label="اولویت"
                    value={getPriorityLabel(ticket.priority)}
                />

            </div>

            {/* Chat */}
            <div className="flex h-[520px] flex-col">

                {/* Messages */}
                <div className="flex-1 space-y-5 overflow-y-auto bg-[#fafafa] p-4 sm:p-6">

                    {messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            هنوز پیامی برای این تیکت ثبت نشده است.
                        </div>
                    ) : (
                        messages.map((item) => {

                            const isUser =
                                item.senderRole === "User";

                            return (
                                <div
                                    key={item._id}
                                    className={`flex ${
                                        isUser
                                            ? "justify-start"
                                            : "justify-end"
                                    }`}
                                >

                                    <div
                                        className={`
                                                    flex
                                                    max-w-[90%]
                                                    gap-2
                                                    sm:max-w-[75%]
                                                    ${
                                            isUser
                                                ? "flex-row-reverse"
                                                : "flex-row"
                                        }
                                                    `}
                                    >

                                        {/* Avatar */}
                                        <div
                                            className={`
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    ${
                                                isUser
                                                    ? "bg-gray-200 text-gray-600"
                                                    : "bg-[var(--primary)] text-white"
                                            }
                                                    `}
                                        >
                                            {isUser ? (
                                                <UserRound size={17}/>
                                            ) : (
                                                <Headphones size={17}/>
                                            )}
                                        </div>

                                        {/* Message */}
                                        <div>

                                            <div
                                                className={`
                                                        rounded-2xl
                                                        px-4
                                                        py-3
                                                        text-sm
                                                        leading-7
                                                        ${
                                                    isUser
                                                        ? "rounded-tr-md bg-white text-gray-700 shadow-sm"
                                                        : "rounded-tl-md bg-[var(--primary)] text-white"
                                                }
                                                        `}
                                            >

                                                {item.body && (
                                                    <p className="whitespace-pre-line">
                                                        {item.body}
                                                    </p>
                                                )}

                                            </div>

                                            {/* Date */}
                                            <div
                                                className={`
                                                    mt-1
                                                    text-[10px]
                                                    text-gray-400
                                                    ${
                                                    isUser
                                                        ? "text-right"
                                                        : "text-left"
                                                }
                                                    `}
                                            >
                                                {new Date(
                                                    item.createdAt
                                                ).toLocaleTimeString(
                                                    "fa-IR",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            );
                        })
                    )}

                </div>

                {/* Composer */}
                <div
                    className="border-t border-gray-200 bg-white p-3 sm:p-4"
                >

                    <div className="flex items-end gap-2">
                        {/* Textarea */}
                        <textarea
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="پیام خود را بنویسید..."
                            rows={1}
                            className="max-h-[110px] min-h-[44px] flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 transition outline-none placeholder:text-gray-400 focus:border-[var(--primary)] focus:bg-white"
                        />

                        {/* Send */}
                        <button
                            type="button"
                            onClick={handleSendMessage}
                            disabled={
                                !message.trim()
                            }
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Send size={18}/>
                        </button>
                    </div>

                    <p className="mt-2 hidden text-[11px] text-gray-400 sm:block">
                        برای ارسال پیام کلید Enter را بزنید؛ برای خط جدید
                        از Shift + Enter استفاده کنید.
                    </p>
                </div>

            </div>

        </div>
    </div>
);
}

