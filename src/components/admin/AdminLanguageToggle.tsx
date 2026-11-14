
"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export default function AdminLanguageToggle() {
  const router = useRouter();
  const { isUrdu, setLanguage } = useLanguage();

  function toggleLanguage() {
    setLanguage(isUrdu ? "en" : "ur");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
    >
      {isUrdu ? "English" : "اردو"}
    </button>
  );
}
