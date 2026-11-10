
"use client";

import { useEffect, useState, type FormEvent } from "react";
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

export default function BookingForm({
  businessId,
  businessName,
  services,
  staff,
  primaryColor,
  backgroundColor,
  textColor,
}: BookingFormProps) {
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

  // Load available appointment times whenever the selection changes.
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
          "Unable to load available times. Please try again."
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
    return new Intl.DateTimeFormat("en-PK", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Karachi",
    }).format(new Date(dateString));
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
      setErrorMessage("Please select a service and appointment time.");
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
        throw new Error("The booking could not be confirmed.");
      }

      setBookingId(data as string);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

  if (bookingId) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-4 py-12"
        style={{ backgroundColor }}
      >
        <section className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white"
            style={{ backgroundColor: primaryColor }}
          >
            ✓
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-green-700">
            Booking request received
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Thank you, {customerName}!
          </h1>

          <p className="mt-3 text-gray-600">
            Your appointment request has been submitted to {businessName}.
            Your booking is pending confirmation.
          </p>

          <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-left">
            <div className="flex justify-between gap-4 border-b border-gray-200 pb-4">
              <span className="text-sm text-gray-500">Booking reference</span>
              <span className="break-all text-right text-sm font-semibold text-gray-900">
                {bookingId}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 py-4">
              <span className="text-sm text-gray-500">Service</span>
              <span className="text-right text-sm font-semibold text-gray-900">
                {selectedService?.name}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 py-4">
              <span className="text-sm text-gray-500">Professional</span>
              <span className="text-right text-sm font-semibold text-gray-900">
                {staff.find((member) => member.id === staffId)?.name}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-gray-200 py-4">
              <span className="text-sm text-gray-500">Appointment</span>
              <span className="text-right text-sm font-semibold text-gray-900">
                {new Intl.DateTimeFormat("en-PK", {
                  dateStyle: "medium",
                  timeZone: "Asia/Karachi",
                }).format(new Date(selectedSlot))}
                {" · "}
                {formatSlot(selectedSlot)}
              </span>
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="text-right text-sm font-bold text-gray-900">
                Rs. {selectedService?.price.toLocaleString("en-PK")}
              </span>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            Please keep your booking reference for future communication.
          </p>

          <a
            href={`/${businessId}`}
            className="mt-8 inline-flex rounded-full px-7 py-3 font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Back to {businessName}
          </a>
        </section>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-12 sm:px-6"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="mx-auto max-w-3xl">
        <a
          href={`/${businessId}`}
          className="text-sm font-medium transition hover:opacity-60"
        >
          ← Back to {businessName}
        </a>

        <div className="mb-8 mt-8">
          <p
            className="text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: primaryColor }}
          >
            Appointment reservation
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Book Your Appointment
          </h1>

          <p className="mt-3 text-sm leading-6 opacity-70">
            Choose your preferred service, professional, date and time at{" "}
            {businessName}.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl bg-white p-5 shadow-xl sm:p-9"
        >
          <section>
            <h2 className="text-lg font-bold text-gray-900">
              01. Your details
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="customerName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Full name
                </label>
                <input
                  id="customerName"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="customerEmail"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="customerEmail"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="text-sm font-semibold text-gray-700"
                >
                  Phone number
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  required
                  minLength={7}
                  maxLength={25}
                  autoComplete="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="+92 300 1234567"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-900">
              02. Choose your service
            </h2>

            <label
              htmlFor="service"
              className="mt-5 block text-sm font-semibold text-gray-700"
            >
              Available services
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
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — Rs.{" "}
                  {service.price.toLocaleString("en-PK")} (
                  {service.duration} min)
                </option>
              ))}
            </select>

            {selectedService && (
              <div className="mt-3 rounded-xl p-4" style={{ backgroundColor: `${primaryColor}12` }}>
                <p className="font-semibold text-gray-900">
                  {selectedService.name}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedService.description}
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {selectedService.duration} minutes · Rs.{" "}
                  {selectedService.price.toLocaleString("en-PK")}
                </p>
              </div>
            )}
          </section>

          <div className="border-t border-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-900">
              03. Choose your professional
            </h2>

            <label
              htmlFor="staff"
              className="mt-5 block text-sm font-semibold text-gray-700"
            >
              Select staff member
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
              <option value="">Select a professional</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                  {member.role ? ` — ${member.role}` : ""}
                </option>
              ))}
            </select>
          </section>

          <div className="border-t border-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-900">
              04. Date and time
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="appointmentDate"
                  className="text-sm font-semibold text-gray-700"
                >
                  Appointment date
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
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="appointmentTime"
                  className="text-sm font-semibold text-gray-700"
                >
                  Available time
                </label>

                <select
                  id="appointmentTime"
                  required
                  value={selectedSlot}
                  onChange={(event) => setSelectedSlot(event.target.value)}
                  disabled={!appointmentDate || !serviceId || !staffId || loadingSlots || slots.length === 0}
                  className={inputClass}
                >
                  <option value="">
                    {loadingSlots
                      ? "Checking available times..."
                      : !serviceId || !staffId || !appointmentDate
                        ? "Select service, staff and date first"
                        : slots.length === 0
                          ? "No available times"
                          : "Choose a time"}
                  </option>

                  {slots.map((slot) => (
                    <option key={slot.start_at} value={slot.start_at}>
                      {formatSlot(slot.start_at)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loadingSlots && (
              <p className="mt-3 text-sm text-gray-500">
                Checking available appointments...
              </p>
            )}

            {!loadingSlots &&
              appointmentDate &&
              serviceId &&
              staffId &&
              slots.length === 0 && (
                <p className="mt-3 text-sm text-amber-700">
                  No available appointments for this selection. Try another date or professional.
                </p>
              )}

            {slots.length > 0 && (
              <p className="mt-3 text-sm text-green-700">
                {slots.length} available time slots found.
              </p>
            )}
          </section>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">Appointment total</span>
              <span className="text-xl font-bold text-gray-900">
                {selectedService
                  ? `Rs. ${selectedService.price.toLocaleString("en-PK")}`
                  : "Select a service"}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedSlot || !selectedService}
              className="w-full rounded-full px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {submitting ? "Submitting your booking..." : "Confirm Appointment"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              Your appointment will be submitted as a pending booking.
              The business will confirm it with you.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
