import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}



export const formatDateForInput = (date) => {
  if (!date) return "";

  const d = new Date(date); // parse string or use Date object
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

