
"use client";

import {
    ChangeEvent,
    DragEvent,
    useEffect,
    useRef,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    AlertCircle,
    ArrowRight,
    Bath,
    BedDouble,
    Camera,
    Car,
    Check,
    ChevronDown,
    CookingPot,
    Droplets,
    Eye,
    Flame,
    ImagePlus,
    Loader2,
    MapPin,
    Save,
    Snowflake,
    Star,
    Thermometer,
    Trash2,
    Tv,
    Upload,
    Users,
    Waves,
    Wifi,
    type LucideIcon,
} from "lucide-react";

import { showCustomToast } from "@/components/modules/layout/toast/toast";
import { Field } from "@/components/modules/adminPanel/createVilla/Field";

import {
    useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    CreateVillaFormValues,
    CreateVillaFormOutput,
    createVillaSchema,
} from "@/validator/villaValidator";


const villaTypes = [
    { value: "forest", label: "جنگلی" },
    { value: "beach", label: "ساحلی" },
    { value: "pool", label: "استخردار" },
    { value: "mountain", label: "کوهستانی" },
];

const amenitiesList: {
    label: string;
    icon: LucideIcon;
}[] = [
    { label: "استخر", icon: Waves },
    { label: "پارکینگ", icon: Car },
    { label: "اینترنت", icon: Wifi },
    { label: "جکوزی", icon: Droplets },
    { label: "تلویزیون", icon: Tv },
    { label: "آشپزخانه", icon: CookingPot },
    { label: "باربیکیو", icon: Flame },
    { label: "سیستم گرمایشی", icon: Thermometer },
    { label: "سیستم سرمایشی", icon: Snowflake },
];

const input =
    "h-11 w-full rounded-xl border bg-white px-4 text-sm text-[var(--text-primary)] outline-none transition " +
    "placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10";

const okBorder = "border-[var(--border)]";

const badBorder = "border-[#B42318] bg-[#FEF3F2]";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];


