
export type VillaType = {
    _id: string;
    title: string;
    description: string;
    type: "forest" | "beach" | "pool" | "mountain";
    province: "Mazandaran" | "Gilan";
    city: string;
    address: string;
    images: string[];
    pricePerNight: number;
    capacity: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    rating: number;
    reviewsCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
