import {VillaType} from "@/types/Villa";

export type WishlistItem = {
    _id: string;
    userId: string;
    villaId: VillaType ;
    createdAt: Date;
    updatedAt: Date;
};