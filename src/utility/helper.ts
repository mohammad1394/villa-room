export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fa-IR");
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
};


export const formatNumber = (value: number) => {
    return new Intl.NumberFormat("fa-IR").format(value);
}