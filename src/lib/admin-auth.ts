
import "server-only";

import {
  createHmac,
  timingSafeEqual,
  createHash,
} from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "salon_admin_session";
const SESSION_DURATION = 8 * 60 * 60;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET is missing or too short.");
  }

  return secret;
}

function createSignature(expiresAt: string) {
  return createHmac("sha256", getSecret())
    .update(expiresAt)
    .digest("hex");
}

export async function verifyAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is missing.");
  }

  const submittedHash = createHash("sha256")
    .update(password)
    .digest();

  const actualHash = createHash("sha256")
    .update(adminPassword)
    .digest();

  return timingSafeEqual(submittedHash, actualHash);
}

export async function createAdminSession() {
  const expiresAt = String(
    Math.floor(Date.now() / 1000) + SESSION_DURATION
  );

  const signature = createSignature(expiresAt);

  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_NAME,
    `${expiresAt}.${signature}`,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
      maxAge: SESSION_DURATION,
    }
  );
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;

  if (!session) return false;

  const [expiresAt, signature] = session.split(".");

  if (!expiresAt || !signature || !/^\d+$/.test(expiresAt)) {
    return false;
  }

  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSignature = createSignature(expiresAt);

  const received = Buffer.from(signature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (received.length !== expected.length) return false;

  return timingSafeEqual(received, expected);
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
