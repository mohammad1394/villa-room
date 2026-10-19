import React from 'react';
import {Star} from "lucide-react";
import {showCustomToast} from "@/components/modules/layout/toast/toast";

function ReviewForm({villaId } : {villaId: string}) {
    const [comment, setComment] = React.useState("");
    const [rating, setRating] = React.useState(5);

    const submitScore = (score : number) => {
        setRating(score)
    }

    const handleClick = async () => {
        if (comment === "") {
            showCustomToast(
                "خطا",
                "لطفا نظر خود را وارد کنید",
                "x",
                "error"
            );
            return;
        }
        if (comment.trim().length < 10 ){
            showCustomToast(
                "خطا",
                "طول نظر باید از 10 کاراکتر بیشتر باشد",
                "x",
                "error"
            );
            return;
        }

        const res = await fetch("/api/review" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                villaId ,
                comment : comment.trim(),
                rating
            })
        })
        const data = await res.json();

        if (res.status !== 201) {
            showCustomToast(
                "خطا",
                `${data.message}`,
                "x",
                "error"
            );
            return;
        }

        if (res.status === 201){
            showCustomToast(
                "موفق",
                "کامنت شما با موفقیت ثبت شد",
                "check",
                "success"
            );
            setComment("")
            setRating(0);
        }


    }

    return (
        <div className="rounded-xl border border-[#E8ECEF] bg-white p-5 sm:p-6">

            <div>
                <h3 className="text-[15px] font-bold text-[#172B3A]">
                    نظر خود را ثبت کنید
                </h3>

                <p className="mt-1 text-[11px] text-[#8A949C]">
                    تجربه خود را از اقامت در این ویلا با دیگران به اشتراک بگذارید.
                </p>
            </div>

            {/* امتیاز */}
            <div className="mt-6">
                <p className="mb-3 text-[12px] font-medium text-[#172B3A]">
                    امتیاز شما
                </p>

                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="transition hover:scale-110"
                            onClick={() => submitScore(star)}
                        >
                            <Star
                                size={22}
                                strokeWidth={1.7}
                                className="text-[#F5B544]"
                                fill={star <= rating ? "currentColor" : "none"}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* متن نظر */}
            <div className="mt-5">
                <label
                    htmlFor="comment"
                    className="mb-2 block text-[12px] font-medium text-[#172B3A]"
                >
                    نظر شما
                </label>

                <textarea
                    id="comment"
                    rows={5}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="تجربه خود از اقامت در این ویلا را بنویسید..."
                    className="w-full resize-none rounded-[10px] border border-[#E1E5E8] bg-[#FAFBFC] p-3 text-[12px] leading-6 text-[#172B3A] transition outline-none placeholder:text-[#A5ADB4] focus:border-[var(--primary)] focus:bg-white"
                />
            </div>

            {/* دکمه */}
            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={handleClick}
                    className="rounded-[10px] bg-[var(--primary)] px-6 py-3 text-[12px] font-medium text-white transition hover:opacity-90"
                >
                    ثبت نظر
                </button>
            </div>

        </div>
    );
}

export default ReviewForm;