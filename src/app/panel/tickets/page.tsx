
import connectToDB from "@/config/db";
import {getCurrentUser} from "@/utility/getCurrentUser";

import {TicketType} from "@/types/Ticket";
import TicketList from "@/components/templates/ticket/TicketList";
import Ticket from "@/models/Ticket";
import department from "@/models/Department";




export default async function Page() {

    await connectToDB();

    void department;

    const user = await getCurrentUser();

    const tickets: TicketType[] = await Ticket.find({userId: user._id}).populate("department" , "title" ).lean();


    return (
        <div>
            <TicketList tickets={JSON.parse(JSON.stringify(tickets))} />
        </div>
    );
}