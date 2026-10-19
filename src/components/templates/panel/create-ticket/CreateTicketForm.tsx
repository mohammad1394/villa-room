"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    AlertCircle,
    ChevronDown,
    File,
    Send,
    Trash2,
    Upload,
} from "lucide-react";
import { showCustomToast } from "@/components/modules/layout/toast/toast";
import {DepartmentType} from "@/types/Department";
import {SubDepartmentType} from "@/types/SubDepartment";
import {useRouter} from "next/navigation";





type TicketFile = {
    id: string;
    file: File;
};

function CreateTicketForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const [departments, setDepartments] = useState<DepartmentType[]>([]);
    const [departmentID, setDepartmentID] = useState("-1");

    const [subDepartments, setSubDepartments] = useState<SubDepartmentType[]>([]);
    const [subDepartmentID, setSubDepartmentID] = useState("-1");

    const [priority, setPriority] = useState<"-1" | "low" | "medium" | "high">("medium");

    const [files, setFiles] = useState<TicketFile[]>([]);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const getDepartments = async () => {
            try {
                const res = await fetch("/api/departments");

                if (!res.ok) {
                    throw new Error("خطا در دریافت دپارتمان‌ها");
                }

                const data: DepartmentType[] = await res.json();

                setDepartments(data);
            } catch (error) {
                console.error(error);

                showCustomToast(
                    "خطا",
                    "دریافت دپارتمان‌ها با مشکل مواجه شد",
                    "x",
                    "error"
                );
            }
        };

        getDepartments();
    }, []);

    useEffect(() => {
        if (departmentID === "-1") {
            setSubDepartments([]);
            setSubDepartmentID("-1");
            return;
        }

        const getSubDepartments = async () => {
            try {
                const res = await fetch(
                    `/api/departments/sub/${departmentID}`
                );

                if (!res.ok) {
                    throw new Error("خطا در دریافت زیر‌دپارتمان‌ها");
                }

                const data: SubDepartmentType[] = await res.json();

                setSubDepartments(data);
                setSubDepartmentID("-1");
            } catch (error) {
                console.error(error);

                setSubDepartments([]);
                setSubDepartmentID("-1");

                showCustomToast(
                    "خطا",
                    "دریافت زیر‌دپارتمان‌ها با مشکل مواجه شد",
                    "x",
                    "error"
                );
            }
        };

        getSubDepartments();
    }, [departmentID]);


    const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);

        if (!selectedFiles.length) return;

        const remainingSlots = 5 - files.length;

        if (remainingSlots <= 0) {
            showCustomToast(
                "خطا",
                "حداکثر 5 فایل می‌توانید پیوست کنید",
                "x",
                "error"
            );

            return;
        }

        const filesToAdd = selectedFiles.slice(0, remainingSlots);

        const newFiles: TicketFile[] = filesToAdd.map((file) => ({
            id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
            file,
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((item) => item.id !== id));
    };


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (loading) return;

        const trimmedTitle = title.trim();
        const trimmedBody = body.trim();

        if (!trimmedTitle) {
            showCustomToast(
                "خطا",
                "عنوان تیکت را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        if (trimmedBody.length < 10) {
            showCustomToast(
                "خطا",
                "متن تیکت باید حداقل 10 کاراکتر باشد",
                "x",
                "error"
            );
            return;
        }

        if (departmentID === "-1") {
            showCustomToast(
                "خطا",
                "لطفاً دپارتمان مربوطه را انتخاب کنید",
                "x",
                "error"
            );
            return;
        }

        if (subDepartmentID === "-1") {
            showCustomToast(
                "خطا",
                "لطفاً زیر‌دپارتمان مربوطه را انتخاب کنید",
                "x",
                "error"
            );
            return;
        }

        if (!["high" , "medium"  , "high"].includes(priority)) {
            showCustomToast(
                "خطا",
                "میزان اولویت تیکت را مشخص کنید",
                "x",
                "error"
            );
            return;
        }

        try {
            setLoading(true);

            const ticket = {
                title: trimmedTitle,
                body: trimmedBody,
                department: departmentID,
                subDepartment: subDepartmentID,
                priority,
            };

            const res = await fetch("/api/ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticket),
            });



            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data?.message || "ثبت تیکت با مشکل مواجه شد"
                );
            }

            showCustomToast(
                "موفق",
                "تیکت شما با موفقیت ثبت شد",
                "x",
                "success"
            );

            setTitle("");
            setBody("");
            setDepartmentID("-1");
            setSubDepartmentID("-1");
            setSubDepartments([]);
            setPriority("-1");
            setFiles([]);

            router.push("/panel/tickets");

        } catch (error) {
            console.error(error);

            showCustomToast(
                "خطا",
                error instanceof Error
                    ? error.message
                    : "ثبت تیکت با مشکل مواجه شد",
                "x",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        if (loading) return;

        setTitle("");
        setBody("");
        setDepartmentID("-1");
        setSubDepartmentID("-1");
        setSubDepartments([]);
        setPriority("-1");
        setFiles([]);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-[18px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7 md:p-8"
        >
            {/* Title */}
            <div className="mb-6">
                <label
                    htmlFor="title"
                    className="mb-2 block text-[14px] font-medium text-gray-800"
                >
                    عنوان تیکت
                </label>

                <input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="مثلاً مشکل در پرداخت رزرو"
                    className="h-[48px] w-full rounded-[10px] border border-gray-200 bg-white px-4 text-[14px] text-gray-800 transition outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    required
                />
            </div>

            {/* Department */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="department"
                        className="mb-2 block text-[14px] font-medium text-gray-800"
                    >
                        دپارتمان
                    </label>

                    <div className="relative">
                        <select
                            id="department"
                            name="department"
                            value={departmentID}
                            onChange={(event) =>
                                setDepartmentID(event.target.value)
                            }
                            className="h-[48px] w-full appearance-none rounded-[10px] border border-gray-200 bg-white px-4 text-[14px] text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                            required
                        >
                            <option value="-1">
                                لطفاً دپارتمان مرتبط را انتخاب کنید
                            </option>

                            {departments.map((department) => (
                                <option
                                    key={department._id}
                                    value={department._id}
                                >
                                    {department.title}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={18}
                            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>

                {/* Sub Department */}
                <div>
                    <label
                        htmlFor="subDepartment"
                        className="mb-2 block text-[14px] font-medium text-gray-800"
                    >
                        زیر‌دپارتمان
                    </label>

                    <div className="relative">
                        <select
                            id="subDepartment"
                            name="subDepartment"
                            value={subDepartmentID}
                            onChange={(event) =>
                                setSubDepartmentID(event.target.value)
                            }
                            disabled={
                                departmentID === "-1" ||
                                subDepartments.length === 0
                            }
                            className="h-[48px] w-full appearance-none rounded-[10px] border border-gray-200 bg-white px-4 text-[14px] text-gray-700 outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                            required
                        >
                            <option value="-1">
                                {departmentID === "-1"
                                    ? "ابتدا دپارتمان را انتخاب کنید"
                                    : subDepartments.length === 0
                                      ? "هیچ زیر‌دپارتمانی وجود ندارد"
                                      : "لطفاً زیر‌دپارتمان را انتخاب کنید"}
                            </option>

                            {subDepartments.map((subDepartment) => (
                                <option
                                    value={subDepartment._id}
                                    key={subDepartment._id}
                                >
                                    {subDepartment.title}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={18}
                            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Priority */}
            <div className="mt-6">
                <label
                    htmlFor="priority"
                    className="mb-2 block text-[14px] font-medium text-gray-800"
                >
                    اولویت
                </label>

                <div className="relative">
                    <select
                        id="priority"
                        name="priority"
                        value={priority}
                        onChange={(event) =>
                            setPriority(event.target.value as "low" | "medium" | "high")
                        }
                        className="h-[48px] w-full appearance-none rounded-[10px] border border-gray-200 bg-white px-4 text-[14px] text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    >
                        <option value={-1}>
                            میزان اولویت پیام را مشخص کنید
                        </option>

                        <option value={"low"}>کم</option>
                        <option value={"medium"}>متوسط</option>
                        <option value={"high"}>زیاد</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                    />
                </div>
            </div>

            {/* Body */}
            <div className="mt-6">
                <label
                    htmlFor="body"
                    className="mb-2 block text-[14px] font-medium text-gray-800"
                >
                    متن درخواست
                </label>

                <textarea
                    id="body"
                    name="body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    rows={7}
                    placeholder="مشکل یا درخواست خود را به صورت کامل توضیح دهید..."
                    className="w-full resize-none rounded-[10px] border border-gray-200 bg-white p-4 text-[14px] leading-7 text-gray-800 transition outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    required
                />
            </div>

            {/* Attachments */}
            <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-[14px] font-medium text-gray-800">
                        فایل پیوست
                    </label>

                    <span className="text-[12px] text-gray-400">
                        حداکثر 5 فایل
                    </span>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFiles}
                    className="hidden"
                    accept="image/*,.pdf"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={files.length >= 5}
                    className="flex min-h-[120px] w-full flex-col items-center justify-center rounded-[12px] border border-dashed border-gray-300 bg-gray-50 px-4 text-center transition hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                        <Upload
                            size={19}
                            className="text-gray-500"
                        />
                    </div>

                    <span className="text-[13px] font-medium text-gray-700">
                        برای انتخاب فایل کلیک کنید
                    </span>

                    <span className="mt-1 text-[12px] text-gray-400">
                        تصویر و PDF
                    </span>
                </button>

                {/* File List */}
                {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {files.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-3 rounded-[10px] border border-gray-200 bg-white px-3 py-3"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                        <File
                                            size={17}
                                            className="text-gray-500"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-[13px] font-medium text-gray-700">
                                            {item.file.name}
                                        </p>

                                        <p className="mt-1 text-[11px] text-gray-400">
                                            {(item.file.size / 1024).toFixed(0)} KB
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeFile(item.id)}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="mt-6 flex gap-3 rounded-[10px] bg-gray-50 p-4">
                <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-gray-500"
                />

                <p className="text-[12px] leading-6 text-gray-500">
                    لطفاً اطلاعات درخواست خود را کامل و دقیق وارد کنید.
                    در صورت نیاز می‌توانید تصویر یا فایل مرتبط با مشکل
                    خود را نیز پیوست کنید.
                </p>
            </div>

            {/* Submit */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="h-[48px] rounded-[10px] border border-gray-200 px-6 text-[14px] font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    انصراف
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex h-[48px] items-center justify-center gap-2 rounded-[10px] bg-gray-900 px-7 text-[14px] font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Send size={17} />

                    {loading ? "در حال ثبت..." : "ثبت تیکت"}
                </button>
            </div>
        </form>
    );
}

export default CreateTicketForm;

