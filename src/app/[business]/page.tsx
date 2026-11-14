
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { businesses } from "@/config/businesses";
import { getBusinessFromDatabase } from "@/lib/business-data";
import BusinessHome from "@/components/BusinessHome";

export const instant = false;

const BASE_URL = "https://salon-booking-platform-8e9k.vercel.app";

type PageProps = {
  params: Promise<{
    business: string;
  }>;
};

const schemaDays: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function generateStaticParams() {
  return Object.keys(businesses).map((business) => ({
    business,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { business } = await params;
  const config = businesses[business];

  if (!config) {
    return {
      title: "Business Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords,
    openGraph: {
      type: "website",
      title: config.seo.title,
      description: config.seo.description,
      siteName: config.name,
      locale: "en_PK",
    },
    twitter: {
      card: "summary_large_image",
      title: config.seo.title,
      description: config.seo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BusinessPage({
  params,
}: PageProps) {
  const { business } = await params;

  const config = await getBusinessFromDatabase(business);

  if (!config) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type":
      config.businessType === "barbershop"
        ? "BarberShop"
        : "BeautySalon",
    name: config.name,
    description: config.description,
    url: `${BASE_URL}/${config.slug}`,
    telephone: config.contact.phone,
    email: config.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: config.contact.address,
      addressLocality: "Rawalpindi",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    openingHoursSpecification: Object.entries(
      config.openingHours
    )
      .filter(([, hours]) => !hours.closed)
      .map(([day, hours]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${schemaDays[day] ?? day}`,
        opens: hours.open,
        closes: hours.close,
      })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${config.name} Services`,
      itemListElement: config.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
        price: service.price,
        priceCurrency: "PKR",
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <BusinessHome business={business} config={config} />
    </>
  );
}
