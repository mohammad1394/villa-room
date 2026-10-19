import Image from "next/image";

type Props = {
    title: string,
    image: string,
    villaCount: string,
}
function PopularDestinationCard({title , image ,villaCount } : Props) {
    return (
        <div className={"relative w-[100%] lg:w-[280px] h-[200px] rounded-[10px] overflow-hidden flex items-center justify-center"}>
            <div className="absolute inset-0 bg-[rgba(20,30,40,0.35)]"></div>
            <Image
                src={image}
                alt={"kalarDasht"}
                width={400}
                height={400}
                className={"w-full h-[200]"}
            />
            <p className={"absolute text-white z-10 bottom-15 "}>
                {title}
            </p>
            <p className={"absolute text-white z-10 bottom-5 "}>
                {villaCount} ویلا
            </p>
        </div>
    );
}

export default PopularDestinationCard;