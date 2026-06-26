import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: socialLinks }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("social_links").select("*").eq("user_id", user.id).order("sort_order"),
  ]);

  if (!profile) redirect("/login");

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">設定</h1>
      <SettingsForm
        profile={profile}
        socialLinks={socialLinks ?? []}
        email={user.email ?? ""}
      />
    </div>
  );
}
