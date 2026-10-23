import React from 'react';
import imamge from "public/assets/herobg.jpg"
import SearchBox from "@/components/modules/searchbox/SearchBox";
function Hero() {
    return (
        <div className={"bg-[url('/assets/herobg.jpg')] w-[100%] bg-cover bg-center h-[600px]  bg-no-repeat relative "}>

            {/*overlay*/}
            <div className="absolute inset-0 bg-[rgba(20,30,40,0.35)]"></div>

            {/*Content*/}
            <div className="relative z-10 mx-auto flex h-full w-[80%] md:items-center md:justify-start pt-10  items-start">
                <div className="w-[80%] lg:w-[50%] text-right text-white">

                    <p className="text-[30px] lg:text-[48px] font-bold leading-[1.4]">
                        بهترین ویلا ها
                        <br />
                        برای بهترین خاطره ها
                    </p>

                    <p className="mt-4 text-[18px] leading-[1.8]">
                        می خوای یه تعطیلات خاص و متفاوت تجربه کنی ؟
                        <br />
                        از بین صد ها ویلا ، بهترینش رو انتخاب کن.
                    </p>

                </div>
            </div>

            {/*searchbox*/}

            <div
                className="
                    absolute
                    z-20
                    left-0
                    right-0
                    bottom-0
                    translate-y-1/2
                "
            >
                <SearchBox />
            </div>
        </div>
    );
}

export default Hero;