
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Service, Staff } from "@/config/businesses";
import { createClient } from "@/lib/supabase/client";

type BookingFormProps = {
  businessId: string;
  businessName: string;
  services: Service[];
  staff: Staff[];
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
};

type AvailableSlot = {
  start_at: string;
  end_at: string;
};

const englishText = {
  back: "Back",
  reservation: "Appointment reservation",
  title: "Book Your Appointment",
  description: "Choose your preferred service, professional, date and time.",
  details: "01. Your details",
  fullName: "Full name",
  enterName: "Enter your full name",
  email: "Email address",
  phone: "Phone number",
  chooseService: "02. Choose your service",
  services: "Available services",
  selectService: "Select a service",
  minutes: "minutes",
  chooseProfessional: "03. Choose your professional",
  staff: "Select staff member",
  selectProfessional: "Select a professional",
  dateTime: "04. Date and time",
  date: "Appointment date",
  time: "Available time",
  checking: "Checking available times...",
  selectFirst: "Select service, staff and date first",
  noTimes: "No available times",
  chooseTime: "Choose a time",
  noAppointments:
    "No available appointments for this selection. Try another date or professional.",
  slotsFound: "available time slots found.",
  total: "Appointment total",
  submit: "Submitting your booking...",
  confirm: "Confirm Appointment",
  pending:
    "Your appointment will be submitted as a pending booking. The business will confirm it with you.",
  selectServiceAndTime:
    "Please select a service and appointment time.",
  loadError: "Unable to load available times. Please try again.",
  bookingError: "The booking could not be confirmed.",
  generalError: "Something went wrong. Please try again.",
  received: "Booking request received",
  thankYou: "Thank you",
  confirmation:
    "Your appointment request has been submitted. Your booking is pending confirmation.",
  reference: "Booking reference",
  service: "Service",
  professional: "Professional",
  appointment: "Appointment",
  amount: "Amount",
  keepReference:
    "Please keep your booking reference for future communication.",
  backHome: "Back to",
  available: "available",
} as const;

const urduText = {
  back: "واپس",
  reservation: "اپائنٹمنٹ کی بکنگ",
  title: "اپنی اپائنٹمنٹ بک کریں",
  description: "اپنی پسند کی سروس، ماہر، تاریخ اور وقت منتخب کریں۔",
  details: "01۔ آپ کی تفصیلات",
  fullName: "پورا نام",
  enterName: "اپنا پورا نام درج کریں",
  email: "ای میل ایڈریس",
  phone: "فون نمبر",
  chooseService: "02۔ اپنی سروس منتخب کریں",
  services: "دستیاب سروسز",
  selectService: "سروس منتخب کریں",
  minutes: "منٹ",
  chooseProfessional: "03۔ اپنے ماہر کا انتخاب کریں",
  staff: "عملے کا رکن منتخب کریں",
  selectProfessional: "ماہر منتخب کریں",
  dateTime: "04۔ تاریخ اور وقت",
  date: "اپائنٹمنٹ کی تاریخ",
  time: "دستیاب وقت",
  checking: "دستیاب اوقات چیک کیے جا رہے ہیں...",
  selectFirst: "پہلے سروس، ماہر اور تاریخ منتخب کریں",
  noTimes: "کوئی وقت دستیاب نہیں",
  chooseTime: "وقت منتخب کریں",
  noAppointments:
    "اس انتخاب کے لیے کوئی اپائنٹمنٹ دستیاب نہیں۔ دوسری تاریخ یا ماہر منتخب کریں۔",
  slotsFound: "دستیاب اوقات مل گئے۔",
  total: "اپائنٹمنٹ کی کل قیمت",
  submit: "آپ کی بکنگ جمع کی جا رہی ہے...",
  confirm: "اپائنٹمنٹ کی تصدیق کریں",
  pending:
    "آپ کی اپائنٹمنٹ عارضی بکنگ کے طور پر جمع ہوگی۔ کاروبار کی جانب سے آپ سے رابطہ کرکے تصدیق کی جائے گی۔",
  selectServiceAndTime:
    "براہ کرم سروس اور اپائنٹمنٹ کا وقت منتخب کریں۔",
  loadError: "دستیاب اوقات لوڈ نہیں ہو سکے۔ دوبارہ کوشش کریں۔",
  bookingError: "آپ کی بکنگ کی تصدیق نہیں ہو سکی۔",
  generalError: "کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔",
  received: "آپ کی بکنگ کی درخواست موصول ہو گئی",
  thankYou: "شکریہ",
  confirmation:
    "آپ کی اپائنٹمنٹ کی درخواست جمع ہو گئی ہے۔ آپ کی بکنگ کی تصدیق ہونا ابھی باقی ہے۔",
  reference: "بکنگ ریفرنس",
  service: "سروس",
  professional: "ماہر",
  appointment: "اپائنٹمنٹ",
  amount: "رقم",
  keepReference:
    "براہ کرم آئندہ رابطے کے لیے اپنا بکنگ ریفرنس محفوظ رکھیں۔",
  backHome: "واپس",
  available: "دستیاب",
} as const;

