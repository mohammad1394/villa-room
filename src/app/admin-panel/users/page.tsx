import React from 'react';
import UsersConent from "@/components/templates/adminPanel/users/UsersConent";
import connectToDB from "@/config/db";
import User from "@/models/User";
import {getCurrentUser} from "@/utility/getCurrentUser";

async function Page() {

    connectToDB();

    const USER =  getCurrentUser();

    console.log(USER);

    const users = await User.find({}).lean();

    const usersSerialize = JSON.parse(JSON.stringify(users));




    return (
        <div>
            <UsersConent users = {usersSerialize} />
        </div>
    );
}

export default Page;