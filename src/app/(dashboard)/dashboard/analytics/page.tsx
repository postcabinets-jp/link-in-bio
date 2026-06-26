import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "./analytics-dashboard";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get all links for this user
  const { data: links } = await supabase
    .from("links")
    .select("id, title")
    .eq("user_id", user.id);

  if (!links || links.length === 0) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">アナリティクス</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">リンクを追加するとクリック数が表示されます</p>
        </div>
      </div>
    );
  }

  const linkIds = links.map((l) => l.id);

  // Get click events for the last 30 days
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data: clicks } = await supabase
    .from("click_events")
    .select("link_id, clicked_at, country, referrer")
    .in("link_id", linkIds)
    .gte("clicked_at", since.toISOString())
    .order("clicked_at", { ascending: true });

  // Process data for charts
  const clicksByLink: Record<string, { title: string; count: number }> = {};
  for (const link of links) {
    clicksByLink[link.id] = { title: link.title, count: 0 };
  }

  const clicksByDay: Record<string, number> = {};
  const referrers: Record<string, number> = {};

  for (const click of clicks ?? []) {
    // By link
    if (clicksByLink[click.link_id]) {
      clicksByLink[click.link_id].count++;
    }

    // By day
    const day = click.clicked_at.split("T")[0];
    clicksByDay[day] = (clicksByDay[day] ?? 0) + 1;

    // By referrer
    const ref = click.referrer ? new URL(click.referrer).hostname : "direct";
    referrers[ref] = (referrers[ref] ?? 0) + 1;
  }

  // Fill missing days in the last 30 days
  const dailyData: { date: string; clicks: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyData.push({ date: key, clicks: clicksByDay[key] ?? 0 });
  }

  const totalClicks = (clicks ?? []).length;

  const linkData = Object.values(clicksByLink)
    .sort((a, b) => b.count - a.count)
    .map((l) => ({ ...l, percentage: totalClicks > 0 ? Math.round((l.count / totalClicks) * 100) : 0 }));

  const referrerData = Object.entries(referrers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">アナリティクス</h1>
      <AnalyticsDashboard
        totalClicks={totalClicks}
        dailyData={dailyData}
        linkData={linkData}
        referrerData={referrerData}
      />
    </div>
  );
}
