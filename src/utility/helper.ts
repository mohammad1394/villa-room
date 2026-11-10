import DateObject from "react-date-object";

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fa-IR");
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
};


export const formatNumber = (value: number) => {
    return new Intl.NumberFormat("fa-IR").format(value);
}

export const toPersianDate = (date: DateObject | null) =>{
    date ? date.format("YYYY/MM/DD") : "";
}

export const toGregorianDate = (date: Date | undefined) => {
    if (!date || Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};
