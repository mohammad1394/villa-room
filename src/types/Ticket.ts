import {UserType} from "@/types/User";
import {DepartmentType} from "@/types/Department";
import {SubDepartmentType} from "@/types/SubDepartment";

export type TicketStatus =
    | "pending"
    | "open"
    | "closed"


export type TicketPriority =
    | "low"
    | "medium"
    | "high"

export  type  TicketType = {
    _id: string;
    userId: UserType;
    title: string;
    body: string;
    department: DepartmentType;
    subDepartment: SubDepartmentType;
    priority: TicketPriority;
    status: TicketStatus;
    lastMessageAt?: string;
    lastMessageBy?: "User" | "Admin";
    closedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}