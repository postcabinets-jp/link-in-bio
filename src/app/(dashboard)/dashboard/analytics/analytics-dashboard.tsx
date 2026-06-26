"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  totalClicks: number;
  dailyData: { date: string; clicks: number }[];
  linkData: { title: string; count: number; percentage: number }[];
  referrerData: { name: string; count: number }[];
}

function formatDate(dateStr: unknown) {
  if (typeof dateStr !== "string") return "";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function AnalyticsDashboard({ totalClicks, dailyData, linkData, referrerData }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">総クリック数（30日）</p>
          <p className="text-3xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">平均（/日）</p>
          <p className="text-3xl font-bold text-gray-900">
            {totalClicks > 0 ? (totalClicks / 30).toFixed(1) : "0"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">リンク数</p>
          <p className="text-3xl font-bold text-gray-900">{linkData.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">最多流入元</p>
          <p className="text-lg font-bold text-gray-900 truncate">
            {referrerData[0]?.name ?? "—"}
          </p>
        </div>
      </div>

      {/* Daily chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">日別クリック数</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              labelFormatter={formatDate}
              formatter={(value: unknown) => [`${value} クリック`, ""]}
              contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 8 }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#1a1a1a"
              fill="#f3f4f6"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Links breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">リンク別クリック数</h2>
          <div className="space-y-3">
            {linkData.map((link) => (
              <div key={link.title}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">{link.title}</span>
                  <span className="text-sm font-medium text-gray-900">{link.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-800 rounded-full transition-all"
                    style={{ width: `${link.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {linkData.length === 0 && (
              <p className="text-sm text-gray-400">データなし</p>
            )}
          </div>
        </div>

        {/* Referrers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">流入元</h2>
          <div className="space-y-2">
            {referrerData.map((ref) => (
              <div key={ref.name} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{ref.name}</span>
                <span className="text-sm font-medium text-gray-900">{ref.count}</span>
              </div>
            ))}
            {referrerData.length === 0 && (
              <p className="text-sm text-gray-400">データなし</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
