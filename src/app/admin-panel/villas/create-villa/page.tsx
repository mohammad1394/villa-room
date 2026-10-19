import VillaForm from "@/components/templates/adminPanel/villas/createvilla/VillaForm";

export default function CreateVillaPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-6" dir="rtl">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        افزودن ویلا
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        اطلاعات ویلا را وارد کنید و آن را به لیست ویلاها اضافه کنید.
                    </p>
                </div>

                <VillaForm />
            </div>
        </div>
    );
}