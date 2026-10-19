import {VillaType} from "@/types/Villa";
import {BookingType} from "@/types/Booking";
import {UserType} from "@/types/User";

export type ReviewStatus =
    | "pending"
    | "approved"
    | "rejected"


export type ReviewType = {
    _id: string
    userId: UserType
    villaId: VillaType
    bookingId: BookingType
    rating: number
    comment: string
    status: ReviewStatus
    createdAt: string
    updatedAt: string
    __v: number
}