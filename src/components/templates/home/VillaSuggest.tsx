import React from "react";
import VillaGridCard from "@/components/modules/villa/villacards/VillaGridCard";
import SeeAllBtn from "@/components/modules/layout/button/SeeAllBtn";
import { VillaType} from "@/types/Villa";
import Villa from "@/models/Villa";
import connectToDB from "@/config/db";



async function VillaSuggest() {

    await connectToDB();

    const data = await Villa
        .find({} , "rating title city pricePerNight images")
        .lean();

    const villas : VillaType[] = JSON.parse(JSON.stringify(data));

    const suggestedVillas: VillaType[] = villas.filter(
        (data) => data.rating > 3
    );


    return (
        <section className="mx-auto my-[130px]  px-4 md:my-[80px] md:px-0">

            {/* Header */}
            <div className="mb-[32px] flex items-center justify-between">

                <div className="text-right">
                    <h4 className="text-[20px] font-bold">
                        ویلاهای ویژه
                    </h4>

                    <p className="mt-[6px] text-[15px] text-[#66727D]">
                        بهترین پیشنهادهای ما برای شما
                    </p>
                </div>

                <SeeAllBtn/>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4">
                {
                    suggestedVillas.map(villa => (
                        <VillaGridCard {...villa}/>
                    ))
                }
            </div>

        </section>
    );
}

export default VillaSuggest;