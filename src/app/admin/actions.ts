
"use server";

import { revalidatePath } from "next/cache";
import { adminSupabase } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

import {
  verifyAdminPassword,
  createAdminSession,
  destroyAdminSession,
} from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || !password) {
    redirect("/admin/login?error=1");
  }

  const valid = await verifyAdminPassword(password);

  if (!valid) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession();

  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();

  redirect("/admin/login");
}

export async function updateBookingStatusAction(formData: FormData) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    throw new Error("Unauthorized");
  }

  const bookingId = formData.get("bookingId");
  const businessId = formData.get("businessId");
  const newStatus = formData.get("status");

  const allowedStatuses = [
    "pending",
    "confirmed",
    "cancelled",
    "completed",
    "no_show",
  ];

  if (
    typeof bookingId !== "string" ||
    typeof businessId !== "string" ||
    !["gent", "glow"].includes(businessId) ||
    typeof newStatus !== "string" ||
    !allowedStatuses.includes(newStatus)
  ) {
    throw new Error("Invalid booking update.");
  }

  const { data: booking, error: fetchError } = await adminSupabase
    .from("bookings")
    .select("id, status")
    .eq("id", bookingId)
    .eq("business_id", businessId)
    .maybeSingle();

  if (fetchError || !booking) {
    throw new Error("Booking not found.");
  }

  const allowedTransitions: Record<string, string[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled", "no_show"],
    cancelled: [],
    completed: [],
    no_show: [],
  };

  if (!allowedTransitions[booking.status]?.includes(newStatus)) {
    throw new Error("This status change is not allowed.");
  }

  const { error: updateError } = await adminSupabase
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", bookingId)
    .eq("business_id", businessId);

  if (updateError) {
    throw new Error("Unable to update booking status.");
  }

  revalidatePath("/admin");
}
export async function createBlockedTimeAction(formData: FormData) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    throw new Error("Unauthorized");
  }

  const businessId = formData.get("businessId");
  const staffId = formData.get("staffId");
  const date = formData.get("date");
  const startTime = formData.get("startTime");
  const endTime = formData.get("endTime");
  const reason = formData.get("reason");

  if (
    typeof businessId !== "string" ||
    !["gent", "glow"].includes(businessId) ||
    typeof staffId !== "string" ||
    typeof date !== "string" ||
    typeof startTime !== "string" ||
    typeof endTime !== "string" ||
    typeof reason !== "string"
  ) {
    throw new Error("Invalid block-time details.");
  }

  // Interpret the selected date and times as Pakistan time (UTC+5).
  const startDate = new Date(`${date}T${startTime}:00+05:00`);
  const endDate = new Date(`${date}T${endTime}:00+05:00`);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate <= startDate
  ) {
    throw new Error("End time must be later than start time.");
  }

  if (startDate <= new Date()) {
    throw new Error("You can only block a future time.");
  }

  // Confirm that this staff member belongs to the selected business.
  const { data: staffMember, error: staffError } = await adminSupabase
    .from("staff")
    .select("id")
    .eq("id", staffId)
    .eq("business_id", businessId)
    .maybeSingle();

  if (staffError || !staffMember) {
    throw new Error("Selected staff member was not found.");
  }

  // Do not block a time that already has an active booking.
  const { data: conflictingBookings, error: bookingError } =
    await adminSupabase
      .from("bookings")
      .select("id")
      .eq("business_id", businessId)
      .eq("staff_id", staffId)
      .in("status", ["pending", "confirmed"])
      .lt("start_at", endDate.toISOString())
      .gt("end_at", startDate.toISOString())
      .limit(1);

  if (bookingError) {
    throw new Error("Could not check existing bookings.");
  }

  if (conflictingBookings && conflictingBookings.length > 0) {
    throw new Error(
      "This time already has a pending or confirmed booking."
    );
  }

  // Prevent overlapping blocked periods for the same staff member.
  const { data: conflictingBlocks, error: blockError } =
    await adminSupabase
      .from("blocked_times")
      .select("id")
      .eq("business_id", businessId)
      .eq("staff_id", staffId)
      .lt("start_at", endDate.toISOString())
      .gt("end_at", startDate.toISOString())
      .limit(1);

  if (blockError) {
    throw new Error("Could not check existing blocked times.");
  }

  if (conflictingBlocks && conflictingBlocks.length > 0) {
    throw new Error("This staff member already has a block during that time.");
  }

  const { error: insertError } = await adminSupabase
    .from("blocked_times")
    .insert({
      business_id: businessId,
      staff_id: staffId,
      start_at: startDate.toISOString(),
      end_at: endDate.toISOString(),
      reason: reason.trim() || null,
    });

  if (insertError) {
    throw new Error("Unable to save the blocked time.");
  }

  revalidatePath("/admin");
  revalidatePath(`/${businessId}`);
  revalidatePath(`/${businessId}/book`);
}
export async function deleteBlockedTimeAction(formData: FormData) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    throw new Error("Unauthorized");
  }

  const blockId = formData.get("blockId");
  const businessId = formData.get("businessId");

  if (
    typeof blockId !== "string" ||
    typeof businessId !== "string" ||
    !["gent", "glow"].includes(businessId)
  ) {
    throw new Error("Invalid blocked-time details.");
  }

  const { error } = await adminSupabase
    .from("blocked_times")
    .delete()
    .eq("id", blockId)
    .eq("business_id", businessId);

  if (error) {
    throw new Error("Unable to remove blocked time.");
  }

  revalidatePath("/admin");
  revalidatePath(`/${businessId}`);
  revalidatePath(`/${businessId}/book`);
}