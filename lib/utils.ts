import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmountForDisplay(
  amount: number,
  currency: string
): string {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  return numberFormat.format(amount);
}

export function formatAmountForStripe(
  amount: number,
  currency: string
): number {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency: boolean = true;
  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}
export const discountPrice = (price: number, discount: number): number => {
  let price_final: number = 0;

  price_final = (price * (100 - discount)) / 100;
  return parseFloat(price_final.toFixed(2));
};

export const getHours = (date1: Date, date2: Date) => {
  const hours = Math.abs(date1.getTime() - date2.getTime()) / 3600000;
  return hours;
};

export function deleteItemFomArray(
  arrayOfLetters: Array<unknown>,
  element: string
) {
  const arrayWithoutB = [];

  for (let i = 0; i < arrayOfLetters.length; i++) {
    if (arrayOfLetters[i] !== element) {
      arrayWithoutB.push(arrayOfLetters[i]);
    }
  }

  return arrayWithoutB;
}
