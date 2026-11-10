
import { notFound } from "next/navigation";
import BookingForm from "@/components/booking/BookingForm";
import { getBusinessFromDatabase } from "@/lib/business-data";

export const instant = false;

type PageProps = {
  params: Promise<{
    business: string;
  }>;
};

export default async function BookingPage({ params }: PageProps) {
  const { business } = await params;

  const config = await getBusinessFromDatabase(business.toLowerCase());

  if (!config) {
    notFound();
  }

  return (
    <BookingForm
      businessId={config.slug}
      businessName={config.name}
      services={config.services}
      staff={config.staff}
      primaryColor={config.colors.primary}
      backgroundColor={config.colors.background}
      textColor={config.colors.text}
    />
  );
}
