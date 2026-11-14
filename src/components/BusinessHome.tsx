
"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import Link from "next/link";
import type { BusinessConfig } from "@/config/businesses";

type Props = {
  business: string;
  config: BusinessConfig;
};

const translations: Record<string, Record<string, string>> = {
  gent: {
    welcome: "GENT میں خوش آمدید",
    home: "ہوم",
    services: "سروسز",
    team: "ہماری ٹیم",
    contact: "رابطہ",
    bookNow: "ابھی بک کریں",
    heroDescription:
      "مردوں کے لیے بہترین ہیئر کٹس، داڑھی کی تراش خراش اور جدید گرومنگ سروسز۔",
    bookAppointment: "اپائنٹمنٹ بک کریں",
    explore: "سروسز دیکھیں",
    whatOffer: "ہم کیا پیش کرتے ہیں",
    ourServices: "ہماری سروسز",
    serviceIntro: "اپنی پسند کی سروس منتخب کریں۔",
    minutes: "منٹ",
    book: "بک کریں",
    professionals: "ہمارے ماہرین سے ملیے",
    ourTeam: "ہماری ٹیم",
    getInTouch: "ہم سے رابطہ کریں",
    visit: "آج ہی تشریف لائیں",
    contactDescription:
      "کسی سوال یا اپائنٹمنٹ کے لیے ہماری ٹیم سے رابطہ کریں۔",
    phone: "فون",
    email: "ای میل",
    address: "پتہ",
    whatsapp: "واٹس ایپ پر رابطہ کریں",
    ready: "بکنگ کے لیے تیار ہیں؟",
    readyDescription:
      "اپنی پسند کی سروس منتخب کریں اور اپائنٹمنٹ بک کریں۔",
    bookYourAppointment: "اپنی اپائنٹمنٹ بک کریں",
    rights: "تمام حقوق محفوظ ہیں۔",
  },
  glow: {
    welcome: "GLOW میں خوش آمدید",
    home: "ہوم",
    services: "سروسز",
    team: "ہماری ٹیم",
    contact: "رابطہ",
    bookNow: "ابھی بک کریں",
    heroDescription:
      "خوبصورتی اور جلد کی دیکھ بھال کے لیے پیشہ ورانہ سروسز۔",
    bookAppointment: "اپائنٹمنٹ بک کریں",
    explore: "سروسز دیکھیں",
    whatOffer: "ہم کیا پیش کرتے ہیں",
    ourServices: "ہماری سروسز",
    serviceIntro: "اپنی جلد اور خوبصورتی کے لیے مناسب سروس منتخب کریں۔",
    minutes: "منٹ",
    book: "بک کریں",
    professionals: "ہمارے ماہرین سے ملیے",
    ourTeam: "ہماری ٹیم",
    getInTouch: "ہم سے رابطہ کریں",
    visit: "آج ہی تشریف لائیں",
    contactDescription:
      "اپائنٹمنٹ یا مزید معلومات کے لیے ہماری ٹیم سے رابطہ کریں۔",
    phone: "فون",
    email: "ای میل",
    address: "پتہ",
    whatsapp: "واٹس ایپ پر رابطہ کریں",
    ready: "بکنگ کے لیے تیار ہیں؟",
    readyDescription:
      "اپنی پسند کی سروس منتخب کریں اور اپائنٹمنٹ بک کریں۔",
    bookYourAppointment: "اپنی اپائنٹمنٹ بک کریں",
    rights: "تمام حقوق محفوظ ہیں۔",
  },
};

