"use server";

import { createClient } from "@/lib/supabase/server";
import { getAnalyticsSchema, trackClickSchema } from "@/lib/validations";

export type DailyClickData = { date: string; clicks: number };
export type LinkClickData = { title: string; count: number; percentage: number };
export type ReferrerData = { name: string; count: number };
export type AnalyticsResult = {
  totalClicks: number;
  dailyData: DailyClickData[];
  linkData: LinkClickData[];
  referrerData: ReferrerData[];
};

export async function getAnalytics(
  days: number = 30
): Promise<{ data: AnalyticsResult | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です", data: null };

  const parsed = getAnalyticsSchema.safeParse({ days });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, data: null };
  }

  const validDays = parsed.data.days;

  // Get all links for this user
  const { data: links } = await supabase
    .from("links")
    .select("id, title")
    .eq("user_id", user.id);

  if (!links || links.length === 0) {
    return {
      data: {
        totalClicks: 0,
        dailyData: generateEmptyDailyData(validDays),
        linkData: [],
        referrerData: [],
      },
      error: null,
    };
  }

  const linkIds = links.map((l) => l.id);

  const since = new Date();
  since.setDate(since.getDate() - validDays);

  const { data: clicks } = await supabase
    .from("click_events")
    .select("link_id, clicked_at, referrer")
    .in("link_id", linkIds)
    .gte("clicked_at", since.toISOString())
    .order("clicked_at", { ascending: true });

  // Process data
  const clicksByLink: Record<string, { title: string; count: number }> = {};
  for (const link of links) {
    clicksByLink[link.id] = { title: link.title, count: 0 };
  }

  const clicksByDay: Record<string, number> = {};
  const referrers: Record<string, number> = {};

  for (const click of clicks ?? []) {
    if (clicksByLink[click.link_id]) {
      clicksByLink[click.link_id].count++;
    }

    const day = click.clicked_at.split("T")[0];
    clicksByDay[day] = (clicksByDay[day] ?? 0) + 1;

    try {
      const ref = click.referrer
        ? new URL(click.referrer).hostname
        : "direct";
      referrers[ref] = (referrers[ref] ?? 0) + 1;
    } catch {
      referrers["direct"] = (referrers["direct"] ?? 0) + 1;
    }
  }

  // Fill missing days
  const dailyData: DailyClickData[] = [];
  for (let i = validDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyData.push({ date: key, clicks: clicksByDay[key] ?? 0 });
  }

  const totalClicks = (clicks ?? []).length;

  const linkData = Object.values(clicksByLink)
    .sort((a, b) => b.count - a.count)
    .map((l) => ({
      ...l,
      percentage:
        totalClicks > 0 ? Math.round((l.count / totalClicks) * 100) : 0,
    }));

  const referrerData = Object.entries(referrers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return { data: { totalClicks, dailyData, linkData, referrerData }, error: null };
}

export async function trackClick(linkId: string, referrer: string | null) {
  const parsed = trackClickSchema.safeParse({
    link_id: linkId,
    referrer,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  // Verify the link exists and is active
  const { data: link } = await supabase
    .from("links")
    .select("id")
    .eq("id", parsed.data.link_id)
    .eq("is_active", true)
    .single();

  if (!link) return { error: "リンクが見つかりません" };

  const { error } = await supabase.from("click_events").insert({
    link_id: parsed.data.link_id,
    referrer: parsed.data.referrer ?? null,
  });

  if (error) return { error: "クリックの記録に失敗しました" };
  return { success: true };
}

export async function getClicksByLink(linkId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です", data: null };

  // Verify ownership
  const { data: link } = await supabase
    .from("links")
    .select("id")
    .eq("id", linkId)
    .eq("user_id", user.id)
    .single();

  if (!link) return { error: "リンクが見つかりません", data: null };

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data: clicks, error } = await supabase
    .from("click_events")
    .select("clicked_at, referrer, country")
    .eq("link_id", linkId)
    .gte("clicked_at", since.toISOString())
    .order("clicked_at", { ascending: false });

  if (error) return { error: "データの取得に失敗しました", data: null };
  return { data: clicks };
}

function generateEmptyDailyData(days: number): DailyClickData[] {
  const data: DailyClickData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({ date: d.toISOString().split("T")[0], clicks: 0 });
  }
  return data;
}
