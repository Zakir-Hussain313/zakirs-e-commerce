import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sizes = [
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
  { label: "XXXL", value: "XXXL" },
];


export const sortings = [
  { label: "Default Sorting", value: "default_sorting" },
  { label: "Ascending Order", value: "asc" },
  { label: "Descending order", value: "desc" },
  { label: "Price : High to Low", value: "price_high_low" },
  { label: "Price : Low to High", value: "price_low_high" }
]