
"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { loginAction } from "@/app/admin/actions";
import PasswordField from "@/components/admin/PasswordField";

export default function AdminLoginForm({
  error,
}: {
  error?: string;
}) {
  const { isUrdu, setLanguage } = useLanguage();

  return (
    <main
      dir={isUrdu ? "rtl" : "ltr"}
      lang={isUrdu ? "ur" : "en"}
      className={`flex min-h-screen items-center justify-center bg-stone-100 px-4 ${
        isUrdu ? "urdu-page" : ""
      }`}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 flex justify-end">
          <button
            type="button"
            onClick={() => setLanguage(isUrdu ? "en" : "ur")}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
          >
            {isUrdu ? "English" : "اردو"}
          </button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-stone-900">
            {isUrdu ? "اونر لاگ اِن" : "Owner Login"}
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            {isUrdu
              ? "اپنے سیلون اور کلینک کی بکنگز کا انتظام کریں"
              : "Manage your salon and clinic bookings"}
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {isUrdu
              ? "غلط پاس ورڈ۔ براہ کرم دوبارہ کوشش کریں۔"
              : "Incorrect password. Please try again."}
          </p>
        )}

        <form action={loginAction} className="space-y-5">
          <PasswordField />

          <button
            type="submit"
            className="w-full rounded-lg bg-stone-900 py-3 font-semibold text-white transition hover:bg-stone-700"
          >
            {isUrdu ? "ڈیش بورڈ میں لاگ اِن کریں" : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
