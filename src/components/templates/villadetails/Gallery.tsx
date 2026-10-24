
import Image from "next/image";

function Gallery({ images }: { images: string[] }) {
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {images.map((image, i) => (
                <Image
                    key={`${image}-${i}`}
                    src={image}
                    alt={`تصویر ${i + 1} ویلا`}
                    width={400}
                    height={400}
                    className="h-[120px] w-full rounded-lg object-cover sm:h-[130px]"
                />
            ))}
        </div>
    );
}

export default Gallery;
