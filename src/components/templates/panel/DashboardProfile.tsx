import Image from "next/image";
import { Crown } from "lucide-react";

type DashboardProfileProps = {
    name : string
    date : string
    avatar : string
}


export default  function DashboardProfile({date , name , avatar} : DashboardProfileProps) {


    return (
        <div
            className="
                rounded-[14px]
                border border-gray-200
                bg-white
                p-6
            "
        >
            <div className="flex items-center gap-4">
                <Image
                    src={avatar || "/assets/avatar.jpg"}
                    alt="avatar"
                    width={75}
                    height={75}
                    className="rounded-full object-cover"
                />

                <div>
                    <h2 className="text-[17px] font-bold text-[#17334d]">
                        {name}
                    </h2>

                    <p className="mt-1 text-[10px] text-gray-500">
                        عضو ویلا روم از تاریخ :
                        {
                            new Date(date).toLocaleDateString("fa-IR")
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}