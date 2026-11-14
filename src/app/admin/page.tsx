
import Link from "next/link";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { adminSupabase } from "@/lib/supabase/admin";
import AdminLanguageToggle from "@/components/admin/AdminLanguageToggle";

import {
  updateBookingStatusAction,
  logoutAction,
  createBlockedTimeAction,
  deleteBlockedTimeAction,
} from "./actions";

type Props = {
  searchParams: Promise<{
    business?: string;
    view?: string;
  }>;
};

function normalizeWhatsAppNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = `92${digits.slice(1)}`;
  } else if (!digits.startsWith("92")) {
    digits = `92${digits}`;
  }

  return digits;
}

async function AdminDashboardContent({ searchParams }: Props) {
  await connection();

  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const cookieStore = await cookies();
  const isUrdu = cookieStore.get("site-language")?.value === "ur";

  const t = (english: string, urdu: string) =>
    isUrdu ? urdu : english;

  const { data: businesses, error: businessesError } =
    await adminSupabase
      .from("businesses")
      .select("id, name, slug")
      .order("name");

  if (businessesError) {
    throw new Error("Unable to load businesses.");
  }

  if (!businesses || businesses.length === 0) {
    return (
      <main className="p-8" dir={isUrdu ? "rtl" : "ltr"}>
        {t("No businesses found.", "کوئی کاروبار نہیں ملا۔")}
      </main>
    );
  }

  const selectedBusiness =
    businesses.find((business) => business.id === params.business) ??
    businesses[0];

  const [
    bookingsResult,
    servicesResult,
    staffResult,
    blockedTimesResult,
  ] = await Promise.all([
    adminSupabase
      .from("bookings")
      .select("*")
      .eq("business_id", selectedBusiness.id)
      .order("start_at", { ascending: true }),

    adminSupabase
      .from("services")
      .select("id, name, duration, price")
      .eq("business_id", selectedBusiness.id),

    adminSupabase
      .from("staff")
      .select("id, name")
      .eq("business_id", selectedBusiness.id),

    adminSupabase
      .from("blocked_times")
      .select("id, staff_id, start_at, end_at, reason")
      .eq("business_id", selectedBusiness.id)
      .order("start_at", { ascending: true }),
  ]);

  if (bookingsResult.error) {
    throw new Error("Unable to load bookings.");
  }

  if (servicesResult.error || staffResult.error) {
    throw new Error("Unable to load booking details.");
  }

  if (blockedTimesResult.error) {
    throw new Error("Unable to load blocked times.");
  }

  const bookings = bookingsResult.data ?? [];
  const services = servicesResult.data ?? [];
  const staff = staffResult.data ?? [];
  const blockedTimes = blockedTimesResult.data ?? [];

  const getDateKey = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

  const todayKey = getDateKey(new Date());

  const getBookingDateKey = (date: string) =>
    getDateKey(new Date(date));

  const selectedView = ["all", "today", "upcoming"].includes(
    params.view ?? ""
  )
    ? params.view!
    : "all";

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = getBookingDateKey(booking.start_at);

    if (selectedView === "today") {
      return bookingDate === todayKey;
    }

    if (selectedView === "upcoming") {
      return bookingDate > todayKey;
    }

    return true;
  });

  const serviceMap = new Map(
    services.map((service) => [service.id, service])
  );

  const staffMap = new Map(
    staff.map((member) => [member.id, member])
  );

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(isUrdu ? "ur-PK" : "en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    }).format(new Date(value));

  const formatTime = (value: string) =>
    new Intl.DateTimeFormat(isUrdu ? "ur-PK" : "en-PK", {
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    }).format(new Date(value));

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t("Pending", "زیرِ التوا"),
      confirmed: t("Confirmed", "تصدیق شدہ"),
      cancelled: t("Cancelled", "منسوخ"),
      completed: t("Completed", "مکمل"),
      no_show: t("No-show", "غیر حاضر"),
    };

    return labels[status] ?? status.replace("_", " ");
  };

  return (
    <main
      lang={isUrdu ? "ur" : "en"}
      dir={isUrdu ? "rtl" : "ltr"}
      className={`min-h-screen bg-stone-100 p-4 md:p-8 ${
        isUrdu ? "urdu-page" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">
              {t("Owner Dashboard", "اونر ڈیش بورڈ")}
            </h1>

            <p className="mt-1 text-stone-500">
              {t(
                "Manage GENT and GLOW bookings",
                "GENT اور GLOW کی بکنگز کا انتظام کریں"
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AdminLanguageToggle />

            <Link
              href={`/admin/export?business=${encodeURIComponent(selectedBusiness.id)}`}
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              {t("Export CSV", "CSV ایکسپورٹ کریں")}
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                {t("Logout", "لاگ آؤٹ")}
              </button>
            </form>
          </div>
        </header>

        {/* Business Selector and Filters */}
        <section className="mt-8 rounded-xl bg-white p-5 shadow-sm">
          <label
            htmlFor="business"
            className="mb-2 block text-sm font-semibold text-stone-700"
          >
            {t("Select Business", "کاروبار منتخب کریں")}
          </label>

          <form method="GET" action="/admin">
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                id="business"
                name="business"
                defaultValue={selectedBusiness.id}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 sm:max-w-sm"
              >
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="rounded-lg bg-stone-900 px-6 py-3 text-white"
              >
                {t("View Bookings", "بکنگز دیکھیں")}
              </button>
            </div>
          </form>

          <p className="mt-3 text-sm text-stone-500">
            {t("Currently viewing:", "اس وقت منتخب کاروبار:")}{" "}
            {selectedBusiness.name}
          </p>

          <form method="GET" action="/admin" className="mt-5">
            <input
              type="hidden"
              name="business"
              value={selectedBusiness.id}
            />

            <label
              htmlFor="view"
              className="mb-2 block text-sm font-semibold text-stone-700"
            >
              {t("Filter Bookings", "بکنگز فلٹر کریں")}
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                id="view"
                name="view"
                defaultValue={selectedView}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 sm:max-w-sm"
              >
                <option value="all">
                  {t("All Bookings", "تمام بکنگز")}
                </option>
                <option value="today">
                  {t("Today's Bookings", "آج کی بکنگز")}
                </option>
                <option value="upcoming">
                  {t("Upcoming Bookings", "آنے والی بکنگز")}
                </option>
              </select>

              <button
                type="submit"
                className="rounded-lg bg-stone-900 px-6 py-3 text-white"
              >
                {t("Apply Filter", "فلٹر لگائیں")}
              </button>
            </div>
          </form>
        </section>

        {/* Booking Statistics */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t("Total Bookings", "کل بکنگز")}
            value={bookings.length}
          />
          <StatCard
            title={t("Pending", "زیرِ التوا")}
            value={pendingCount}
          />
          <StatCard
            title={t("Confirmed", "تصدیق شدہ")}
            value={confirmedCount}
          />
          <StatCard
            title={t("Completed", "مکمل")}
            value={completedCount}
          />
        </section>

        {/* Block Staff Availability */}
        <section className="mt-8 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-stone-900">
            {t("Block Staff Availability", "اسٹاف کی دستیابی بند کریں")}
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            {t(
              "Prevent customers from booking a staff member during a selected period.",
              "منتخب وقت کے دوران صارفین کو اسٹاف ممبر کی بکنگ سے روکیں۔"
            )}
          </p>

          <form
            action={createBlockedTimeAction}
            className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <input
              type="hidden"
              name="businessId"
              value={selectedBusiness.id}
            />

            <div>
              <label
                htmlFor="block-staff"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                {t("Staff Member", "اسٹاف ممبر")}
              </label>

              <select
                id="block-staff"
                name="staffId"
                required
                defaultValue=""
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-3"
              >
                <option value="" disabled>
                  {t("Select staff", "اسٹاف منتخب کریں")}
                </option>

                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="block-date"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                {t("Date", "تاریخ")}
              </label>

              <input
                id="block-date"
                type="date"
                name="date"
                required
                min={todayKey}
                className="w-full rounded-lg border border-stone-300 px-3 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="block-start"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                {t("Start Time", "شروع ہونے کا وقت")}
              </label>

              <input
                id="block-start"
                type="time"
                name="startTime"
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="block-end"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                {t("End Time", "ختم ہونے کا وقت")}
              </label>

              <input
                id="block-end"
                type="time"
                name="endTime"
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="block-reason"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                {t("Reason (Optional)", "وجہ (اختیاری)")}
              </label>

              <input
                id="block-reason"
                type="text"
                name="reason"
                maxLength={150}
                placeholder={t("e.g. Lunch break", "مثلاً کھانے کا وقفہ")}
                className="w-full rounded-lg border border-stone-300 px-3 py-3"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-stone-900 px-5 py-3 font-semibold text-white hover:bg-stone-700"
              >
                {t("Block This Time", "یہ وقت بلاک کریں")}
              </button>
            </div>
          </form>

          {/* Existing Blocked Times */}
          <div className="mt-8 border-t border-stone-200 pt-6">
            <h3 className="text-lg font-semibold text-stone-900">
              {t("Existing Blocked Times", "پہلے سے بلاک شدہ اوقات")}
            </h3>

            {blockedTimes.length === 0 ? (
              <p className="mt-3 text-sm text-stone-500">
                {t(
                  `No blocked times for ${selectedBusiness.name}.`,
                  `${selectedBusiness.name} کے لیے کوئی وقت بلاک نہیں ہے۔`
                )}
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {blockedTimes.map((block) => (
                  <div
                    key={block.id}
                    className="flex flex-col gap-3 rounded-lg border border-stone-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-stone-900">
                        {staffMap.get(block.staff_id)?.name ??
                          t("Unknown staff", "نامعلوم اسٹاف")}
                      </p>

                      <p className="mt-1 text-sm text-stone-600">
                        {formatDate(block.start_at)} –{" "}
                        {formatTime(block.end_at)}
                      </p>

                      {block.reason && (
                        <p className="mt-1 text-sm text-stone-500">
                          {t("Reason:", "وجہ:")} {block.reason}
                        </p>
                      )}
                    </div>

                    <form action={deleteBlockedTimeAction}>
                      <input
                        type="hidden"
                        name="blockId"
                        value={block.id}
                      />

                      <input
                        type="hidden"
                        name="businessId"
                        value={selectedBusiness.id}
                      />

                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        {t("Remove Block", "بلاک ختم کریں")}
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Booking Management */}
        <section className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-stone-200 p-5">
            <h2 className="text-xl font-bold text-stone-900">
              {t("Booking Management", "بکنگز کا انتظام")}
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {t(
                "Real booking records from Supabase",
                "Supabase سے حاصل کردہ اصل بکنگ ریکارڈز"
              )}
            </p>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-stone-800">
                {t("No bookings found", "کوئی بکنگ نہیں ملی")}
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                {t(
                  `No appointments match this filter for ${selectedBusiness.name}.`,
                  `${selectedBusiness.name} کے لیے اس فلٹر سے کوئی اپائنٹمنٹ نہیں ملی۔`
                )}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-stone-50 text-stone-600">
                  <tr>
                    <th className="p-4">{t("Customer", "صارف")}</th>
                    <th className="p-4">{t("Service", "سروس")}</th>
                    <th className="p-4">{t("Staff", "اسٹاف")}</th>
                    <th className="p-4">{t("Date & Time", "تاریخ اور وقت")}</th>
                    <th className="p-4">{t("Phone", "فون")}</th>
                    <th className="p-4">{t("Status", "اسٹیٹس")}</th>
                    <th className="p-4">{t("Actions", "کارروائیاں")}</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-t border-stone-100"
                    >
                      <td className="p-4 font-medium text-stone-900">
                        {booking.customer_name}
                      </td>

                      <td className="p-4">
                        {serviceMap.get(booking.service_id)?.name ??
                          t("Unknown", "نامعلوم")}
                      </td>

                      <td className="p-4">
                        {staffMap.get(booking.staff_id)?.name ??
                          t("Unknown", "نامعلوم")}
                      </td>

                      <td className="p-4">
                        {formatDate(booking.start_at)}
                      </td>

                      <td className="p-4" dir="ltr">
                        {booking.customer_phone}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <span className="w-fit rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                            {statusLabel(booking.status)}
                          </span>

                          {(booking.status === "pending" ||
                            booking.status === "confirmed") && (
                            <form
                              action={updateBookingStatusAction}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="hidden"
                                name="bookingId"
                                value={booking.id}
                              />

                              <input
                                type="hidden"
                                name="businessId"
                                value={selectedBusiness.id}
                              />

                              <select
                                name="status"
                                defaultValue=""
                                required
                                className="rounded-lg border border-stone-300 bg-white px-2 py-2 text-xs"
                              >
                                <option value="" disabled>
                                  {t("Change status", "اسٹیٹس تبدیل کریں")}
                                </option>

                                {booking.status === "pending" ? (
                                  <>
                                    <option value="confirmed">
                                      {t("Confirm", "تصدیق کریں")}
                                    </option>
                                    <option value="cancelled">
                                      {t("Cancel", "منسوخ کریں")}
                                    </option>
                                  </>
                                ) : (
                                  <>
                                    <option value="completed">
                                      {t("Complete", "مکمل کریں")}
                                    </option>
                                    <option value="cancelled">
                                      {t("Cancel", "منسوخ کریں")}
                                    </option>
                                    <option value="no_show">
                                      {t("No-show", "غیر حاضر")}
                                    </option>
                                  </>
                                )}
                              </select>

                              <button
                                type="submit"
                                className="rounded-lg bg-stone-900 px-3 py-2 text-xs text-white"
                              >
                                {t("Update", "اپ ڈیٹ")}
                              </button>
                            </form>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex min-w-[190px] flex-col gap-2">
                          {booking.customer_phone && (
                            <a
                              href={`https://wa.me/${normalizeWhatsAppNumber(
                                booking.customer_phone
                              )}?text=${encodeURIComponent(
                                [
                                  isUrdu
                                    ? `السلام علیکم ${booking.customer_name}،`
                                    : `Hello ${booking.customer_name},`,
                                  "",
                                  isUrdu
                                    ? booking.status === "confirmed"
                                      ? `${selectedBusiness.name} میں آپ کی اپائنٹمنٹ کی تصدیق ہو گئی ہے۔`
                                      : `${selectedBusiness.name} میں آپ کی اپائنٹمنٹ کی درخواست موصول ہو گئی ہے۔`
                                    : booking.status === "confirmed"
                                      ? `Your appointment at ${selectedBusiness.name} is confirmed.`
                                      : `Your appointment request at ${selectedBusiness.name} has been received.`,
                                  "",
                                  `${t("Booking reference", "بکنگ ریفرنس")}: ${booking.id}`,
                                  `${t("Service", "سروس")}: ${serviceMap.get(booking.service_id)?.name ?? "Appointment"}`,
                                  `${t("Professional", "پروفیشنل")}: ${staffMap.get(booking.staff_id)?.name ?? "Our team"}`,
                                  `${t("Appointment", "اپائنٹمنٹ")}: ${formatDate(booking.start_at)}`,
                                  `${t("Amount", "رقم")}: Rs. ${(serviceMap.get(booking.service_id)?.price ?? 0).toLocaleString("en-PK")}`,
                                  `${t("Status", "اسٹیٹس")}: ${statusLabel(booking.status)}`,
                                  "",
                                  isUrdu ? "شکریہ!" : "Thank you!",
                                ].join("\n")
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-green-700"
                            >
                              {t(
                                "Send WhatsApp Confirmation",
                                "واٹس ایپ تصدیق بھیجیں"
                              )}
                            </a>
                          )}

                          <a
                            href={`/admin/calendar?business=${encodeURIComponent(
                              selectedBusiness.id
                            )}&booking=${encodeURIComponent(booking.id)}`}
                            className="inline-flex items-center justify-center rounded-lg border border-stone-300 px-3 py-2 text-center text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
                          >
                            {t(
                              "Download Calendar Event",
                              "کیلنڈر ایونٹ ڈاؤن لوڈ کریں"
                            )}
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-stone-900">{value}</p>
    </div>
  );
}

export default function AdminPage(props: Props) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-stone-100">
          Loading dashboard...
        </main>
      }
    >
      <AdminDashboardContent {...props} />
    </Suspense>
  );
}
