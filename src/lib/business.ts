import { businesses } from "@/config/businesses";

export function getBusiness(slug: string) {
  return businesses[slug] ?? null;
}

export function getAllBusinesses() {
  return Object.values(businesses);
}