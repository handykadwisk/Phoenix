// src/utils/currencyFormatter.js
export const CurrencyFormat = (
    value: number,
    locale = "default",
    currency = "IDR"
) => {
    if (typeof value !== "number") {
        console.warn("Value must be a number");
        return value;
    }

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(value);
};
