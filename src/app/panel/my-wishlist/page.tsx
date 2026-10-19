import Favorite from "@/models/Favorite";
import "@/models/Villa";
import {redirect} from "next/navigation";
import {WishlistItem} from "@/types/WishList";
import VillaContent from "@/components/modules/villa/VillaContent/VillaContent";
import {getCurrentUser} from "@/utility/getCurrentUser";

async function FavoriteVillasPage() {
    const user = await getCurrentUser();

    const wishlist: WishlistItem[] = await Favorite
        .find({userId: user._id})
        .populate("villaId")
        .lean();

    const villas = wishlist
        .map((item) => item.villaId)
        .filter(Boolean)
        .map((villa) => ({
            ...villa,
            _id: villa._id.toString(),
        }));


    return (
        <div className={"mx-auto w-[95%]"}>


            <div className="my-5">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    علاقه مندی های من
                </h1>

                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    تمامی ویلای های مورد علاقه خود را در این قسمت مشاهده کنید.
                </p>
            </div>
            {/*villa Cards*/}
            <VillaContent villas={villas}/>
        </div>
    );
}

export default FavoriteVillasPage;
