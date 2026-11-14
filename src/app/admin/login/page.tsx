
import { connection } from "next/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

async function LoginContent({ searchParams }: Props) {
  await connection();

  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const params = await searchParams;

  return <AdminLoginForm error={params.error} />;
}

export default function AdminLoginPage(props: Props) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-stone-100">
          <p className="text-stone-600">Loading login...</p>
        </main>
      }
    >
      <LoginContent {...props} />
    </Suspense>
  );
}
