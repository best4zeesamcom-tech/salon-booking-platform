
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { adminSupabase } from "@/lib/supabase/admin";

function escapeICSText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\n|\r/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatICSDate(value: string) {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export async function GET(request: Request) {
  // Only authenticated admins can download booking details.
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("business");
  const bookingId = searchParams.get("booking");

  if (!businessId || !bookingId) {
    return new NextResponse("Missing booking information.", {
      status: 400,
    });
  }

  // Fetch the booking only for the requested business.
  const { data: booking, error: bookingError } = await adminSupabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("business_id", businessId)
    .maybeSingle();

  if (bookingError || !booking) {
    return new NextResponse("Booking not found.", { status: 404 });
  }

  const [businessResult, serviceResult, staffResult] = await Promise.all([
    adminSupabase
      .from("businesses")
      .select("name")
      .eq("id", businessId)
      .maybeSingle(),

    adminSupabase
      .from("services")
      .select("name, price")
      .eq("id", booking.service_id)
      .eq("business_id", businessId)
      .maybeSingle(),

    adminSupabase
      .from("staff")
      .select("name")
      .eq("id", booking.staff_id)
      .eq("business_id", businessId)
      .maybeSingle(),
  ]);

  if (
    businessResult.error ||
    serviceResult.error ||
    staffResult.error ||
    !businessResult.data ||
    !serviceResult.data
  ) {
    return new NextResponse("Unable to load booking details.", {
      status: 500,
    });
  }

  const businessName = businessResult.data.name;
  const serviceName = serviceResult.data.name;
  const staffName = staffResult.data?.name ?? "Not assigned";

  const description = [
    `Booking reference: ${booking.id}`,
    `Customer: ${booking.customer_name}`,
    `Phone: ${booking.customer_phone ?? "Not provided"}`,
    `Business: ${businessName}`,
    `Service: ${serviceName}`,
    `Professional: ${staffName}`,
    `Amount: Rs. ${Number(serviceResult.data.price).toLocaleString("en-PK")}`,
    `Status: ${booking.status}`,
  ].join("\n");

  const calendarStatus =
    booking.status === "confirmed"
      ? "CONFIRMED"
      : booking.status === "cancelled"
        ? "CANCELLED"
        : "TENTATIVE";

  const calendarContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Clientora//Salon Booking Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.id}@salon-booking-platform`,
    `DTSTAMP:${formatICSDate(new Date().toISOString())}`,
    `DTSTART:${formatICSDate(booking.start_at)}`,
    `DTEND:${formatICSDate(booking.end_at)}`,
    `SUMMARY:${escapeICSText(`${serviceName} - ${businessName}`)}`,
    `DESCRIPTION:${escapeICSText(description)}`,
    `LOCATION:${escapeICSText(businessName)}`,
    `STATUS:${calendarStatus}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const filename = `appointment-${booking.id.slice(0, 8)}.ics`;

  return new NextResponse(calendarContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
