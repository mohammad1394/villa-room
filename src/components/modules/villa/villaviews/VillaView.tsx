import React from "react";

import VillaListView from "@/components/modules/villa/villaviews/VillaListView";
import EmptyFavorite from "@/components/templates/wishlist/EmptyFavorite";
import VillaGridView from "@/components/modules/villa/villaviews/VillaGridView";
import { VillaType} from "@/types/Villa";


type ViewMode = "grid" | "list";

type VillaViewProps = {
    villas: VillaType[];
    viewMode: ViewMode;
};

function VillaView({
                       villas,
                       viewMode,
                   }: VillaViewProps) {

    if (!villas || villas.length === 0) {
        return <EmptyFavorite />;
    }

    return (
        <section
            dir="rtl"
            className="w-full"
        >
            {viewMode === "grid" ? (
                <VillaGridView villas={villas} />
            ) : (
                <VillaListView villas={villas} />
            )}
        </section>
    );
}

export default VillaView;