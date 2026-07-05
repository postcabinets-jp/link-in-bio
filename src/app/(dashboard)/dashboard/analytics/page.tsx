import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAnalytics } from "@/app/actions/analytics";
import { AnalyticsDashboard } from "./analytics-dashboard";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await getAnalytics(30);

  if (error || !data) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">アナリティクス</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">
            {error ?? "データの読み込みに失敗しました"}
          </p>
        </div>
      </div>
    );
  }

  if (data.linkData.length === 0) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">アナリティクス</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">
            リンクを追加するとクリック数が表示されます
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">アナリティクス</h1>
      <AnalyticsDashboard
        totalClicks={data.totalClicks}
        dailyData={data.dailyData}
        linkData={data.linkData}
        referrerData={data.referrerData}
      />
    </div>
  );
}
