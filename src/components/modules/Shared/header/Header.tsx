import Link from "next/link";
import Image from "next/image";
import {Hamburger, Menu} from "lucide-react";
import Navbar from "@/components/modules/Shared/header/Navbar";
import AOSinit from "@/utility/aos";
import {Toaster} from "react-hot-toast";
import Footer from "@/components/modules/Shared/Footer";
import NavbarActions from "@/components/modules/Shared/header/NavbarActions";
import {cookies} from "next/headers";
import {verifyAccessToken} from "@/utility/auth";
import UserModel from "@/models/User";
import {notFound} from "next/navigation";

export interface Root {
    _id: string
    fullName: string
}

async function Header() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let user = null

    if (token) {
        const tokenPayload = verifyAccessToken(token);
        if (tokenPayload) {
            user  = await UserModel.findOne({email: tokenPayload.email} , "fullName role"  ).lean();
            if (!user) {
                return ;
            }

             user = {
                ...user,
                _id: user._id.toString(),
            };
        }
    }


    return (
        <header className="h-[88px] w-full border-b border-[#E1E5E8] bg-white ">
            <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-8 ">

                <div className={"flex md:hidden"}>
                    <Menu
                     size={30}
                    />
                </div>
                {/* Logo */}
                <Link href="/" className="hidden md:flex justify-center items-center">
                    {/*<Image*/}
                    {/*    src="/images/logo.png"*/}
                    {/*    alt="لوگو"*/}
                    {/*    width={120}*/}
                    {/*    height={40}*/}
                    {/*    priority*/}
                    {/*/>*/}
                    <h2 className={"text-[40px] text-[var(--primary)] font-bold"}>
                        ویلاروم
                    </h2>

                </Link>

                {/* Navbar */}
                 <Navbar/>

                {/* Actions */}
               <NavbarActions user = {user}/>

            </div>
        </header>
    );
}

export default Header;