const urduServiceNames: Record<string, string> = {
  "gent-haircut": "کلاسک ہیئر کٹ",
  "gent-beard": "داڑھی کی تراش خراش",
  "gent-combo": "ہیئر کٹ اور داڑھی",
  "gent-facial": "مردوں کے لیے فیشل",
  "glow-facial": "ہائیڈریٹنگ فیشل",
  "glow-cleanup": "ڈیپ اسکن کلین اپ",
  "glow-makeup": "پارٹی میک اپ",
  "glow-hair": "ہیئر اسٹائلنگ",
};

const urduServiceDescriptions: Record<string, string> = {
  "gent-haircut": "آپ کے انداز کے مطابق پروفیشنل ہیئر کٹ۔",
  "gent-beard": "داڑھی کی تراش، شیپ اور بہترین فنشنگ۔",
  "gent-combo": "بالوں اور داڑھی کی مکمل گرومنگ۔",
  "gent-facial": "مردوں کی جلد کے لیے تازگی بخش فیشل۔",
  "glow-facial": "جلد کو نمی اور چمک دینے والا فیشل۔",
  "glow-cleanup": "جلد کی صفائی اور تازگی کے لیے خصوصی ٹریٹمنٹ۔",
  "glow-makeup": "خاص مواقع کے لیے پروفیشنل میک اپ۔",
  "glow-hair": "آپ کی پسند کے مطابق پروفیشنل ہیئر اسٹائلنگ۔",
};

const urduStaffRoles: Record<string, string> = {
  "Senior Barber": "سینئر حجام",
  "Hair Stylist": "ہیئر اسٹائلسٹ",
  "Skincare Specialist": "جلد کے ماہر",
  "Beauty Specialist": "بیوٹی اسپیشلسٹ",
};

