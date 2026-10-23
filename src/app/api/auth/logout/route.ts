import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function DELETE(){
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return NextResponse.json({message : "شما با موفقیت خارج شدید"})
}