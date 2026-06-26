import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppearanceEditor } from "./appearance-editor";

export default async function AppearancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: links }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("links").select("*").eq("user_id", user.id).order("sort_order"),
  ]);

  if (!profile) redirect("/login");

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">デザイン</h1>
        <p className="text-sm text-gray-500 mt-0.5">テーマ・カラー・ボタンスタイルをカスタマイズ</p>
      </div>
      <AppearanceEditor profile={profile} links={links ?? []} />
    </div>
  );
}