export default function BookingForm({
  businessId,
  businessName,
  services,
  staff,
  primaryColor,
  backgroundColor,
  textColor,
}: BookingFormProps) {
  const { isUrdu, setLanguage } = useLanguage();

  const t = (key: keyof typeof englishText) =>
    isUrdu ? urduText[key] : englishText[key];

  const serviceName = (service: Service) =>
    isUrdu
      ? urduServiceNames[service.id] ?? service.name
      : service.name;

  const serviceDescription = (service: Service) =>
    isUrdu
      ? urduServiceDescriptions[service.id] ?? service.description
      : service.description;

  const staffRole = (role: string) =>
    isUrdu ? urduStaffRoles[role] ?? role : role;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingId, setBookingId] = useState("");

  const supabase = createClient();

  const selectedService = services.find(
    (service) => service.id === serviceId
  );

  const selectedStaff = staff.find(
    (member) => member.id === staffId
  );

  // Load available appointment times whenever selection changes.
  useEffect(() => {
    let cancelled = false;

    async function loadSlots() {
      setSlots([]);
      setSelectedSlot("");
      setErrorMessage("");

      if (!serviceId || !staffId || !appointmentDate) {
        setLoadingSlots(false);
        return;
      }

      setLoadingSlots(true);

      const { data, error } = await supabase.rpc(
        "get_available_slots",
        {
          p_business_id: businessId,
          p_service_id: serviceId,
          p_staff_id: staffId,
          p_date: appointmentDate,
        }
      );

      if (cancelled) return;

      if (error) {
        setErrorMessage(
          isUrdu ? urduText.loadError : englishText.loadError
        );
        setSlots([]);
      } else {
        setSlots((data ?? []) as AvailableSlot[]);
      }

      setLoadingSlots(false);
    }

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [businessId, serviceId, staffId, appointmentDate]);


function formatSlot(dateString: string) {
  const date = new Date(dateString);

  if (!dateString || Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat(
    isUrdu ? "ur-PK" : "en-PK",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Karachi",
    }
  ).format(date);
}

function formatAppointmentDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00+05:00`);

  if (!dateString || Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat(
    isUrdu ? "ur-PK" : "en-PK",
    {
      dateStyle: "medium",
      timeZone: "Asia/Karachi",
    }
  ).format(date);
}


  function getToday() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const values = Object.fromEntries(
      parts.map((part) => [part.type, part.value])
    );

    return `${values.year}-${values.month}-${values.day}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!selectedService || !selectedSlot) {
      setErrorMessage(t("selectServiceAndTime"));
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.rpc("create_booking", {
        p_business_id: businessId,
        p_service_id: serviceId,
        p_staff_id: staffId,
        p_customer_name: customerName.trim(),
        p_customer_email: customerEmail.trim(),
        p_customer_phone: customerPhone.trim(),
        p_start_at: selectedSlot,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("BOOKING_NOT_CONFIRMED");
      }

      setBookingId(data as string);
    } catch {
      setErrorMessage(
        isUrdu ? urduText.generalError : englishText.generalError
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

  const languageButton = (
    <button
      type="button"
      onClick={() => setLanguage(isUrdu ? "en" : "ur")}
      className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-70"
      style={{
        borderColor: primaryColor,
        color: primaryColor,
      }}
    >
      {isUrdu ? "English" : "اردو"}
    </button>
  );

  // Booking confirmation screen.
  if (bookingId) {
    return (
      <main
        lang={isUrdu ? "ur" : "en"}
        dir={isUrdu ? "rtl" : "ltr"}
        className={`flex min-h-screen items-center justify-center px-4 py-12 ${
          isUrdu ? "urdu-page" : ""
        }`}
        style={{ backgroundColor }}
      >
        <section className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
          <div className="mb-6 flex justify-end">
            {languageButton}
          </div>

          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white"
            style={{ backgroundColor: primaryColor }}
          >
            ✓
          </div>

          <p className="mt-6 text-sm font-semibold text-green-700">
            {t("received")}
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {t("thankYou")}، {customerName}!
          </h1>

          <p className="mt-3 leading-8 text-gray-600">
            {isUrdu
              ? `${businessName} کو آپ کی اپائنٹمنٹ کی درخواست موصول ہو گئی ہے۔ آپ کی بکنگ کی تصدیق ہونا ابھی باقی ہے۔`
              : `Your appointment request has been submitted to ${businessName}. Your booking is pending confirmation.`}
          </p>

          <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-start">
            <div className="flex justify-between gap-4 border-b border-gray-200 pb-4">
              <span className="text-sm text-gray-500">
                {t("reference")}
              </span>
              <span
                dir="ltr"
                className="break-all text-end text-sm font-semibold text-gray-900"
              >
                {bookingId}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 py-4">
              <span className="text-sm text-gray-500">
                {t("service")}
              </span>
              <span className="text-end text-sm font-semibold text-gray-900">
                {selectedService ? serviceName(selectedService) : ""}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 py-4">
              <span className="text-sm text-gray-500">
                {t("professional")}
              </span>
              <span className="text-end text-sm font-semibold text-gray-900">
                {selectedStaff?.name ?? ""}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 py-4">
              <span className="text-sm text-gray-500">
                {t("appointment")}
              </span>
              <span className="text-end text-sm font-semibold text-gray-900">
                {formatAppointmentDate(appointmentDate)}
                {" · "}
                {formatSlot(selectedSlot)}
              </span>
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <span className="text-sm text-gray-500">
                {t("amount")}
              </span>
              <span
                dir="ltr"
                className="text-end text-sm font-bold text-gray-900"
              >
                Rs. {selectedService?.price.toLocaleString("en-PK")}
              </span>
            </div>
          </div>

          <p className="mt-6 text-xs leading-6 text-gray-500">
            {t("keepReference")}
          </p>

          <a
            href={`/${businessId}`}
            className="mt-8 inline-flex rounded-full px-7 py-3 font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {t("backHome")} {businessName}
          </a>
        </section>
      </main>
    );
  }

  // Booking form.
  return (
    <main
      lang={isUrdu ? "ur" : "en"}
      dir={isUrdu ? "rtl" : "ltr"}
      className={`min-h-screen px-4 py-12 sm:px-6 ${
        isUrdu ? "urdu-page" : ""
      }`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <a
            href={`/${businessId}`}
            className="text-sm font-medium transition hover:opacity-60"
          >
            ← {t("back")} {businessName}
          </a>

          {languageButton}
        </div>

        <div className="mb-8 mt-8">
          <p
            className="text-xs font-bold"
            style={{ color: primaryColor }}
          >
            {t("reservation")}
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            {t("title")}
          </h1>

          <p className="mt-3 text-sm leading-8 opacity-70">
            {t("description")} {businessName}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl bg-white p-5 shadow-xl sm:p-9"
        >
          {/* Customer details */}
          <section>
            <h2 className="text-lg font-bold text-gray-900">
              {t("details")}
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="customerName"
                  className="text-sm font-semibold text-gray-700"
                >
                  {t("fullName")}
                </label>

                <input
                  id="customerName"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder={t("enterName")}
                  dir={isUrdu ? "rtl" : "auto"}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="customerEmail"
                  className="text-sm font-semibold text-gray-700"
                >
                  {t("email")}
                </label>

                <input
                  id="customerEmail"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  value={customerEmail}
                  onChange={(event) =>
                    setCustomerEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  dir="ltr"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="text-sm font-semibold text-gray-700"
                >
                  {t("phone")}
                </label>

                <input
                  id="customerPhone"
                  type="tel"
                  required
                  minLength={7}
                  maxLength={25}
                  autoComplete="tel"
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(event.target.value)
                  }
                  placeholder="+92 300 1234567"
                  dir="ltr"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Service selection */}
          <section>
            <h2 className="text-lg font-bold text-gray-900">
              {t("chooseService")}
            </h2>

            <label
              htmlFor="service"
              className="mt-5 block text-sm font-semibold text-gray-700"
            >
              {t("services")}
            </label>

            <select
              id="service"
              required
              value={serviceId}
              onChange={(event) => {
                setServiceId(event.target.value);
                setSelectedSlot("");
              }}
              className={inputClass}
            >
              <option value="">
                {t("selectService")}
              </option>

              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {serviceName(service)} — Rs.{" "}
                  {service.price.toLocaleString("en-PK")} (
                  {service.duration} {t("minutes")})
                </option>
              ))}
            </select>

            {selectedService && (
              <div
                className="mt-3 rounded-xl p-4"
                style={{
                  backgroundColor: `${primaryColor}12`,
                }}
              >
                <p className="font-semibold text-gray-900">
                  {serviceName(selectedService)}
                </p>

                <p className="mt-1 text-sm leading-7 text-gray-600">
                  {serviceDescription(selectedService)}
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {selectedService.duration} {t("minutes")} · Rs.{" "}
                  {selectedService.price.toLocaleString("en-PK")}
                </p>
              </div>
            )}
          </section>

          <div className="border-t border-gray-100" />

          {/* Staff selection */}
          <section>
            <h2 className="text-lg font-bold text-gray-900">
              {t("chooseProfessional")}
            </h2>

            <label
              htmlFor="staff"
              className="mt-5 block text-sm font-semibold text-gray-700"
            >
              {t("staff")}
            </label>

            <select
              id="staff"
              required
              value={staffId}
              onChange={(event) => {
                setStaffId(event.target.value);
                setSelectedSlot("");
              }}
              className={inputClass}
            >
              <option value="">
                {t("selectProfessional")}
              </option>

              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                  {member.role
                    ? ` — ${staffRole(member.role)}`
                    : ""}
                </option>
              ))}
            </select>
          </section>

          <div className="border-t border-gray-100" />

          {/* Date and time selection */}
          <section>
            <h2 className="text-lg font-bold text-gray-900">
              {t("dateTime")}
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="appointmentDate"
                  className="text-sm font-semibold text-gray-700"
                >
                  {t("date")}
                </label>

                <input
                  id="appointmentDate"
                  type="date"
                  required
                  min={getToday()}
                  value={appointmentDate}
                  onChange={(event) => {
                    setAppointmentDate(event.target.value);
                    setSelectedSlot("");
                  }}
                  dir="ltr"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="appointmentTime"
                  className="text-sm font-semibold text-gray-700"
                >
                  {t("time")}
                </label>

                <select
                  id="appointmentTime"
                  required
                  value={selectedSlot}
                  onChange={(event) =>
                    setSelectedSlot(event.target.value)
                  }
                  disabled={
                    !appointmentDate ||
                    !serviceId ||
                    !staffId ||
                    loadingSlots ||
                    slots.length === 0
                  }
                  className={inputClass}
                >
                  <option value="">
                    {loadingSlots
                      ? t("checking")
                      : !serviceId || !staffId || !appointmentDate
                        ? t("selectFirst")
                        : slots.length === 0
                          ? t("noTimes")
                          : t("chooseTime")}
                  </option>

                  {slots.map((slot) => (
                    <option
                      key={slot.start_at}
                      value={slot.start_at}
                    >
                      {formatSlot(slot.start_at)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loadingSlots && (
              <p className="mt-3 text-sm text-gray-500">
                {t("checking")}
              </p>
            )}

            {!loadingSlots &&
              appointmentDate &&
              serviceId &&
              staffId &&
              slots.length === 0 && (
                <p className="mt-3 text-sm text-amber-700">
                  {t("noAppointments")}
                </p>
              )}

            {slots.length > 0 && (
              <p className="mt-3 text-sm text-green-700">
                {isUrdu
                  ? `${slots.length} دستیاب اوقات مل گئے۔`
                  : `${slots.length} ${t("slotsFound")}`}
              </p>
            )}
          </section>

          {/* Error message */}
          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {/* Booking total and submission */}
          <div className="border-t border-gray-100 pt-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                {t("total")}
              </span>

              <span
                dir="ltr"
                className="text-xl font-bold text-gray-900"
              >
                {selectedService
                  ? `Rs. ${selectedService.price.toLocaleString("en-PK")}`
                  : t("selectService")}
              </span>
            </div>

            <button
              type="submit"
              disabled={
                submitting || !selectedSlot || !selectedService
              }
              className="w-full rounded-full px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {submitting ? t("submit") : t("confirm")}
            </button>

            <p className="mt-4 text-center text-xs leading-7 text-gray-500">
              {t("pending")}
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
