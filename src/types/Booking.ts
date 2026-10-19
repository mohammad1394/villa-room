import { VillaType } from "@/types/Villa";
import {UserType} from "@/types/User";

export type BookingStatus =
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed";

export type BookingType = {
    _id: string;
    userId: UserType;
    villaId: VillaType ;

    checkIn: string;
    checkOut: string;

    guests: number;
    nights: number;

    pricePerNight: number;
    subtotal: number;
    serviceFee: number;
    totalPrice: number;

    status: BookingStatus;

    createdAt: string;
    updatedAt: string;
};