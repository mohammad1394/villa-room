import React from 'react';
import DiscountsContent from "@/components/templates/adminPanel/discount/DiscountContent";
import connectToDB from "@/config/db";
import discount from "@/models/Discount";
import Villa from "@/models/Villa";

async function Page() {

    await connectToDB();

    const discounts = await discount.find({}).lean().sort({_id : -1});

    const discountSerialize = JSON.parse(JSON.stringify(discounts))

    const villas = await Villa.find({} , "title");

    const VillasSerialize = JSON.parse(JSON.stringify(villas))

    return (
        <div>
            <DiscountsContent discounts={discountSerialize} villas={VillasSerialize}/>
        </div>
    );
}

export default Page;