const serviceTranslations: Record<string, {
  name: string;
  description: string;
  category: string;
}> = {
  "gent-haircut": {
    name: "کلاسک ہیئر کٹ",
    description: "آپ کے انداز کے مطابق پروفیشنل ہیئر کٹ۔",
    category: "بال",
  },
  "gent-beard": {
    name: "داڑھی کی تراش خراش",
    description: "داڑھی کی تراش، شیپ اور بہترین فنشنگ۔",
    category: "داڑھی",
  },
  "gent-combo": {
    name: "ہیئر کٹ اور داڑھی",
    description: "بالوں اور داڑھی کی مکمل گرومنگ۔",
    category: "پیکجز",
  },
  "gent-facial": {
    name: "مردوں کے لیے فیشل",
    description: "مردوں کی جلد کے لیے تازگی بخش فیشل۔",
    category: "جلد کی دیکھ بھال",
  },
  "glow-facial": {
    name: "ہائیڈریٹنگ فیشل",
    description: "جلد کو نمی اور چمک دینے والا فیشل۔",
    category: "فیشل",
  },
  "glow-cleanup": {
    name: "ڈیپ اسکن کلین اپ",
    description: "جلد کی صفائی اور تازگی کے لیے خصوصی ٹریٹمنٹ۔",
    category: "جلد کی دیکھ بھال",
  },
  "glow-makeup": {
    name: "پارٹی میک اپ",
    description: "خاص مواقع کے لیے پروفیشنل میک اپ۔",
    category: "میک اپ",
  },
  "glow-hair": {
    name: "ہیئر اسٹائلنگ",
    description: "آپ کی پسند کے مطابق پروفیشنل ہیئر اسٹائلنگ۔",
    category: "بال",
  },
};

const roleTranslations: Record<string, string> = {
  "Senior Barber": "سینئر حجام",
  "Hair Stylist": "ہیئر اسٹائلسٹ",
  "Skincare Specialist": "جلد کے ماہر",
  "Beauty Specialist": "بیوٹی اسپیشلسٹ",
};

