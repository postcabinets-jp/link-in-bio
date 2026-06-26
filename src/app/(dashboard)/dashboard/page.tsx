import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LinkList } from "@/components/dashboard/link-list";
import { ProfilePreview } from "@/components/dashboard/profile-preview";

export default async function DashboardPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">リンク管理</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          公開URL:{" "}
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:underline"
          >
            {process.env.NEXT_PUBLIC_APP_URL ?? ""}/{profile.username}
          </a>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <LinkList initialLinks={links ?? []} />
        </div>
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-8">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">プレビュー</p>
            <ProfilePreview profile={profile} links={links ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
