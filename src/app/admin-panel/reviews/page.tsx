import React from 'react';
import ReviewsContent from "@/components/templates/adminPanel/reviews/ReviewsContent";
import connectToDB from "@/config/db";
import review from "@/models/Review";
import Villa from "@/models/Villa";
import User from "@/models/User";

async function Page() {

      await connectToDB();

      void Villa;
      void User;


      const reviews = await review
          .find({})
          .populate("userId")
          .populate("villaId")
          .lean();

      const reviewSerialize = JSON.parse(JSON.stringify(reviews));



    return (
        <div>
            <ReviewsContent comments={reviewSerialize}/>
        </div>
    );
}

export default Page;