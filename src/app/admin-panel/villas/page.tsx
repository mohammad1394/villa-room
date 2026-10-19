import React from 'react';

import connectToDB from "@/config/db";
import Villa from "@/models/Villa";
import VillaContent from "@/components/templates/adminPanel/villas/VillaContent";


async function Page() {

    await connectToDB();

    const villas = await Villa.find({}).lean();

    const villasSerialize = JSON.parse(JSON.stringify(villas));


    return (
        <div>
            <VillaContent villas={villasSerialize} />
        </div>
    );
}

export default Page;