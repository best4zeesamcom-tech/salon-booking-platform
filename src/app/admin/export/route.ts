
import { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { adminSupabase } from "@/lib/supabase/admin";

function escapeCSV(value: unknown): string {
  let text = String(value ?? "");

  // Prevent spreadsheet formula injection.
  if (/^[\s]*[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return new Response("Unauthorized", { status: 401 });
  }

  const businessId = request.nextUrl.searchParams.get("business");

  if (!businessId || !["gent", "glow"].includes(businessId)) {
    return new Response("Invalid business", { status: 400 });
  }

  const { data: bookings, error } = await adminSupabase
    .from("bookings")
    .select(
      "id, business_id, service_id, staff_id, customer_name, customer_phone, start_at, end_at, status, created_at"
    )
    .eq("business_id", businessId)
    .order("start_at", { ascending: true });

  if (error) {
    console.error("CSV export error:", error);
    return new Response("Could not export bookings", { status: 500 });
  }

  const headers = [
    "Booking ID",
    "Business",
    "Customer Name",
    "Customer Phone",
    "Service ID",
    "Staff ID",
    "Date",
    "Start Time",
    "End Time",
    "Status",
    "Created At",
  ];

  const rows = (bookings ?? []).map((booking) => {
    const start = new Date(booking.start_at);
    const end = new Date(booking.end_at);

    const date = start.toLocaleDateString("en-CA", {
      timeZone: "Asia/Karachi",
    });

    const startTime = start.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
    });

    const endTime = end.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
    });

    return [
      booking.id,
      booking.business_id,
      booking.customer_name,
      booking.customer_phone,
      booking.service_id,
      booking.staff_id,
      date,
      startTime,
      endTime,
      booking.status,
      booking.created_at ?? "",
    ].map(escapeCSV);
  });

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\r\n");

  return new Response("\uFEFF" + csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${businessId}-bookings.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
