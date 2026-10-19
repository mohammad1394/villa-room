// "use client";
//
// import React, {useRef, useState} from "react";
// import {
//     ArrowRight,
//     Paperclip,
//     Send,
//     UserRound,
//     Headphones,
//     Clock3,
//     CheckCircle2,
//     CircleDot,
//     X,
//     FileText,
// } from "lucide-react";
// import TicketItem from "@/components/modules/TicketItem/TicketItem";
// import {TicketType} from "@/types/Ticket";
//
//
// type TicketChatProps = {
//     ticket : TicketType
//     message : Message[]
// }
//
// type Message = {
//     TicketId: string;
//     senderId: string;
//     senderRole : "User " | "support";
//     body: string;
//     createdAt: string;
// };
//
// export default function TicketChat({message  , ticket}  : TicketChatProps) {
//     // const [messages, setMessages] = useState<Message[]>(initialMessages);
//     // const [message, setMessage] = useState("");
//     // const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     //
//     // const fileInputRef = useRef<HTMLInputElement>(null);
//     //
//     // const handleSendMessage = () => {
//     //     if (!message.trim() && !selectedFile) return;
//     //
//     //     const newMessage: Message = {
//     //         id: Date.now().toString(),
//     //         sender: "user",
//     //         message: message.trim(),
//     //         createdAt: new Date().toLocaleTimeString("fa-IR", {
//     //             hour: "2-digit",
//     //             minute: "2-digit",
//     //         }),
//     //         file: selectedFile
//     //             ? {
//     //                 name: selectedFile.name,
//     //                 url: "#",
//     //             }
//     //             : undefined,
//     //     };
//     //
//     //     setMessages((prev) => [...prev, newMessage]);
//     //
//     //     setMessage("");
//     //     setSelectedFile(null);
//     //
//     //     if (fileInputRef.current) {
//     //         fileInputRef.current.value = "";
//     //     }
//     // };
//     //
//     // const handleKeyDown = (
//     //     e: React.KeyboardEvent<HTMLTextAreaElement>
//     // ) => {
//     //     if (e.key === "Enter" && !e.shiftKey) {
//     //         e.preventDefault();
//     //         handleSendMessage();
//     //     }
//     // };
//
//     return (
//         <div
//             dir="rtl"
//             className="mx-auto w-full max-w-[1000px]"
//         >
//             {/* Back */}
//             <button
//                 type="button"
//                 className="mb-5 flex items-center gap-2 text-sm text-gray-500 transition hover:text-[var(--primary)]"
//             >
//                 <ArrowRight size={18}/>
//                 بازگشت به تیکت‌ها
//             </button>
//
//             {/* Main Card */}
//             <div
//                 className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
//             >
//                 {/* Header */}
//                 <div
//                     className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:p-6 md:flex-row md:items-center md:justify-between"
//                 >
//                     <div className="flex items-center gap-3">
//                         <div
//                             className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-white"
//                         >
//                             <Headphones size={21}/>
//                         </div>
//
//                         <div>
//                             <h1 className="text-base font-bold text-gray-900 sm:text-lg">
//                                 {ticket.title}
//                             </h1>
//                         </div>
//                     </div>
//
//                     {/* Status */}
//                     <div
//                         className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600"
//                     >
//                         <CircleDot size={13}/>
//                         {ticket.status}
//                     </div>
//                 </div>
//
//                 {/* Ticket Info */}
//                 <div
//                     className="grid grid-cols-1 gap-4 border-b border-gray-100 bg-gray-50/70 p-4 sm:grid-cols-3 sm:p-5"
//                 >
//                     <TicketItem
//                         icon={<UserRound size={17}/>}
//                         label="دپارتمان"
//                         value={ticket.department.title}
//                     />
//
//                     <TicketItem
//                         icon={<Clock3 size={17}/>}
//                         label="تاریخ ایجاد"
//                         value={new Date (ticket.createdAt).toLocaleDateString("fa-IR") }
//                     />
//
//                     <TicketItem
//                         icon={<CheckCircle2 size={17}/>}
//                         label="اولویت"
//                         value={ticket.status}
//                     />
//                 </div>
//
//                 {/* Chat */}
//                 <div className="flex h-[520px] flex-col">
//                      Messages
//                     <div
//                         className="flex-1 space-y-5 overflow-y-auto bg-[#fafafa] p-4 sm:p-6"
//                     >
//                         {message.map((item) => {
//                             const isUser = item.senderId.Role === "user";
//
//                             return (
//                                 <div
//                                     key={item._id}
//                                     className={`flex ${
//                                         isUser
//                                             ? "justify-start"
//                                             : "justify-end"
//                                     }`}
//                                 >
//                                     <div
//                                         className={`
//                                             flex
//                                             max-w-[90%]
//                                             gap-2
//                                             sm:max-w-[75%]
//                                             ${
//                                             isUser
//                                                 ? "flex-row-reverse"
//                                                 : "flex-row"
//                                         }
//                                            `}
//                                     >
//                                         {/* Avatar */}
//                                         <div
//                                             className={`
//                                              flex
//                                              h-9
//                                              w-9
//                                              shrink-0
//                                              items-center
//                                              justify-center
//                                              rounded-full
//                                             ${
//                                                 isUser
//                                                     ? "bg-gray-200 text-gray-600"
//                                                     : "bg-[var(--primary)] text-white"
//                                             }
//                                             `}
//                                         >
//                                             {isUser ? (
//                                                 <UserRound size={17}/>
//                                             ) : (
//                                                 <Headphones size={17}/>
//                                             )}
//                                         </div>
//
//                                         {/* Message */}
//                                         <div>
//                                             <div
//                                                 className={`
//                                                 rounded-2xl
//                                                 px-4
//                                                 py-3
//                                                 text-sm
//                                                 leading-7
//                                                     ${
//                                                     isUser
//                                                         ? "rounded-tr-md bg-white text-gray-700 shadow-sm"
//                                                         : "rounded-tl-md bg-[var(--primary)] text-white"
//                                                 }
//                                               `}
//                                             >
//                                                 {item.body && (
//                                                     <p className="whitespace-pre-line">
//                                                         {item.body}
//                                                     </p>
//                                                 )}
//
//                                                 {/* File */}
//                                                 {/*{item. && (*/}
//                                                 {/*    <div*/}
//                                                 {/*        className="mt-3 flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-3"*/}
//                                                 {/*    >*/}
//                                                 {/*        <FileText*/}
//                                                 {/*            size={20}*/}
//                                                 {/*        />*/}
//
//                                                 {/*        <span className="truncate text-xs">*/}
//                                                 {/*            {item.file.name}*/}
//                                                 {/*        </span>*/}
//                                                 {/*    </div>*/}
//                                                 {/*)}*/}
//                                             </div>
//
//                                             <div
//                                                 className={`
//                                                         mt-1
//                                                         text-[10px]
//                                                         text-gray-400
//                                                 ${
//                                                     isUser
//                                                         ? "text-right"
//                                                         : "text-left"
//                                                 }
// `}
//                                             >
//                                                 {item.createdAt}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//
//                     {/* Composer */}
//                     <div
//                         className="border-t border-gray-200 bg-white p-3 sm:p-4"
//                     >
//                          Selected file
//                         {selectedFile && (
//                             <div
//                                 className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
//                             >
//                                 <div className="flex min-w-0 items-center gap-2">
//                                     <FileText
//                                         size={17}
//                                         className="shrink-0 text-gray-500"
//                                     />
//
//                                     <span className="truncate text-xs text-gray-600">
//                                         {selectedFile.name}
//                                     </span>
//                                 </div>
//
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setSelectedFile(null);
//
//                                         if (fileInputRef.current) {
//                                             fileInputRef.current.value = "";
//                                         }
//                                     }}
//                                     className="rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
//                                 >
//                                     <X size={16}/>
//                                 </button>
//                             </div>
//                         )}
//
//                         <div className="flex items-end gap-2">
//                             {/* Attachment */}
//                             <button
//                                 type="button"
//                                 onClick={() =>
//                                     fileInputRef.current?.click()
//                                 }
//                                 className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-[var(--primary)]"
//                             >
//                                 <Paperclip size={19}/>
//                             </button>
//
//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 className="hidden"
//                                 onChange={(e) => {
//                                     const file = e.target.files?.[0];
//
//                                     if (file) {
//                                         setSelectedFile(file);
//                                     }
//                                 }}
//                             />
//
//                             {/* Textarea */}
//                             <textarea
//                                 value={message}
//                                 onChange={(e) =>
//                                     setMessage(e.target.value)
//                                 }
//                                 onKeyDown={handleKeyDown}
//                                 placeholder="پیام خود را بنویسید..."
//                                 rows={1}
//                                 className="max-h-[110px] min-h-[44px] flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 transition outline-none placeholder:text-gray-400 focus:border-[var(--primary)] focus:bg-white"
//                             />
//
//                             {/* Send */}
//                             <button
//                                 type="button"
//                                 onClick={handleSendMessage}
//                                 disabled={
//                                     !message.trim() &&
//                                     !selectedFile
//                                 }
//                                 className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
//                             >
//                                 <Send size={18}/>
//                             </button>
//                         </div>
//
//                         <p className="mt-2 hidden text-[11px] text-gray-400 sm:block">
//                             برای ارسال پیام کلید Enter را بزنید؛ برای خط جدید
//                             از Shift + Enter استفاده کنید.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }