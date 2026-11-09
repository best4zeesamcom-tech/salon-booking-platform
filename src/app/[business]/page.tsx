
import { notFound } from "next/navigation";
import Link from "next/link";
import { businesses } from "@/config/businesses";
import { getBusinessFromDatabase } from "@/lib/business-data";
export const instant = false;
type PageProps = {
  params: Promise<{
    business: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(businesses).map((business) => ({
    business,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { business } = await params;
  const config = businesses[business];

  if (!config) {
    return { title: "Business Not Found" };
  }

  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords,
  };
}

export default async function BusinessPage({ params }: PageProps) {
  const { business } = await params;

  // Fetch business information, services and staff from Supabase
  const config = await getBusinessFromDatabase(business);

  if (!config) {
    notFound();
  }

  const whatsappLink = `https://wa.me/${config.contact.whatsapp}`;

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: config.colors.background,
        color: config.colors.text,
      }}
    >
      {/* Navigation */}
      <header
        className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur"
        style={{ borderColor: `${config.colors.primary}40` }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link
            href={`/${business}`}
            className="text-2xl font-bold tracking-widest"
            style={{ color: config.colors.primary }}
          >
            {config.logo}
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#home" className="hover:opacity-60">
              Home
            </a>
            <a href="#services" className="hover:opacity-60">
              Services
            </a>
            <a href="#team" className="hover:opacity-60">
              Our Team
            </a>
            <a href="#contact" className="hover:opacity-60">
              Contact
            </a>
          </nav>

          <Link
            href={`/${business}/book`}
            className="rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-80"
            style={{ backgroundColor: config.colors.primary }}
          >
            Book Now
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative overflow-hidden"
        style={{ backgroundColor: config.colors.secondary }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <div className="text-white">
            <p
              className="mb-5 text-sm font-semibold uppercase tracking-[0.3em]"
              style={{ color: config.colors.primary }}
            >
              Welcome to {config.name}
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              {config.tagline}
            </h1>

            <p className="mb-9 max-w-lg text-base leading-8 text-white/75">
              {config.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${business}/book`}
                className="rounded-full px-7 py-4 font-semibold text-white transition hover:opacity-80"
                style={{ backgroundColor: config.colors.primary }}
              >
                Book an Appointment
              </Link>

              <a
                href="#services"
                className="rounded-full border border-white/40 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Explore Services
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              src={
                config.businessType === "barbershop"
                  ? "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85"
                  : "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=85"
              }
              alt={`${config.name} interior`}
              className="h-[350px] w-full rounded-2xl object-cover shadow-2xl md:h-[480px]"
            />
          </div>
        </div>
      </section>

      {/* Services - Live Supabase Data */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-12 text-center">
          <p
            className="mb-3 text-sm font-bold uppercase tracking-widest"
            style={{ color: config.colors.primary }}
          >
            What We Offer
          </p>

          <h2 className="text-3xl font-bold md:text-4xl">
            Our Services
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 opacity-70">
            Explore our services and choose the treatment that suits you.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {config.services.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: `${config.colors.primary}35` }}
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-full text-xl"
                style={{
                  backgroundColor: `${config.colors.primary}20`,
                  color: config.colors.primary,
                }}
              >
                ✦
              </div>

              <p
                className="mb-2 text-xs font-bold uppercase tracking-wider"
                style={{ color: config.colors.primary }}
              >
                {service.category}
              </p>

              <h3 className="mb-3 text-lg font-bold">
                {service.name}
              </h3>

              <p className="mb-5 min-h-12 text-sm leading-6 opacity-70">
                {service.description}
              </p>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <p className="text-lg font-bold">
                    Rs. {service.price.toLocaleString("en-PK")}
                  </p>

                  <p className="text-xs opacity-60">
                    {service.duration} minutes
                  </p>
                </div>

                <Link
                  href={`/${business}/book`}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-white"
                  style={{ backgroundColor: config.colors.primary }}
                >
                  Book
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Team - Live Supabase Data */}
      <section
        id="team"
        className="py-20"
        style={{ backgroundColor: `${config.colors.primary}12` }}
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-12 text-center">
            <p
              className="mb-3 text-sm font-bold uppercase tracking-widest"
              style={{ color: config.colors.primary }}
            >
              Meet Our Professionals
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Our Team
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {config.staff.map((member) => (
              <article
                key={member.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-72 w-full object-cover"
                />

                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold">
                    {member.name}
                  </h3>

                  <p
                    className="mt-2 text-sm"
                    style={{ color: config.colors.primary }}
                  >
                    {member.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p
              className="mb-3 text-sm font-bold uppercase tracking-widest"
              style={{ color: config.colors.primary }}
            >
              Get In Touch
            </p>

            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Visit Us Today
            </h2>

            <p className="mb-8 max-w-md leading-7 opacity-70">
              Have questions or want to schedule your next appointment?
              Contact our team.
            </p>

            <div className="space-y-5">
              <div>
                <p className="text-sm font-bold">Phone</p>
                <p className="mt-1 opacity-70">
                  {config.contact.phone}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold">Email</p>
                <p className="mt-1 opacity-70">
                  {config.contact.email}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold">Address</p>
                <p className="mt-1 opacity-70">
                  {config.contact.address}
                </p>
              </div>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full px-7 py-4 font-semibold text-white"
              style={{ backgroundColor: config.colors.primary }}
            >
              Chat on WhatsApp
            </a>
          </div>

          <div
            className="flex min-h-80 items-center justify-center rounded-2xl p-8 text-center"
            style={{ backgroundColor: `${config.colors.primary}18` }}
          >
            <div>
              <h3 className="mb-4 text-2xl font-bold">
                Ready to Book?
              </h3>

              <p className="mb-7 text-sm leading-7 opacity-70">
                Choose your service and reserve a convenient appointment.
              </p>

              <Link
                href={`/${business}/book`}
                className="inline-block rounded-full px-8 py-4 font-semibold text-white"
                style={{ backgroundColor: config.colors.primary }}
              >
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-5 py-8 text-center text-sm text-white"
        style={{ backgroundColor: config.colors.secondary }}
      >
        <p className="font-bold tracking-widest">
          {config.name}
        </p>

        <p className="mt-2 text-white/60">
          © {new Date().getFullYear()} {config.name}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
