import React from 'react';
import Image from "next/image";
function Gallery() {
    return (
            <div
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
                <Image
                    src="/assets/herobg.jpg"
                    alt="villa image"
                    width={400}
                    height={400}
                    className="h-[120px] w-full rounded-lg object-cover sm:h-[130px]"
                />

                <Image
                    src="/assets/herobg.jpg"
                    alt="villa image"
                    width={400}
                    height={400}
                    className="h-[120px] w-full rounded-lg object-cover sm:h-[130px]"
                />

                <Image
                    src="/assets/herobg.jpg"
                    alt="villa image"
                    width={400}
                    height={400}
                    className="h-[120px] w-full rounded-lg object-cover sm:h-[130px]"
                />

                <Image
                    src="/assets/herobg.jpg"
                    alt="villa image"
                    width={400}
                    height={400}
                    className="h-[120px] w-full rounded-lg object-cover sm:h-[130px]"
                />
            </div>

    );
}

export default Gallery;