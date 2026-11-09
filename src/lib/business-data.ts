
import { businesses, type BusinessConfig } from "@/config/businesses";
import { createClient } from "@/utils/supabase/server";

export async function getBusinessFromDatabase(
  slug: string
): Promise<BusinessConfig | null> {
  // Keep the existing design configuration
  const config = businesses[slug];

  if (!config) return null;

  const supabase = await createClient();

  // Fetch business
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (businessError) {
    console.error("Business fetch error:", businessError.message);
    throw new Error("Unable to load business information.");
  }

  if (!business) return null;

  // Fetch active services
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, name, description, duration, price, category")
    .eq("business_id", business.id)
    .eq("active", true)
    .order("name");

  if (servicesError) {
    console.error("Services fetch error:", servicesError.message);
    throw new Error("Unable to load services.");
  }

  // Fetch active staff
  const { data: staff, error: staffError } = await supabase
    .from("staff")
    .select("id, name, role, image")
    .eq("business_id", business.id)
    .eq("active", true)
    .order("name");

  if (staffError) {
    console.error("Staff fetch error:", staffError.message);
    throw new Error("Unable to load staff.");
  }

  return {
    ...config,
    name: business.name,
    services: (services ?? []).map((service) => ({
      ...service,
      gender: config.services.find(
        (item) => item.id === service.id
      )?.gender,
    })),
    staff: (staff ?? []).map((member) => ({
      ...member,
      image: member.image ?? "",
      gender: config.staff.find(
        (item) => item.id === member.id
      )?.gender,
    })),
  };
}
