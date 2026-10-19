export type UserType =  {
    _id: string
    fullName: string
    email: string
    phone: string
    status: string
    role: "User" | "Admin"
    avatar: any
    createdAt: string
    updatedAt: string
}
