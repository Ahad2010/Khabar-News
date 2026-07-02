import { redirect } from "next/navigation";
import { isAdmin, isAuthConfigured } from "@/lib/admin-auth";
import { loginAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="mx-auto mt-16 max-w-sm rounded border border-slate-300 bg-white p-6">
      <h1 className="text-xl font-bold">Admin login</h1>
      <p className="mt-1 text-sm text-slate-500">Enter the admin password to continue.</p>

      {error && (
        <p className="mt-3 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          Wrong password — try again.
        </p>
      )}

      {!isAuthConfigured() && (
        <p className="mt-3 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          No ADMIN_PASSWORD is set, so the panel is currently open. Set it in{" "}
          <code>.env.local</code> to enable login.
        </p>
      )}

      <form action={loginAction} className="mt-4 flex flex-col gap-3">
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="Password"
          className="rounded border border-slate-300 px-3 py-2"
        />
        <button className="rounded bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-700">
          Log in
        </button>
      </form>
    </div>
  );
}
