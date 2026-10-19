import Hero from "@/components/templates/home/Hero";
import VillaSuggest from "@/components/templates/home/VillaSuggest";
import WhyUs from "@/components/templates/home/WhyUs";
import PopularDestination from "@/components/templates/home/PopularDestination";
import Container from "@/components/modules/layout/container/Container";
import {cookies} from "next/headers";
import {verifyAccessToken} from "@/utility/auth";
import UserModel from "@/models/User";


export default async function Home() {





    return (


        <div className={"mx-auto w-[100%] bg-[#F5F7F8]"}>
            <Hero/>
            <Container>
                <VillaSuggest/>
                <WhyUs/>
                <PopularDestination/>
                {/*<NewsLetter/>*/}
            </Container>
        </div>
    )
}
