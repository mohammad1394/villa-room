"use client";

import {
    ChangeEvent,
    DragEvent,
    FormEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {useRouter} from "next/navigation";
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
import {showCustomToast} from "@/components/modules/layout/toast/toast";

const villaTypes = [
    {
        value: "forest",
        label: "جنگلی",
    },
    {
        value: "beach",
        label: "ساحلی",
    },
    {
        value: "pool",
        label: "استخردار",
    },
    {
        value: "mountain",
        label: "کوهستانی",
    },
];

const amenitiesList: {
    label: string;
    icon: LucideIcon;
}[] = [
    {
        label: "استخر",
        icon: Waves,
    },
    {
        label: "پارکینگ",
        icon: Car,
    },
    {
        label: "اینترنت",
        icon: Wifi,
    },
    {
        label: "جکوزی",
        icon: Droplets,
    },
    {
        label: "تلویزیون",
        icon: Tv,
    },
    {
        label: "آشپزخانه",
        icon: CookingPot,
    },
    {
        label: "باربیکیو",
        icon: Flame,
    },
    {
        label: "سیستم گرمایشی",
        icon: Thermometer,
    },
    {
        label: "سیستم سرمایشی",
        icon: Snowflake,
    },
];

type Province = {
    _id: string;
    title: string;
    slug: string;
    cities: string[];
};

const input =
    "h-11 w-full rounded-xl border bg-white px-4 text-sm text-[var(--text-primary)] outline-none transition " +
    "placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10";

const okBorder = "border-[var(--border)]";

const badBorder =
    "border-[#B42318] bg-[#FEF3F2]";

function Field({
                   id,
                   label,
                   error,
                   children,
                   className = "",
               }: {
    id: string;
    label: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <label
                htmlFor={`f-${id}`}
                className="mb-2 block text-xs font-semibold text-[var(--text-primary)]"
            >
                {label}

                <span className="mr-1 text-[#B42318]">
                    *
                </span>
            </label>

            {children}

            {error && (
                <p
                    id={`f-${id}-err`}
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]"
                >
                    <AlertCircle size={13}/>
                    {error}
                </p>
            )}
        </div>
    );
}