export default function VillaForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setFocus,
        formState: {
            errors,
            isSubmitting,
            isSubmitted,
        },
    } = useForm<
        CreateVillaFormValues,
        undefined,
        CreateVillaFormOutput
    >({
        resolver: zodResolver(createVillaSchema),

        defaultValues: {
            title: "",
            description: "",
            type: "beach",
            province: "",
            city: "",
            address: "",
            pricePerNight: "",
            capacity: "",
            bedrooms: "",
            bathrooms: "",
            amenities: [],
            images: [],
        },
    });

    const title = watch("title");
    const type = watch("type");
    const description = watch("description");
    const province = watch("province");
    const city = watch("city");
    const address = watch("address");
    const pricePerNight = watch("pricePerNight");
    const capacity = watch("capacity");
    const bedrooms = watch("bedrooms");
    const bathrooms = watch("bathrooms");
    const amenities = watch("amenities") ?? [];

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [dragging, setDragging] = useState(false);

    const [provinces, setProvinces] = useState<ProvinceType[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(true);

    const summaryRef = useRef<HTMLDivElement>(null);
    const previewsRef = useRef<string[]>([]);

    previewsRef.current = previews;

    useEffect(() => {
        return () => {
            previewsRef.current.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, []);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch("/api/admin/province");

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "دریافت استان‌ها ناموفق بود"
                    );
                }

                setProvinces(data.provinces || []);
            } catch (error) {
                console.error(error);

                showCustomToast(
                    "خطا",
                    "دریافت لیست استان‌ها با خطا مواجه شد",
                    "x",
                    "error"
                );
            } finally {
                setLoadingProvinces(false);
            }
        };

        fetchProvinces();
    }, []);

    const selectedProvince = provinces.find(
        (item) => item._id === province
    );

    const selectedTypeLabel =
        villaTypes.find((item) => item.value === type)?.label || "";


    const completedFields = [
        !!title?.trim(),
        !!type,
        !!province,
        !!city,
        !!address?.trim(),
        Number(pricePerNight) > 0,
        Number(capacity) > 0,
        Number(bedrooms) >= 0 && bedrooms !== "",
        Number(bathrooms) >= 0 && bathrooms !== "",
        !!description?.trim(),
        amenities.length > 0,
        images.length > 0,
    ].filter(Boolean).length;

    const progress = Math.round(
        (completedFields / 12) * 100
    );

    // افزودن تصاویر
    const addFiles = (list: FileList | File[]) => {
        const selectedFiles = Array.from(list);

        const validFiles = selectedFiles.filter((file) => {
            if (!allowedTypes.includes(file.type)) {
                showCustomToast(
                    "خطا",
                    "فرمت تصویر باید JPG، PNG یا WEBP باشد",
                    "x",
                    "error"
                );

                return false;
            }

            if (file.size > MAX_FILE_SIZE) {
                showCustomToast(
                    "خطا",
                    "حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد",
                    "x",
                    "error"
                );

                return false;
            }

            return true;
        });

        const availableSlots = MAX_IMAGES - images.length;

        if (availableSlots <= 0) {
            showCustomToast(
                "توجه",
                "حداکثر ۵ تصویر می‌توانید اضافه کنید",
                "x",
                "error"
            );

            return;
        }

        const filesToAdd = validFiles.slice(0, availableSlots);

        if (filesToAdd.length < validFiles.length) {
            showCustomToast(
                "توجه",
                "حداکثر ۵ تصویر می‌توانید اضافه کنید",
                "x",
                "error"
            );
        }

        if (!filesToAdd.length) return;

        const updatedImages = [...images, ...filesToAdd];

        const updatedPreviews = [
            ...previews,
            ...filesToAdd.map((file) =>
                URL.createObjectURL(file)
            ),
        ];

        setImages(updatedImages);
        setPreviews(updatedPreviews);

        setValue("images", updatedImages, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const onPick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            addFiles(event.target.files);
        }

        event.target.value = "";
    };

    const onDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();

        setDragging(false);

        addFiles(event.dataTransfer.files);
    };

    // حذف تصویر
    const removeImage = (index: number) => {
        URL.revokeObjectURL(previews[index]);

        const updatedImages = images.filter(
            (_, itemIndex) => itemIndex !== index
        );

        const updatedPreviews = previews.filter(
            (_, itemIndex) => itemIndex !== index
        );

        setImages(updatedImages);
        setPreviews(updatedPreviews);

        setValue("images", updatedImages, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // انتخاب تصویر اصلی
    const makeMain = (index: number) => {
        const moveFirst = <T,>(array: T[]) => [
            array[index],
            ...array.filter(
                (_, itemIndex) => itemIndex !== index
            ),
        ];

        setImages(moveFirst(images));
        setPreviews(moveFirst(previews));

        setValue("images", moveFirst(images), {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // مدیریت امکانات
    const toggleAmenity = (label: string) => {
        const updatedAmenities = amenities.includes(label)
            ? amenities.filter((item) => item !== label)
            : [...amenities, label];

        setValue("amenities", updatedAmenities, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // اسکرول به فیلد دارای خطا
    const focusField = (key: keyof CreateVillaFormValues) => {
        setFocus(key);

        document
            .getElementById(`f-${key}`)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
    };

    // ارسال فرم
    const onSubmit = async (formData: CreateVillaFormOutput) => {
        try {
            const fd = new FormData();

            fd.append("title", formData.title);
            fd.append("description", formData.description);
            fd.append("type", formData.type);
            fd.append("province", formData.province);
            fd.append("city", formData.city);
            fd.append("address", formData.address);

            fd.append(
                "pricePerNight",
                String(formData.pricePerNight)
            );

            fd.append(
                "capacity",
                String(formData.capacity)
            );

            fd.append(
                "bedrooms",
                String(formData.bedrooms)
            );

            fd.append(
                "bathrooms",
                String(formData.bathrooms)
            );

            fd.append(
                "amenities",
                JSON.stringify(formData.amenities)
            );

            formData.images.forEach((image) => {
                fd.append("images", image);
            });

            const response = await fetch(
                "/api/admin/villas",
                {
                    method: "POST",
                    body: fd,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "ثبت ویلا با خطا مواجه شد"
                );
            }

            showCustomToast(
                "موفق",
                "ویلا با موفقیت ثبت شد",
                "check",
                "success"
            );

            router.push("/admin/villas");
            router.refresh();
        } catch (error) {
            console.error(error);

            showCustomToast(
                "خطا",
                error instanceof Error
                    ? error.message
                    : "ثبت ویلا با خطا مواجه شد",
                "x",
                "error"
            );
        }
    };

    // خطاهای فرم برای خلاصه
    const errorItems = Object.entries(errors)
        .filter(([, error]) => error?.message)
        .map(([key, error]) => ({
            key: key as keyof CreateVillaFormValues,
            message: error?.message as string,
        }));

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[var(--background)] p-6 pb-24 text-[var(--text-primary)]"
            style={{
                fontFamily:
                    "var(--font-vazir, Vazirmatn), Tahoma, sans-serif",
            }}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                {/* HEADER */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-[22px] font-bold">
                            افزودن ویلای جدید
                        </h1>

                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            اطلاعات ویلای مورد نظر را وارد کنید
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push("/admin/villas")}
                        className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-secondary)]"
                    >
                        <ArrowRight size={17} />
                        بازگشت
                    </button>
                </div>

                {/* ERROR SUMMARY */}
                {isSubmitted && errorItems.length > 0 && (
                    <div
                        ref={summaryRef}
                        tabIndex={-1}
                        role="alert"
                        className="mb-5 rounded-2xl border border-[#B42318]/20 bg-[#FEF3F2] p-4 outline-none"
                    >
                        <p className="flex items-center gap-2 text-sm font-bold text-[#B42318]">
                            <AlertCircle size={16} />

                            {errorItems.length.toLocaleString("fa-IR")}
                            {" "}
                            مورد نیاز به بررسی دارد
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {errorItems.map(({ key, message }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => focusField(key)}
                                    className="cursor-pointer rounded-lg border border-[#B42318]/20 bg-white px-3 py-1.5 text-xs text-[#B42318] transition hover:bg-[#FEF3F2]"
                                >
                                    {message}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[410px_minmax(0,1fr)]">

                    {/* LEFT */}
                    <div className="space-y-5">

                        {/* IMAGES */}
                        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-me)]">

                            <div className="mb-5 flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF0F4] text-[var(--primary)]">
                                    <Camera size={19} />
                                </div>

                                <div>
                                    <h2 className="font-bold">
                                        تصاویر ویلا
                                    </h2>

                                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                        حداکثر ۵ تصویر (JPG, PNG, WEBP)
                                    </p>
                                </div>
                            </div>

                            {/* UPLOAD */}
                            <label
                                id="f-images"
                                onDragOver={(event) => {
                                    event.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={onDrop}
                                className={`flex h-[155px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
                                    dragging
                                        ? "border-[var(--primary)] bg-[#F0F6F8]"
                                        : errors.images
                                            ? badBorder
                                            : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--primary)] hover:bg-[#F5F9FA]"
                                }`}
                            >
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--accent)] shadow-sm">
                                    <Upload size={25} />
                                </div>

                                <span className="text-sm font-medium">
                                    برای آپلود تصاویر کلیک کنید
                                </span>

                                <span className="mt-2 text-xs text-[var(--text-secondary)]">
                                    یا فایل‌ها را اینجا بکشید و رها کنید
                                </span>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={onPick}
                                    className="hidden"
                                />
                            </label>

                            {/* IMAGES GRID */}
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {previews.map((image, index) => (
                                    <div
                                        key={image}
                                        className={`group relative h-[105px] overflow-hidden rounded-xl ${
                                            index === 0
                                                ? "ring-2 ring-[var(--primary)]"
                                                : ""
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`villa-${index}`}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#64748b] shadow-sm transition hover:bg-red-50 hover:text-red-500"
                                        >
                                            <Trash2 size={13} />
                                        </button>

                                        {index === 0 && (
                                            <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-[var(--primary)] px-2 py-1 text-[9px] font-medium text-white">
                                                <Star
                                                    size={10}
                                                    fill="currentColor"
                                                />
                                                تصویر اصلی
                                            </div>
                                        )}

                                        {index !== 0 && (
                                            <button
                                                type="button"
                                                onClick={() => makeMain(index)}
                                                className="absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-1 text-[9px] font-medium opacity-0 shadow-sm transition group-hover:opacity-100"
                                            >
                                                اصلی
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {previews.length < MAX_IMAGES && (
                                    <label className="flex h-[105px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">
                                        <ImagePlus size={22} />

                                        <span className="mt-2 text-xs">
                                            افزودن تصویر
                                        </span>

                                        <input
                                            type="file"
                                            multiple
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={onPick}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* TIPS */}
                            <div className="mt-5 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4">
                                <div className="mb-3 flex items-center gap-2 text-[var(--primary)]">
                                    <Check size={17} />

                                    <span className="text-sm font-bold">
                                        نکات مهم
                                    </span>
                                </div>

                                <ul className="space-y-2 text-xs leading-6 text-[var(--text-secondary)]">
                                    <li>• حداکثر تعداد تصاویر ۵ عدد است.</li>
                                    <li>• فرمت‌های مجاز JPG، PNG، WEBP می‌باشد.</li>
                                    <li>• حجم هر تصویر حداکثر ۵ مگابایت باشد.</li>
                                </ul>
                            </div>

                            {errors.images?.message && (
                                <p className="mt-3 flex items-center gap-1.5 text-xs text-[#B42318]">
                                    <AlertCircle size={13} />
                                    {errors.images.message}
                                </p>
                            )}
                        </section>

                        {/* PREVIEW */}
                        <section className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-5">

                            <div className="mb-4 flex items-center gap-2 text-[var(--primary)]">
                                <Eye size={18} />

                                <h3 className="font-bold">
                                    پیش‌نمایش اطلاعات
                                </h3>
                            </div>

                            <div className="space-y-3 text-xs text-[var(--text-secondary)]">

                                <div className="flex justify-between gap-3">
                                    <span>نوع:</span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {selectedTypeLabel || "انتخاب نشده"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>عنوان:</span>

                                    <span className="max-w-[200px] truncate font-medium text-[var(--text-primary)]">
                                        {title || "بدون عنوان"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>موقعیت:</span>

                                    <span className="max-w-[220px] truncate font-medium text-[var(--text-primary)]">
                                        {selectedProvince?.title
                                            ? `${selectedProvince.title}${city ? `، ${city}` : ""}`
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>ظرفیت:</span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {capacity
                                            ? `${Number(capacity).toLocaleString("fa-IR")} نفر`
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>اتاق خواب:</span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {bedrooms !== ""
                                            ? Number(bedrooms).toLocaleString("fa-IR")
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>حمام:</span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {bathrooms !== ""
                                            ? Number(bathrooms).toLocaleString("fa-IR")
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>قیمت:</span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {pricePerNight
                                            ? `${Number(pricePerNight).toLocaleString("fa-IR")} تومان`
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>امکانات:</span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {amenities.length
                                            ? `${amenities.length.toLocaleString("fa-IR")} مورد`
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-me)]">

                        {/* BASIC INFORMATION */}
                        <section>
                            <div className="mb-6">
                                <h2 className="text-[17px] font-bold">
                                    اطلاعات اصلی
                                </h2>

                                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                    اطلاعات پایه ویلای خود را وارد کنید
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-5">

                                {/* TITLE */}
                                <Field
                                    id="title"
                                    label="عنوان ویلا"
                                    error={errors.title?.message}
                                >
                                    <input
                                        {...register("title")}
                                        placeholder="مثال: ویلا استخر دار در محمودآباد"
                                        className={`${input} ${errors.title ? badBorder : okBorder}`}
                                    />
                                </Field>

                                {/* TYPE */}
                                <Field
                                    id="type"
                                    label="نوع ویلا"
                                    error={errors.type?.message}
                                >
                                    <div className="relative">
                                        <select
                                            {...register("type")}
                                            className={`${input} cursor-pointer appearance-none pl-10 ${errors.type ? badBorder : okBorder}`}
                                        >
                                            <option value="">
                                                انتخاب کنید
                                            </option>

                                            {villaTypes.map((item) => (
                                                <option
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDown
                                            size={17}
                                            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />
                                    </div>
                                </Field>

                                {/* PROVINCE */}
                                <Field
                                    id="province"
                                    label="استان"
                                    error={errors.province?.message}
                                >
                                    <div className="relative">
                                        <select
                                            {...register("province", {
                                                onChange: () => {
                                                    setValue("city", "", {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    });
                                                },
                                            })}
                                            disabled={loadingProvinces}
                                            className={`${input} cursor-pointer appearance-none pl-10 ${errors.province ? badBorder : okBorder}`}
                                        >
                                            <option value="">
                                                {loadingProvinces
                                                    ? "در حال دریافت..."
                                                    : "انتخاب استان"}
                                            </option>

                                            {provinces.map((item) => (
                                                <option
                                                    key={item._id}
                                                    value={item._id}
                                                >
                                                    {item.title}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDown
                                            size={17}
                                            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />
                                    </div>
                                </Field>

                                {/* CITY */}
                                <Field
                                    id="city"
                                    label="شهر"
                                    error={errors.city?.message}
                                >
                                    <div className="relative">
                                        <select
                                            {...register("city")}
                                            disabled={!province}
                                            className={`${input} cursor-pointer appearance-none pl-10 ${errors.city ? badBorder : okBorder}`}
                                        >
                                            <option value="">
                                                {province
                                                    ? "انتخاب شهر"
                                                    : "ابتدا استان را انتخاب کنید"}
                                            </option>

                                            {selectedProvince?.cities?.map((item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDown
                                            size={17}
                                            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />
                                    </div>
                                </Field>

                                {/* ADDRESS */}
                                <Field
                                    id="address"
                                    label="آدرس کامل"
                                    error={errors.address?.message}
                                    className="col-span-2"
                                >
                                    <div className="relative">
                                        <MapPin
                                            size={18}
                                            className="absolute top-3 right-4 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            {...register("address")}
                                            placeholder="آدرس دقیق ویلا را وارد کنید"
                                            className={`${input} pr-11 ${errors.address ? badBorder : okBorder}`}
                                        />
                                    </div>
                                </Field>

                                {/* PRICE */}
                                <Field
                                    id="pricePerNight"
                                    label="قیمت هر شب (تومان)"
                                    error={errors.pricePerNight?.message}
                                >
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1"
                                            {...register("pricePerNight")}
                                            placeholder="1000000"
                                            className={`${input} pl-16 text-left ${errors.pricePerNight ? badBorder : okBorder}`}
                                        />

                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-[var(--text-secondary)]">
                                            تومان
                                        </span>
                                    </div>
                                </Field>

                                {/* CAPACITY */}
                                <Field
                                    id="capacity"
                                    label="ظرفیت"
                                    error={errors.capacity?.message}
                                >
                                    <div className="relative">
                                        <Users
                                            size={17}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            type="number"
                                            min="1"
                                            {...register("capacity")}
                                            placeholder="مثال: 10"
                                            className={`${input} pr-11 ${errors.capacity ? badBorder : okBorder}`}
                                        />
                                    </div>
                                </Field>

                                {/* BEDROOMS */}
                                <Field
                                    id="bedrooms"
                                    label="تعداد اتاق‌خواب‌ها"
                                    error={errors.bedrooms?.message}
                                >
                                    <div className="relative">
                                        <BedDouble
                                            size={17}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            type="number"
                                            min="0"
                                            {...register("bedrooms")}
                                            placeholder="مثال: 3"
                                            className={`${input} pr-11 ${errors.bedrooms ? badBorder : okBorder}`}
                                        />
                                    </div>
                                </Field>

                                {/* BATHROOMS */}
                                <Field
                                    id="bathrooms"
                                    label="تعداد حمام‌ها"
                                    error={errors.bathrooms?.message}
                                >
                                    <div className="relative">
                                        <Bath
                                            size={17}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            type="number"
                                            min="0"
                                            {...register("bathrooms")}
                                            placeholder="مثال: 2"
                                            className={`${input} pr-11 ${errors.bathrooms ? badBorder : okBorder}`}
                                        />
                                    </div>
                                </Field>
                            </div>
                        </section>

                        {/* DIVIDER */}
                        <div className="my-7 h-px bg-[var(--border)]" />

                        {/* AMENITIES */}
                        <section>
                            <div className="mb-5">
                                <h2 className="text-[17px] font-bold">
                                    امکانات
                                </h2>

                                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                    امکانات موجود در ویلا را انتخاب کنید
                                </p>
                            </div>

                            <div
                                id="f-amenities"
                                className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4"
                            >
                                {amenitiesList.map(({ label, icon: Icon }) => {
                                    const active = amenities.includes(label);

                                    return (
                                        <button
                                            type="button"
                                            key={label}
                                            onClick={() => toggleAmenity(label)}
                                            className={`flex h-11 items-center justify-between rounded-xl border px-3 transition ${
                                                active
                                                    ? "border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[var(--primary)]"
                                                    : "border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-[var(--accent)]"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon size={16} />

                                                <span className="text-xs">
                                                    {label}
                                                </span>
                                            </div>

                                            <span
                                                className={`flex h-4 w-4 items-center justify-center rounded border ${
                                                    active
                                                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                                        : "border-[#cbd5e1]"
                                                }`}
                                            >
                                                {active && <Check size={11} />}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {errors.amenities?.message && (
                                <p className="mt-3 flex items-center gap-1.5 text-xs text-[#B42318]">
                                    <AlertCircle size={13} />
                                    {errors.amenities.message}
                                </p>
                            )}
                        </section>

                        {/* DIVIDER */}
                        <div className="my-7 h-px bg-[var(--border)]" />

                        {/* DESCRIPTION */}
                        <section>
                            <div className="mb-4">
                                <h2 className="text-[17px] font-bold">
                                    توضیحات
                                </h2>

                                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                    توضیحات کامل و ویژگی‌های ویژه ویلا را وارد کنید
                                </p>
                            </div>

                            <div
                                className={`overflow-hidden rounded-xl border ${
                                    errors.description
                                        ? "border-[#B42318]"
                                        : "border-[var(--border)]"
                                }`}
                            >
                                {/* TOOLBAR */}
                                <div className="flex h-11 items-center gap-5 border-b border-[var(--border)] bg-[var(--surface-secondary)] px-4 text-[var(--text-secondary)]">
                                    <button type="button" className="font-bold">
                                        B
                                    </button>

                                    <button type="button" className="italic">
                                        I
                                    </button>

                                    <button type="button" className="underline">
                                        U
                                    </button>

                                    <span className="h-5 w-px bg-[var(--border)]" />

                                    <button type="button">☷</button>
                                    <button type="button">☰</button>
                                    <button type="button">≡</button>
                                    <button type="button">▦</button>
                                </div>

                                <textarea
                                    id="f-description"
                                    {...register("description")}
                                    rows={5}
                                    placeholder="توضیحات مربوط به ویلا ..."
                                    className="w-full resize-none border-0 bg-white px-4 py-4 text-sm leading-7 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
                                />
                            </div>

                            {errors.description?.message && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]">
                                    <AlertCircle size={13} />
                                    {errors.description.message}
                                </p>
                            )}
                        </section>

                        {/* ACTIONS */}
                        <div className="mt-6 flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex h-12 min-w-[190px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        در حال ثبت...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        ذخیره ویلا
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push("/admin/villas")}
                                disabled={isSubmitting}
                                className="flex h-12 min-w-[130px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-secondary)] disabled:opacity-50"
                            >
                                <Eye size={17} />
                                پیش‌نمایش
                            </button>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-white/95 backdrop-blur">
                    <div className="mx-auto flex max-w-[1360px] items-center gap-4 px-5 py-3 lg:px-8">

                        <div className="hidden flex-1 items-center gap-3 sm:flex">
                            <div className="h-2 w-40 overflow-hidden rounded-full bg-[var(--border)]">
                                <div
                                    className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>

                            <span className="text-xs font-semibold text-[var(--text-secondary)]">
                                {progress.toLocaleString("fa-IR")}
                                ٪ تکمیل شده
                            </span>
                        </div>

                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => router.push("/admin/villas")}
                            className="h-11 cursor-pointer rounded-xl border border-[var(--border)] bg-white px-6 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-secondary)] disabled:opacity-50"
                        >
                            انصراف
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-8 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />
                                    در حال ثبت...
                                </>
                            ) : (
                                <>
                                    <Check size={17} />
                                    ثبت ویلا
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
}
