
"use client";

import {useFieldArray, useForm} from "react-hook-form";

interface RegisterFormData {
    title: string;
    city: string;
    pricePerNight: number;
    capacity: number;
    facilities: {
        name: string;
    }[];
}

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors , isSubmitting  , isDirty , dirtyFields , isValid },
        watch,
        getValues,
        setValue,
        reset,
        control
    } = useForm<RegisterFormData>({
        mode : "onTouched",
        defaultValues : {
            city : "",
            title : "" ,
            capacity  : 15 ,
            pricePerNight :  10000000
        }
    });

    const {append , remove , fields} = useFieldArray({
        control ,
        name : "facilities"
    })



    const villa = {
        city : "Rasht",
        title : "Rasht castle" ,
        capacity  : 10 ,
        pricePerNight :  8000000
    }
    const title = watch("title");
    const pricePerNight = watch("pricePerNight")

    const sendInformation = (data: RegisterFormData) => {
        if (!isDirty){
            alert("فیلدی تغییر داده نشده است")
        }
        reset()
    };

    return (
        <div className={"my-20"}>
            <form onSubmit={handleSubmit(sendInformation)}>
                <input {...register("title" ,
                    {
                        required : "عنوان ویلا الزامی است "  ,
                        minLength :{
                            value : 10 ,
                            message : "مقدار نام نمیتواند کمتر از 10 کاراکتر باشد"
                        }
                    })}
                    className={"w-full border border-black my-2 "} />
                <p>عنوان شهر:{title}</p>
                {errors.title && (
                    <p>{errors.title.message}</p>
                )}
                <input {...register("city" , {required : "عنوان شهر الزامی است "})} className={"w-full border border-black my-2 "} />
                {errors.city && (
                    <p>{errors.city.message}</p>
                )}
                <input
                    {...register("pricePerNight", {
                        valueAsNumber: true,
                        min : {
                            value : 1 ,
                            message : "قیمت باید عددی مثبت باشد "
                        }
                    })}
                    type="number"
                    className={"w-full border border-black my-2"}
                />
                <p>عنوان شهر:{pricePerNight}</p>
                {errors.pricePerNight && (
                    <p>{errors.pricePerNight.message}</p>
                )}
                <input
                    {...register("capacity", {
                        valueAsNumber: true,
                        min : {
                            value : 1,
                            message : "حداقل ظرفیت 1 است"
                        }
                    })}
                    type="number"
                    className={"w-full border border-black my-2"}
                />
                {errors.capacity && (
                    <p>{errors.capacity.message}</p>
                )}
                {fields.map((field, index) => (
                    <div key={field.id}>
                        <input
                            {...register(`facilities.${index}.name`,)}
                            placeholder="نام امکان"
                            className={"w-full border border-black my-2"}
                        />

                        <button
                            type="button"
                            onClick={() => remove(index)}
                        >
                            حذف
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => append({ name: "" })}
                >
                    افزودن امکان
                </button>
                <button type="submit"
                        className={`${isValid ? "" : "opacity-40"} p-10 bg-orange-500 `}
                        disabled={!isValid}
                >
                    {
                        isSubmitting ? "در حال ارسال اطلاعات" : "ثبت"
                    }
                </button>
                <button type="button"
                        className={` p-10 bg-orange-500 `}
                        onClick={() => {getValues("city")}}
                >
                   نمایش نام شهر
                </button>
                <button type="button"
                        className={` p-10 bg-orange-500 `}
                        onClick={() => setValue("city", "Tehran", {
                            shouldDirty: true,
                        })}
                >
                    نمایش نام شهر
                </button>
                <button type="button"
                        className={` p-10 bg-orange-500 `}
                        onClick={() => {reset()}}
                >
                    خالی کردن فرم
                </button>
                <button type="button"
                        className={` p-10 bg-orange-500 `}
                        onClick={() => {reset(villa)}}
                >
                    پر  کردن فرم
                </button>
            </form>
        </div>
    );
}

export default Register;
