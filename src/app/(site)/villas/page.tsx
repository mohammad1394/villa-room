import React from 'react';
import VillaContent from "@/components/modules/villa/VillaContent/VillaContent";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/modules/layout/container/Container";


async function Page() {


    const res = await fetch("http://localhost:3000/api/villa");

    const {villas} = await res.json();


    return (

            <Container className={"my-10"}>

                {/*villa Cards*/}
                <VillaContent villas={villas}/>

            </Container>

    );
}

export default Page;