import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import Booking from "@/models/Booking";
import Villa from "@/models/Villa";
import Review from "@/models/Review";
import {cookies} from "next/headers";
import {verifyAccessToken} from "@/utility/auth";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();

        const {
            userId,
            villaId,
            checkIn,
            checkOut,
            guests,
        } = body;


        if (
            !userId ||
            !villaId ||
            !checkIn ||
            !checkOut ||
            !guests
        ) {
            return NextResponse.json(
                {
                    message:
                        "لطفاً تمام اطلاعات مورد نیاز برای رزرو را وارد کنید",
                },
                {
                    status: 400,
                }
            );
        }


        if (guests < 1) {
            return NextResponse.json(
                {
                    message: "تعداد مهمان باید حداقل 1 نفر باشد",
                },
                {
                    status: 400,
                }
            );
        }


        const villa = await Villa.findOne({
            _id: villaId,
            isActive: true,
        });

        if (!villa) {
            return NextResponse.json(
                {
                    message: "ویلا یافت نشد یا غیرفعال است",
                },
                {
                    status: 404,
                }
            );
        }


        if (guests > villa.capacity) {
            return NextResponse.json(
                {
                    message: `ظرفیت این ویلا حداکثر ${villa.capacity} نفر است`,
                },
                {
                    status: 400,
                }
            );
        }


        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);


        if (
            isNaN(startDate.getTime()) ||
            isNaN(endDate.getTime())
        ) {
            return NextResponse.json(
                {
                    message: "تاریخ ورود یا خروج معتبر نیست",
                },
                {
                    status: 400,
                }
            );
        }


        if (startDate >= endDate) {
            return NextResponse.json(
                {
                    message:
                        "تاریخ ورود باید قبل از تاریخ خروج باشد",
                },
                {
                    status: 400,
                }
            );
        }


        const nights = Math.ceil(
            (endDate.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );


        if (nights < 2) {
            return NextResponse.json(
                {
                    message: "حداقل مدت اقامت 2 شب است",
                },
                {
                    status: 400,
                }
            );
        }


        const overlappingBooking = await Booking.findOne({
            villaId,
            status: {
                $in: ["pending", "confirmed"],
            },
            checkIn: {
                $lt: endDate,
            },
            checkOut: {
                $gt: startDate,
            },
        });

        if (overlappingBooking) {
            return NextResponse.json(
                {
                    message:
                        "این ویلا در بازه زمانی انتخاب شده قبلاً رزرو شده است",
                },
                {
                    status: 409,
                }
            );
        }


        const pricePerNight = villa.pricePerNight;


        const subtotal = nights * pricePerNight;


        const serviceFee = subtotal * 0.02;


        const totalPrice = subtotal + serviceFee;


        const newBooking = await Booking.create({
            userId,
            villaId,
            checkIn: startDate,
            checkOut: endDate,
            guests,
            nights,
            pricePerNight,
            subtotal,
            serviceFee,
            totalPrice,
            status: "pending",
        });

        return NextResponse.json(
            {
                message: "رزرو ویلا با موفقیت ثبت شد",
                booking: newBooking,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message:
                    "خطای ناشناخته سمت سرور رخ داده است، دوباره تلاش کنید",
            },
            {
                status: 500,
            }
        );
    }
}



export async function GET() {
    try {
        await connectToDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;




        if (!token) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری شوید",
                },
                {
                    status: 401,
                }
            );
        }

        const tokenPayload = verifyAccessToken(token);

        if (!tokenPayload) {
            return NextResponse.json(
                {
                    message: "احراز هویت نامعتبر است",
                },
                {
                    status: 401,
                }
            );
        }

        const user = await UserModel.findOne(
            { email: tokenPayload.email },
            "_id"
        );

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }

        const userBooking = await Booking.find({
            userId: user._id,
        }).lean();

        return NextResponse.json(
            {
                bookings: userBooking,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message:
                    "خطای ناشناخته سمت سرور رخ داده است، دوباره تلاش کنید",
            },
            {
                status: 500,
            }
        );
    }
}