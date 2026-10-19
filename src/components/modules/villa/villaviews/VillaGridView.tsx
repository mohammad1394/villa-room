import VillaGridCard from "@/components/modules/villa/villacards/VillaGridCard";
import {VillaType} from "@/types/Villa";





function VillaGridView({ villas }: { villas: VillaType[] }) {

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {villas.map((villa) => (
                <VillaGridCard
                    key={villa._id}
                    {...villa}
                />
            ))}
        </div>
    );
}
export default VillaGridView;