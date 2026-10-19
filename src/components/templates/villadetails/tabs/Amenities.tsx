import {
    Waves,
    Wifi,
    Tv,
    Flame,
    Snowflake,
    Utensils,
    Bath,
    BedDouble,
    AirVent,
    CircleParking,
    Dumbbell,
    Gamepad2,
    TreePine,
    ShieldCheck,
    WashingMachine,
} from "lucide-react";

const amenityIcons: Record<string, React.ElementType> = {
    "استخر": Waves,
    "پارکینگ": CircleParking,
    "وای‌فای": Wifi,
    "تلویزیون": Tv,
    "باربیکیو": Flame,
    "کولر گازی": Snowflake,
    "آشپزخانه": Utensils,
    "حمام": Bath,
    "تخت خواب": BedDouble,
    "سیستم تهویه": AirVent,
    "باشگاه": Dumbbell,
    "فضای بازی": Gamepad2,
    "باغ": TreePine,
    "نگهبانی": ShieldCheck,
    "ماشین لباسشویی": WashingMachine,
};

function Amenities({ amenities }: { amenities: string[] }) {
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
            {amenities.map((amenity: string, index: number) => {
                const Icon = amenityIcons[amenity] || ShieldCheck;

                return (
                    <div
                        key={index}
                        className="flex items-center gap-3"
                    >
                        <Icon
                            size={21}
                            strokeWidth={1.8}
                            className="text-[var(--primary)]"
                        />

                        <div>
                            <p className="text-[12px] text-[#8A949C]">
                                {amenity}
                            </p>

                            <p className="mt-1 text-[13px] font-medium text-[#172B3A]">
                                دارد
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Amenities;