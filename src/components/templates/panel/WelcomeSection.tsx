export default function WelcomeSection({name} : {name : string}) {
    return (
        <div className="text-right">
            <h1 className="text-[24px] font-bold text-[#17334d] sm:text-[28px]">
                سلام {name} عزیز
            </h1>

            <p className="mt-2 text-[12px] text-gray-500">
                خوش آمدید! امیدواریم روز خوبی داشته باشید.
            </p>
        </div>
    );
}