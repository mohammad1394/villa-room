import React from 'react';
import UsersConent from "@/components/templates/adminPanel/users/UsersConent";
import connectToDB from "@/config/db";
import User from "@/models/User";

async function Page() {

    connectToDB();

    const users = await User.find({}).lean();

    const usersSerialize = JSON.parse(JSON.stringify(users));




    return (
        <div>
            <UsersConent users = {usersSerialize} />
        </div>
    );
}

export default Page;