"use client";

import {useState} from "react";
import VillaView from "@/components/modules/villa/villaviews/VillaView";
import {VillaType} from "@/types/Villa";
import VillaFilter from "@/components/modules/villa/VillaFilter/VillaFilter";


function VillaContent({villas}: { villas: VillaType[] }) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    return (
        <>
            <VillaFilter
                villasCount={villas.length}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            <VillaView
                villas={villas}
                viewMode={viewMode}
            />
        </>
    );
}

export default VillaContent;