import CreateTicketForm from "@/components/templates/panel/create-ticket/CreateTicketForm";

export default function CreateTicket() {


    return (
        <main className="min-h-screen bg-[#f8f9fb] py-8 sm:py-10 md:py-12">
            <div className="mx-auto w-full max-w-[900px] px-4 sm:px-6">

                {/* Header */}
                <div className="mb-7 text-right">
                    <h1 className="text-[24px] font-bold text-gray-900 sm:text-[28px]">
                        ثبت تیکت جدید
                    </h1>

                    <p className="mt-2 text-[14px] leading-6 text-gray-500 sm:text-[15px]">
                        درخواست یا مشکل خود را ثبت کنید تا کارشناسان ما در
                        سریع‌ترین زمان ممکن بررسی کنند.
                    </p>
                </div>

                {/* Form */}
                <CreateTicketForm/>
            </div>
        </main>
    );
}
