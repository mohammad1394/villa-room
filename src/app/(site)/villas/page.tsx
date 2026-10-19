import React from 'react';
import VillaContent from "@/components/modules/villa/VillaContent/VillaContent";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/modules/layout/container/Container";
import Booking from "@/models/Booking";
import Villa from "@/models/Villa";


async function Page() {

    const data = await Villa
        .find({})
        .lean();

    const villas = JSON.parse(JSON.stringify(data));

    return (

            <Container className={"my-10"}>

                {/*villa Cards*/}
                <VillaContent villas={villas}/>

            </Container>

    );
}

export default Page;