export default function VillaForm() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [pricePerNight, setPricePerNight] =
        useState("");

    const [capacity, setCapacity] = useState(0);
    const [bedrooms, setBedrooms] = useState(0);
    const [bathrooms, setBathrooms] = useState(0);

    const [amenities, setAmenities] = useState<
        string[]
    >([]);

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>(
        []
    );

    const [dragging, setDragging] = useState(false);

    const [provinces, setProvinces] = useState<
        Province[]
    >([]);

    const [loadingProvinces, setLoadingProvinces] =
        useState(true);

    const [loading, setLoading] = useState(false);

    const [submitted, setSubmitted] =
        useState(false);

    const summaryRef = useRef<HTMLDivElement>(null);

    const previewsRef = useRef<string[]>([]);

    previewsRef.current = previews;

    useEffect(() => {
        return () => {
            previewsRef.current.forEach((url) =>
                URL.revokeObjectURL(url)
            );
        };
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    "/api/admin/province"
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message
                    );
                }

                setProvinces(
                    data.provinces || []
                );
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
        })();
    }, []);

    const selectedProvince = provinces.find(
        (item) => item._id === province
    );

    const selectedTypeLabel =
        villaTypes.find(
            (item) => item.value === type
        )?.label || "";

    const errors = useMemo(() => {
        const e: Record<string, string> = {};

        if (!title.trim()) {
            e.title = "عنوان ویلا را وارد کنید";
        }

        if (!type) {
            e.type = "نوع ویلا را انتخاب کنید";
        }

        if (!description.trim()) {
            e.description =
                "توضیحات ویلا را وارد کنید";
        }

        if (!province) {
            e.province =
                "استان را انتخاب کنید";
        }

        if (!city) {
            e.city = "شهر را انتخاب کنید";
        }

        if (!address.trim()) {
            e.address =
                "آدرس ویلا را وارد کنید";
        }

        if (
            !pricePerNight ||
            Number(pricePerNight) <= 0
        ) {
            e.price =
                "قیمت هر شب را وارد کنید";
        }

        if (capacity <= 0) {
            e.capacity =
                "ظرفیت را مشخص کنید";
        }

        if (bedrooms <= 0) {
            e.bedrooms =
                "تعداد اتاق خواب را مشخص کنید";
        }

        if (bathrooms <= 0) {
            e.bathrooms =
                "تعداد حمام را مشخص کنید";
        }

        if (!amenities.length) {
            e.amenities =
                "حداقل یک امکان را انتخاب کنید";
        }

        if (!images.length) {
            e.images =
                "حداقل یک تصویر اضافه کنید";
        }

        return e;
    }, [
        title,
        type,
        description,
        province,
        city,
        address,
        pricePerNight,
        capacity,
        bedrooms,
        bathrooms,
        amenities,
        images,
    ]);

    const err = (key: string) =>
        submitted ? errors[key] : undefined;

    const a11y = (key: string) => ({
        id: `f-${key}`,
        "aria-invalid": !!err(key),
        "aria-describedby": err(key)
            ? `f-${key}-err`
            : undefined,
    });

    const progress = Math.round(
        ((12 - Object.keys(errors).length) /
            12) *
        100
    );

    const addFiles = (
        list: FileList | File[]
    ) => {
        const files = Array.from(list).filter(
            (file) =>
                file.type.startsWith("image/")
        );

        if (!files.length) return;

        const availableSlots =
            5 - images.length;

        if (availableSlots <= 0) {
            showCustomToast(
                "توجه",
                "حداکثر ۵ تصویر می‌توانید اضافه کنید",
                "x",
                "error"
            );

            return;
        }

        const selectedFiles = files.slice(
            0,
            availableSlots
        );

        if (
            selectedFiles.length < files.length
        ) {
            showCustomToast(
                "توجه",
                "حداکثر ۵ تصویر می‌توانید اضافه کنید",
                "x",
                "error"
            );
        }

        setImages((previous) => [
            ...previous,
            ...selectedFiles,
        ]);

        setPreviews((previous) => [
            ...previous,
            ...selectedFiles.map((file) =>
                URL.createObjectURL(file)
            ),
        ]);
    };

    const onPick = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            addFiles(event.target.files);
        }

        event.target.value = "";
    };

    const onDrop = (
        event: DragEvent<HTMLLabelElement>
    ) => {
        event.preventDefault();

        setDragging(false);

        addFiles(
            event.dataTransfer.files
        );
    };

    const removeImage = (index: number) => {
        if (previews[index]) {
            URL.revokeObjectURL(
                previews[index]
            );
        }

        setImages((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );

        setPreviews((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };

    const makeMain = (index: number) => {
        const moveFirst = <T,>(
            array: T[]
        ) => [
            array[index],
            ...array.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            ),
        ];

        setImages(
            moveFirst(images)
        );

        setPreviews(
            moveFirst(previews)
        );
    };

    const focusField = (key: string) => {
        const element =
            document.getElementById(
                `f-${key}`
            );

        element?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        element?.focus();
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setSubmitted(true);

        const keys = Object.keys(errors);

        if (keys.length) {
            showCustomToast(
                "خطا",
                errors[keys[0]],
                "x",
                "error"
            );

            requestAnimationFrame(() => {
                summaryRef.current?.focus();
            });

            return;
        }

        try {
            setLoading(true);

            const fd = new FormData();

            fd.append(
                "title",
                title.trim()
            );

            fd.append(
                "description",
                description.trim()
            );

            fd.append("type", type);

            fd.append(
                "province",
                province
            );

            fd.append("city", city);

            fd.append(
                "address",
                address.trim()
            );

            fd.append(
                "pricePerNight",
                pricePerNight
            );

            fd.append(
                "capacity",
                String(capacity)
            );

            fd.append(
                "bedrooms",
                String(bedrooms)
            );

            fd.append(
                "bathrooms",
                String(bathrooms)
            );

            amenities.forEach((amenity) =>
                fd.append(
                    "amenities",
                    amenity
                )
            );

            images.forEach((image) =>
                fd.append(
                    "images",
                    image
                )
            );

            const response = await fetch(
                "/api/admin/villas",
                {
                    method: "POST",
                    body: fd,
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "ثبت ویلا با خطا مواجه شد"
                );
            }

            showCustomToast(
                "موفق",
                "ویلا با موفقیت ثبت شد",
                "check",
                "success"
            );

            router.push(
                "/admin/villas"
            );

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
        } finally {
            setLoading(false);
        }
    };

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
                onSubmit={handleSubmit}
                noValidate
            >
                {/* HEADER */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-[22px] font-bold text-[var(--text-primary)]">
                            افزودن ویلای جدید
                        </h1>

                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            اطلاعات ویلای مورد نظر را وارد کنید
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/villas"
                            )
                        }
                        className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-secondary)]"
                    >
                        <ArrowRight size={17}/>
                        بازگشت
                    </button>
                </div>

                {/* ERROR SUMMARY */}
                {submitted &&
                    Object.keys(errors).length >
                    0 && (
                        <div
                            ref={summaryRef}
                            tabIndex={-1}
                            role="alert"
                            className="mb-5 rounded-2xl border border-[#B42318]/20 bg-[#FEF3F2] p-4 outline-none"
                        >
                            <p className="flex items-center gap-2 text-sm font-bold text-[#B42318]">
                                <AlertCircle
                                    size={16}
                                />

                                {Object.keys(
                                    errors
                                ).length.toLocaleString(
                                    "fa-IR"
                                )}{" "}
                                مورد نیاز به بررسی دارد
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {Object.entries(
                                    errors
                                ).map(
                                    ([
                                         key,
                                         message,
                                     ]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() =>
                                                focusField(
                                                    key
                                                )
                                            }
                                            className="cursor-pointer rounded-lg border border-[#B42318]/20 bg-white px-3 py-1.5 text-xs text-[#B42318] transition hover:bg-[#FEF3F2]"
                                        >
                                            {message}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[410px_minmax(0,1fr)]">

                    {/* ================= LEFT ================= */}
                    <div className="space-y-5">

                        {/* IMAGES */}
                        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-me)]">

                            <div className="mb-5 flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF0F4] text-[var(--primary)]">
                                    <Camera
                                        size={19}
                                    />
                                </div>

                                <div>
                                    <h2 className="font-bold text-[var(--text-primary)]">
                                        تصاویر ویلا
                                    </h2>

                                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                        حداکثر ۵ تصویر
                                        (JPG, PNG, WEBP)
                                    </p>
                                </div>
                            </div>

                            {/* UPLOAD */}
                            <label
                                onDragOver={(event) => {
                                    event.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() =>
                                    setDragging(false)
                                }
                                onDrop={onDrop}
                                className={`flex h-[155px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
                                    dragging
                                        ? "border-[var(--primary)] bg-[#F0F6F8]"
                                        : err(
                                            "images"
                                        )
                                            ? "border-[#B42318] bg-[#FEF3F2]"
                                            : "border-[var(--border)] bg-[var(--surface-secondary)] hover:border-[var(--primary)] hover:bg-[#F5F9FA]"
                                }`}
                            >
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--accent)] shadow-sm">
                                    <Upload
                                        size={25}
                                    />
                                </div>

                                <span className="text-sm font-medium text-[var(--text-primary)]">
                                    برای آپلود تصاویر کلیک کنید
                                </span>

                                <span className="mt-2 text-xs text-[var(--text-secondary)]">
                                    یا فایل‌ها را اینجا بکشید و رها کنید
                                </span>

                                <input
                                    id="f-images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={
                                        onPick
                                    }
                                    className="hidden"
                                />
                            </label>

                            {/* IMAGES GRID */}
                            <div className="mt-4 grid grid-cols-3 gap-3">

                                {previews.map(
                                    (
                                        image,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                image
                                            }
                                            className={`group relative h-[105px] overflow-hidden rounded-xl ${
                                                index ===
                                                0
                                                    ? "ring-2 ring-[var(--primary)]"
                                                    : ""
                                            }`}
                                        >
                                            <img
                                                src={
                                                    image
                                                }
                                                alt={`villa-${index}`}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(
                                                        index
                                                    )
                                                }
                                                className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#64748b] shadow-sm transition hover:bg-red-50 hover:text-red-500"
                                            >
                                                <Trash2
                                                    size={
                                                        13
                                                    }
                                                />
                                            </button>

                                            {index ===
                                                0 && (
                                                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-[var(--primary)] px-2 py-1 text-[9px] font-medium text-white">
                                                        <Star
                                                            size={
                                                                10
                                                            }
                                                            fill="currentColor"
                                                        />
                                                        تصویر اصلی
                                                    </div>
                                                )}

                                            {index !==
                                                0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            makeMain(
                                                                index
                                                            )
                                                        }
                                                        className="absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-1 text-[9px] font-medium text-[var(--text-primary)] opacity-0 shadow-sm transition group-hover:opacity-100"
                                                    >
                                                        اصلی
                                                    </button>
                                                )}
                                        </div>
                                    )
                                )}

                                {previews.length <
                                    5 && (
                                        <label className="flex h-[105px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]">

                                            <ImagePlus
                                                size={
                                                    22
                                                }
                                            />

                                            <span className="mt-2 text-xs">
                                            افزودن تصویر
                                        </span>

                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={
                                                    onPick
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                            </div>

                            {/* TIPS */}
                            <div className="mt-5 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4">
                                <div className="mb-3 flex items-center gap-2 text-[var(--primary)]">
                                    <Check
                                        size={
                                            17
                                        }
                                    />

                                    <span className="text-sm font-bold">
                                        نکات مهم
                                    </span>
                                </div>

                                <ul className="space-y-2 text-xs leading-6 text-[var(--text-secondary)]">
                                    <li>
                                        • حداکثر تعداد تصاویر ۵ عدد است.
                                    </li>

                                    <li>
                                        • فرمت‌های مجاز JPG، PNG، WEBP می‌باشد.
                                    </li>

                                    <li>
                                        • حجم هر تصویر حداکثر ۵ مگابایت باشد.
                                    </li>
                                </ul>
                            </div>

                            {err("images") && (
                                <p className="mt-3 flex items-center gap-1.5 text-xs text-[#B42318]">
                                    <AlertCircle
                                        size={13}
                                    />
                                    {err(
                                        "images"
                                    )}
                                </p>
                            )}
                        </section>

                        {/* PREVIEW */}
                        <section className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-5">

                            <div className="mb-4 flex items-center gap-2">
                                <Eye
                                    size={18}
                                    className="text-[var(--primary)]"
                                />

                                <h3 className="font-bold text-[var(--primary)]">
                                    پیش‌نمایش اطلاعات
                                </h3>
                            </div>

                            <div className="space-y-3 text-xs text-[var(--text-secondary)]">

                                <div className="flex justify-between gap-3">
                                    <span>
                                        نوع:
                                    </span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {selectedTypeLabel ||
                                            "انتخاب نشده"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>
                                        عنوان:
                                    </span>

                                    <span className="max-w-[200px] truncate font-medium text-[var(--text-primary)]">
                                        {title ||
                                            "بدون عنوان"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>
                                        موقعیت:
                                    </span>

                                    <span className="max-w-[220px] truncate font-medium text-[var(--text-primary)]">
                                        {selectedProvince?.title
                                            ? `${selectedProvince.title}${
                                                city
                                                    ? `، ${city}`
                                                    : ""
                                            }`
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>
                                        ظرفیت:
                                    </span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {capacity
                                            ? `${capacity.toLocaleString(
                                                "fa-IR"
                                            )} نفر`
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>
                                        اتاق خواب:
                                    </span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {bedrooms
                                            ? bedrooms.toLocaleString(
                                                "fa-IR"
                                            )
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>
                                        حمام:
                                    </span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {bathrooms
                                            ? bathrooms.toLocaleString(
                                                "fa-IR"
                                            )
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>
                                        قیمت:
                                    </span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {pricePerNight
                                            ? `${Number(
                                                pricePerNight
                                            ).toLocaleString(
                                                "fa-IR"
                                            )} تومان`
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span>
                                        امکانات:
                                    </span>

                                    <span className="font-medium text-[var(--text-primary)]">
                                        {amenities.length
                                            ? `${amenities.length.toLocaleString(
                                                "fa-IR"
                                            )} مورد`
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ================= RIGHT ================= */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-me)]">

                        {/* BASIC INFORMATION */}
                        <section>
                            <div className="mb-6">
                                <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
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
                                    error={err(
                                        "title"
                                    )}
                                >
                                    <input
                                        {...a11y(
                                            "title"
                                        )}
                                        value={
                                            title
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setTitle(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="مثال: ویلا استخر دار در محمودآباد"
                                        className={`${input} ${
                                            err(
                                                "title"
                                            )
                                                ? badBorder
                                                : okBorder
                                        }`}
                                    />
                                </Field>

                                {/* TYPE */}
                                <Field
                                    id="type"
                                    label="نوع ویلا"
                                    error={err(
                                        "type"
                                    )}
                                >
                                    <div className="relative">
                                        <select
                                            {...a11y(
                                                "type"
                                            )}
                                            value={
                                                type
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setType(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className={`${input} cursor-pointer appearance-none pl-10 ${
                                                err(
                                                    "type"
                                                )
                                                    ? badBorder
                                                    : okBorder
                                            }`}
                                        >
                                            <option value="">
                                                انتخاب کنید
                                            </option>

                                            {villaTypes.map(
                                                (
                                                    item
                                                ) => (
                                                    <option
                                                        key={
                                                            item.value
                                                        }
                                                        value={
                                                            item.value
                                                        }
                                                    >
                                                        {
                                                            item.label
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <ChevronDown
                                            size={
                                                17
                                            }
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />
                                    </div>
                                </Field>

                                {/* PROVINCE */}
                                <Field
                                    id="province"
                                    label="استان"
                                    error={err(
                                        "province"
                                    )}
                                >
                                    <div className="relative">
                                        <select
                                            {...a11y(
                                                "province"
                                            )}
                                            value={
                                                province
                                            }
                                            disabled={
                                                loadingProvinces
                                            }
                                            onChange={(
                                                event
                                            ) => {
                                                setProvince(
                                                    event
                                                        .target
                                                        .value
                                                );

                                                setCity(
                                                    ""
                                                );
                                            }}
                                            className={`${input} cursor-pointer appearance-none pl-10 ${
                                                err(
                                                    "province"
                                                )
                                                    ? badBorder
                                                    : okBorder
                                            }`}
                                        >
                                            <option value="">
                                                {loadingProvinces
                                                    ? "در حال دریافت..."
                                                    : "انتخاب استان"}
                                            </option>

                                            {provinces.map(
                                                (
                                                    item
                                                ) => (
                                                    <option
                                                        key={
                                                            item._id
                                                        }
                                                        value={
                                                            item._id
                                                        }
                                                    >
                                                        {
                                                            item.title
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <ChevronDown
                                            size={
                                                17
                                            }
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />
                                    </div>
                                </Field>

                                {/* CITY */}
                                <Field
                                    id="city"
                                    label="شهر"
                                    error={err(
                                        "city"
                                    )}
                                >
                                    <div className="relative">
                                        <select
                                            {...a11y(
                                                "city"
                                            )}
                                            value={
                                                city
                                            }
                                            disabled={
                                                !province
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setCity(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className={`${input} cursor-pointer appearance-none pl-10 ${
                                                err(
                                                    "city"
                                                )
                                                    ? badBorder
                                                    : okBorder
                                            }`}
                                        >
                                            <option value="">
                                                {province
                                                    ? "انتخاب شهر"
                                                    : "ابتدا استان را انتخاب کنید"}
                                            </option>

                                            {selectedProvince?.cities?.map(
                                                (
                                                    item
                                                ) => (
                                                    <option
                                                        key={
                                                            item
                                                        }
                                                        value={
                                                            item
                                                        }
                                                    >
                                                        {
                                                            item
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <ChevronDown
                                            size={
                                                17
                                            }
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />
                                    </div>
                                </Field>

                                {/* ADDRESS */}
                                <Field
                                    id="address"
                                    label="آدرس کامل"
                                    error={err(
                                        "address"
                                    )}
                                    className="col-span-2"
                                >
                                    <div className="relative">
                                        <MapPin
                                            size={
                                                18
                                            }
                                            className="absolute right-4 top-3 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            {...a11y(
                                                "address"
                                            )}
                                            value={
                                                address
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setAddress(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="آدرس دقیق ویلا را وارد کنید"
                                            className={`${input} pr-11 ${
                                                err(
                                                    "address"
                                                )
                                                    ? badBorder
                                                    : okBorder
                                            }`}
                                        />
                                    </div>
                                </Field>

                                {/* PRICE */}
                                <Field
                                    id="price"
                                    label="قیمت هر شب (تومان)"
                                    error={err(
                                        "price"
                                    )}
                                >
                                    <div className="relative">
                                        <input
                                            {...a11y(
                                                "price"
                                            )}
                                            inputMode="numeric"
                                            dir="ltr"
                                            value={
                                                pricePerNight
                                                    ? Number(
                                                        pricePerNight
                                                    ).toLocaleString(
                                                        "en-US"
                                                    )
                                                    : ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setPricePerNight(
                                                    event.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            placeholder="1,000,000"
                                            className={`${input} pl-16 text-left ${
                                                err(
                                                    "price"
                                                )
                                                    ? badBorder
                                                    : okBorder
                                            }`}
                                        />

                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)]">
                                            تومان
                                        </span>
                                    </div>
                                </Field>

                                {/* CAPACITY */}
                                <Field
                                    id="capacity"
                                    label="ظرفیت"
                                    error={err(
                                        "capacity"
                                    )}
                                >
                                    <div className="relative">
                                        <Users
                                            size={
                                                17
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            {...a11y(
                                                "capacity"
                                            )}
                                            type="number"
                                            min="0"
                                            value={
                                                capacity ||
                                                ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setCapacity(
                                                    Math.max(
                                                        0,
                                                        Number(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    )
                                                )
                                            }
                                            placeholder="مثال: 10"
                                            className={`${input} pr-11 ${
                                                err(
                                                    "capacity"
                                                )
                                                    ? badBorder
                                                    : okBorder
                                            }`}
                                        />
                                    </div>
                                </Field>

                                {/* BEDROOMS */}
                                <Field
                                    id="bedrooms"
                                    label="تعداد اتاق‌خواب‌ها"
                                    error={err(
                                        "bedrooms"
                                    )}
                                >
                                    <div className="relative">
                                        <BedDouble
                                            size={
                                                17
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            {...a11y(
                                                "bedrooms"
                                            )}
                                            type="number"
                                            min="0"
                                            value={
                                                bedrooms ||
                                                ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setBedrooms(
                                                    Math.max(
                                                        0,
                                                        Number(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    )
                                                )
                                            }
                                            placeholder="مثال: 3"
                                            className={`${input} pr-11 ${
                                                err(
                                                    "bedrooms"
                                                )
                                                    ? badBorder
                                                    : okBorder
                                            }`}
                                        />
                                    </div>
                                </Field>

                                {/* BATHROOMS */}
                                <Field
                                    id="bathrooms"
                                    label="تعداد حمام‌ها"
                                    error={err(
                                        "bathrooms"
                                    )}
                                >
                                    <div className="relative">
                                        <Bath
                                            size={
                                                17
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            {...a11y(
                                                "bathrooms"
                                            )}
                                            type="number"
                                            min="0"
                                            value={
                                                bathrooms ||
                                                ""
                                            }
                                            onChange={(event) =>
                                            {
                                                setBathrooms(Math.max(0, Number(event.target.value)))
                                            }
                                            }
                                            placeholder="مثال: 2"
                                            className={`${input} pr-11 ${
                                                err(
                                                    "bathrooms"
                                                )
                                                    ? badBorder
                                                    : okBorder
                                            }`}
                                        />
                                    </div>
                                </Field>
                            </div>
                        </section>

                        {/* DIVIDER */}
                        <div className="my-7 h-px bg-[var(--border)]"/>

                        {/* AMENITIES */}
                        <section>
                            <div className="mb-5">
                                <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
                                    امکانات
                                </h2>

                                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                    امکانات موجود در ویلا را انتخاب کنید
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                                {amenitiesList.map(
                                    ({
                                         label,
                                         icon: Icon,
                                     }) => {
                                        const active =
                                            amenities.includes(
                                                label
                                            );

                                        return (
                                            <button
                                                type="button"
                                                key={
                                                    label
                                                }
                                                onClick={() =>
                                                    setAmenities(
                                                        (
                                                            previous
                                                        ) =>
                                                            previous.includes(
                                                                label
                                                            )
                                                                ? previous.filter(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item !==
                                                                        label
                                                                )
                                                                : [
                                                                    ...previous,
                                                                    label,
                                                                ]
                                                    )
                                                }
                                                className={`flex h-11 items-center justify-between rounded-xl border px-3 transition ${
                                                    active
                                                        ? "border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[var(--primary)]"
                                                        : "border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-[var(--accent)]"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        size={
                                                            16
                                                        }
                                                    />

                                                    <span className="text-xs">
                                                        {
                                                            label
                                                        }
                                                    </span>
                                                </div>

                                                <span
                                                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                                                        active
                                                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                                            : "border-[#cbd5e1]"
                                                    }`}
                                                >
                                                    {active && (
                                                        <Check
                                                            size={
                                                                11
                                                            }
                                                        />
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    }
                                )}
                            </div>

                            {err(
                                "amenities"
                            ) && (
                                <p className="mt-3 flex items-center gap-1.5 text-xs text-[#B42318]">
                                    <AlertCircle
                                        size={
                                            13
                                        }
                                    />
                                    {err(
                                        "amenities"
                                    )}
                                </p>
                            )}
                        </section>

                        {/* DIVIDER */}
                        <div className="my-7 h-px bg-[var(--border)]"/>

                        {/* DESCRIPTION */}
                        <section>
                            <div className="mb-4">
                                <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
                                    توضیحات
                                </h2>

                                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                    توضیحات کامل و ویژگی‌های ویژه ویلا را وارد کنید
                                </p>
                            </div>

                            <div
                                className={`overflow-hidden rounded-xl border ${
                                    err(
                                        "description"
                                    )
                                        ? "border-[#B42318]"
                                        : "border-[var(--border)]"
                                }`}
                            >
                                {/* TOOLBAR */}
                                <div className="flex h-11 items-center gap-5 border-b border-[var(--border)] bg-[var(--surface-secondary)] px-4 text-[var(--text-secondary)]">
                                    <button
                                        type="button"
                                        className="font-bold"
                                    >
                                        B
                                    </button>

                                    <button
                                        type="button"
                                        className="italic"
                                    >
                                        I
                                    </button>

                                    <button
                                        type="button"
                                        className="underline"
                                    >
                                        U
                                    </button>

                                    <span className="h-5 w-px bg-[var(--border)]"/>

                                    <button type="button">
                                        ☷
                                    </button>

                                    <button type="button">
                                        ☰
                                    </button>

                                    <button type="button">
                                        ≡
                                    </button>

                                    <button type="button">
                                        ▦
                                    </button>
                                </div>

                                <textarea
                                    {...a11y(
                                        "description"
                                    )}
                                    value={
                                        description
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setDescription(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    rows={5}
                                    placeholder="توضیحات مربوط به ویلا ..."
                                    className="w-full resize-none border-0 bg-white px-4 py-4 text-sm leading-7 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
                                />
                            </div>

                            {err(
                                "description"
                            ) && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]">
                                    <AlertCircle
                                        size={
                                            13
                                        }
                                    />
                                    {err(
                                        "description"
                                    )}
                                </p>
                            )}
                        </section>

                        {/* ACTIONS */}
                        <div className="mt-6 flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-12 min-w-[190px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={
                                                18
                                            }
                                            className="animate-spin"
                                        />

                                        در حال ثبت...
                                    </>
                                ) : (
                                    <>
                                        <Save
                                            size={
                                                18
                                            }
                                        />

                                        ذخیره ویلا
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/admin/villas"
                                    )
                                }
                                disabled={
                                    loading
                                }
                                className="flex h-12 min-w-[130px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-secondary)] disabled:opacity-50"
                            >
                                <Eye
                                    size={17}
                                />

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
                                {progress.toLocaleString(
                                    "fa-IR"
                                )}
                                ٪ تکمیل شده
                            </span>
                        </div>

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                router.push(
                                    "/admin/villas"
                                )
                            }
                            className="h-11 cursor-pointer rounded-xl border border-[var(--border)] bg-white px-6 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-secondary)] disabled:opacity-50"
                        >
                            انصراف
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-8 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={
                                            17
                                        }
                                        className="animate-spin"
                                    />

                                    در حال ثبت...
                                </>
                            ) : (
                                <>
                                    <Check
                                        size={
                                            17
                                        }
                                    />

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