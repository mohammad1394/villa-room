import VillaListCard from "@/components/modules/villa/villacards/VillaListCard";
import { VillaType} from "@/types/Villa";


function VillaListView({ villas }: { villas: VillaType[] })  {
    return (
        <div className="flex flex-col gap-4">
            {villas.map((villa) => (
                <VillaListCard
                    key={villa._id}
                    {...villa}
                />
            ))}
        </div>
    );
}

export default VillaListView;