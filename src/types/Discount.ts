
import {VillaType} from "@/types/Villa";
import {UserType} from "@/types/User";

export type DiscountStatus = "active" | "expired" | "finished" | "inactive";

export type DiscountType = {
    _id: string;
    code: string;
    userId ?: UserType
    villaId ?: VillaType
    maxUse: number;
    uses: number;
    expire: string;
    percent: number;
    status: DiscountStatus;
}