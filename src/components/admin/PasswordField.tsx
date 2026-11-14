
"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);
  const { isUrdu } = useLanguage();

  return (
    <div>
      <label
        htmlFor="password"
        className="mb-2 block text-sm font-medium text-stone-700"
      >
        {isUrdu ? "ایڈمن پاس ورڈ" : "Admin Password"}
      </label>

      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          autoComplete="current-password"
          placeholder={
            isUrdu
              ? "اپنا ایڈمن پاس ورڈ درج کریں"
              : "Enter your admin password"
          }
          dir="ltr"
          className="w-full rounded-lg border border-stone-300 px-4 py-3 pr-20 outline-none focus:border-stone-700"
        />

        <button
          type="button"
          onClick={() => setShowPassword((previous) => !previous)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-600 hover:text-stone-900"
          aria-label={
            showPassword
              ? isUrdu
                ? "پاس ورڈ چھپائیں"
                : "Hide password"
              : isUrdu
                ? "پاس ورڈ دکھائیں"
                : "Show password"
          }
        >
          {showPassword
            ? isUrdu
              ? "چھپائیں"
              : "Hide"
            : isUrdu
              ? "دکھائیں"
              : "Show"}
        </button>
      </div>
    </div>
  );
}