export default function BusinessHome({ business, config }: Props) {
const { isUrdu, setLanguage } = useLanguage();
  const t = translations[business] ?? translations.gent;

  const whatsappNumber = config.contact.whatsapp.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <main
      lang={isUrdu ? "ur" : "en"}
      dir={isUrdu ? "rtl" : "ltr"}
      className={isUrdu ? "urdu-page min-h-screen" : "min-h-screen"}
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4">
          <Link
            href={`/${business}`}
            className="shrink-0 text-2xl font-bold tracking-widest"
            style={{ color: config.colors.primary }}
          >
            {config.logo}
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#home" className="hover:opacity-60">
              {isUrdu ? t.home : "Home"}
            </a>
            <a href="#services" className="hover:opacity-60">
              {isUrdu ? t.services : "Services"}
            </a>
            <a href="#team" className="hover:opacity-60">
              {isUrdu ? t.team : "Our Team"}
            </a>
            <a href="#contact" className="hover:opacity-60">
              {isUrdu ? t.contact : "Contact"}
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage(isUrdu ? "en" : "ur")}
              className="rounded-full border px-3 py-2 text-xs font-bold"
              style={{
                borderColor: config.colors.primary,
                color: config.colors.primary,
              }}
              aria-label="Switch language"
            >
              {isUrdu ? "English" : "اردو"}
            </button>

            <Link
              href={`/${business}/book`}
              className="rounded-full px-4 py-3 text-xs font-semibold text-white transition hover:opacity-80 sm:px-5 sm:text-sm"
              style={{ backgroundColor: config.colors.primary }}
            >
              {isUrdu ? t.bookNow : "Book Now"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative overflow-hidden"
        style={{ backgroundColor: config.colors.secondary }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-28">
          <div className="text-white">
            <p
              className="mb-5 text-sm font-semibold"
              style={{ color: config.colors.primary }}
            >
              {isUrdu ? t.welcome : `Welcome to ${config.name}`}
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              {isUrdu
                ? business === "gent"
                  ? "بہترین انداز، پُراعتماد شخصیت"
                  : "خوبصورت محسوس کریں، پُراعتماد رہیں"
                : config.tagline}
            </h1>

            <p className="mb-9 max-w-lg text-base leading-8 text-white/75">
              {isUrdu ? t.heroDescription : config.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${business}/book`}
                className="rounded-full px-7 py-4 font-semibold text-white transition hover:opacity-80"
                style={{ backgroundColor: config.colors.primary }}
              >
                {isUrdu ? t.bookAppointment : "Book an Appointment"}
              </Link>

              <a
                href="#services"
                className="rounded-full border border-white/40 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-black"
              >
                {isUrdu ? t.explore : "Explore Services"}
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

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-12 text-center">
          <p
            className="mb-3 text-sm font-bold"
            style={{ color: config.colors.primary }}
          >
            {isUrdu ? t.whatOffer : "What We Offer"}
          </p>

          <h2 className="text-3xl font-bold md:text-4xl">
            {isUrdu ? t.ourServices : "Our Services"}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 opacity-70">
            {isUrdu
              ? t.serviceIntro
              : "Explore our services and choose the treatment that suits you."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {config.services.map((service) => {
            const translated = serviceTranslations[service.id];

            return (
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
                  className="mb-2 text-xs font-bold"
                  style={{ color: config.colors.primary }}
                >
                  {isUrdu && translated
                    ? translated.category
                    : service.category}
                </p>

                <h3 className="mb-3 text-lg font-bold">
                  {isUrdu && translated ? translated.name : service.name}
                </h3>

                <p className="mb-5 min-h-12 text-sm leading-6 opacity-70">
                  {isUrdu && translated
                    ? translated.description
                    : service.description}
                </p>

                <div className="flex items-center justify-between gap-2 border-t pt-4">
                  <div>
                    <p className="text-lg font-bold" dir="ltr">
                      Rs. {service.price.toLocaleString("en-PK")}
                    </p>

                    <p className="text-xs opacity-60">
                      {service.duration} {isUrdu ? t.minutes : "minutes"}
                    </p>
                  </div>

                  <Link
                    href={`/${business}/book`}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: config.colors.primary }}
                  >
                    {isUrdu ? t.book : "Book"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section
        id="team"
        className="py-20"
        style={{ backgroundColor: `${config.colors.primary}12` }}
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-12 text-center">
            <p
              className="mb-3 text-sm font-bold"
              style={{ color: config.colors.primary }}
            >
              {isUrdu ? t.professionals : "Meet Our Professionals"}
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              {isUrdu ? t.ourTeam : "Our Team"}
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
                  <h3 className="text-lg font-bold">{member.name}</h3>

                  <p
                    className="mt-2 text-sm"
                    style={{ color: config.colors.primary }}
                  >
                    {isUrdu
                      ? roleTranslations[member.role] ?? member.role
                      : member.role}
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
              className="mb-3 text-sm font-bold"
              style={{ color: config.colors.primary }}
            >
              {isUrdu ? t.getInTouch : "Get In Touch"}
            </p>

            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              {isUrdu ? t.visit : "Visit Us Today"}
            </h2>

            <p className="mb-8 max-w-md leading-7 opacity-70">
              {isUrdu
                ? t.contactDescription
                : "Have questions or want to schedule your next appointment? Contact our team."}
            </p>

            <div className="space-y-5">
              <div>
                <p className="text-sm font-bold">
                  {isUrdu ? t.phone : "Phone"}
                </p>
                <p className="mt-1 opacity-70" dir="ltr">
                  {config.contact.phone}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold">
                  {isUrdu ? t.email : "Email"}
                </p>
                <p className="mt-1 opacity-70" dir="ltr">
                  {config.contact.email}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold">
                  {isUrdu ? t.address : "Address"}
                </p>
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
              {isUrdu ? t.whatsapp : "Chat on WhatsApp"}
            </a>
          </div>

          <div
            className="flex min-h-80 items-center justify-center rounded-2xl p-8 text-center"
            style={{ backgroundColor: `${config.colors.primary}18` }}
          >
            <div>
              <h3 className="mb-4 text-2xl font-bold">
                {isUrdu ? t.ready : "Ready to Book?"}
              </h3>

              <p className="mb-7 text-sm leading-7 opacity-70">
                {isUrdu
                  ? t.readyDescription
                  : "Choose your service and reserve a convenient appointment."}
              </p>

              <Link
                href={`/${business}/book`}
                className="inline-block rounded-full px-8 py-4 font-semibold text-white"
                style={{ backgroundColor: config.colors.primary }}
              >
                {isUrdu ? t.bookYourAppointment : "Book Your Appointment"}
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
        <p className="font-bold tracking-widest">{config.name}</p>

        <p className="mt-2 text-white/60">
          © {new Date().getFullYear()} {config.name}.{" "}
          {isUrdu ? t.rights : "All rights reserved."}
        </p>
      </footer>
    </main>
  );
}
