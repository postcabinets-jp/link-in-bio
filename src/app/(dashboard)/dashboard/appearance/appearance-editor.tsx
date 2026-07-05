"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfilePreview } from "@/components/dashboard/profile-preview";
import { updateAppearance } from "@/app/actions/appearance";
import { updateCustomCss, updateLayout } from "@/app/actions/appearance";
import type { Database, ThemeConfig } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Link = Database["public"]["Tables"]["links"]["Row"];

const TEMPLATES: {
  id: ThemeConfig["template"];
  label: string;
  preview: ThemeConfig;
}[] = [
  {
    id: "default",
    label: "ライト",
    preview: {
      template: "default",
      bgColor: "#ffffff",
      textColor: "#1a1a1a",
      buttonStyle: "rounded",
      buttonBg: "#1a1a1a",
      buttonText: "#ffffff",
      fontFamily: "Inter, sans-serif",
    },
  },
  {
    id: "minimal",
    label: "ミニマル",
    preview: {
      template: "minimal",
      bgColor: "#fafaf8",
      textColor: "#2d2d2d",
      buttonStyle: "pill",
      buttonBg: "#2d2d2d",
      buttonText: "#fafaf8",
      fontFamily: "Georgia, serif",
    },
  },
  {
    id: "bold",
    label: "ダーク",
    preview: {
      template: "bold",
      bgColor: "#0f172a",
      textColor: "#f8fafc",
      buttonStyle: "sharp",
      buttonBg: "#3b82f6",
      buttonText: "#ffffff",
      fontFamily: "Inter, sans-serif",
    },
  },
  {
    id: "gradient",
    label: "ナチュラル",
    preview: {
      template: "gradient",
      bgColor: "#f0fdf4",
      textColor: "#14532d",
      buttonStyle: "rounded",
      buttonBg: "#16a34a",
      buttonText: "#ffffff",
      fontFamily: "Inter, sans-serif",
    },
  },
  {
    id: "dark",
    label: "クリーム",
    preview: {
      template: "dark",
      bgColor: "#fffbf0",
      textColor: "#44403c",
      buttonStyle: "pill",
      buttonBg: "#d97706",
      buttonText: "#ffffff",
      fontFamily: "Georgia, serif",
    },
  },
];

const BUTTON_STYLES: { id: ThemeConfig["buttonStyle"]; label: string }[] = [
  { id: "rounded", label: "角丸" },
  { id: "pill", label: "ピル" },
  { id: "sharp", label: "スクエア" },
  { id: "outline", label: "アウトライン" },
];

const LAYOUT_OPTIONS: { id: NonNullable<ThemeConfig["layout"]>; label: string; desc: string }[] = [
  { id: "standard", label: "スタンダード", desc: "最大480px幅" },
  { id: "compact", label: "コンパクト", desc: "最大360px幅" },
  { id: "wide", label: "ワイド", desc: "最大600px幅" },
];

export function AppearanceEditor({
  profile,
  links,
}: {
  profile: Profile;
  links: Link[];
}) {
  const initialTheme = profile.theme as ThemeConfig;
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [customCss, setCustomCss] = useState(initialTheme.custom_css ?? "");
  const [layout, setLayout] = useState<NonNullable<ThemeConfig["layout"]>>(
    initialTheme.layout ?? "standard"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cssSaving, setCssSaving] = useState(false);
  const [cssSaved, setCssSaved] = useState(false);
  const [layoutSaving, setLayoutSaving] = useState(false);
  const [layoutSaved, setLayoutSaved] = useState(false);
  const [error, setError] = useState("");

  const previewProfile = { ...profile, theme: { ...theme, custom_css: customCss, layout } };

  function applyTemplate(t: ThemeConfig) {
    setTheme({ ...t });
  }

  function update(key: keyof ThemeConfig, value: string) {
    setTheme((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const result = await updateAppearance(theme);
    if (result?.error) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  async function handleCssSave() {
    setCssSaving(true);
    setError("");
    const result = await updateCustomCss(customCss);
    if (result?.error) {
      setError(result.error);
    } else {
      setCssSaved(true);
      setTimeout(() => setCssSaved(false), 2000);
    }
    setCssSaving(false);
  }

  async function handleLayoutSave() {
    setLayoutSaving(true);
    setError("");
    const result = await updateLayout(layout);
    if (result?.error) {
      setError(result.error);
    } else {
      setLayoutSaved(true);
      setTimeout(() => setLayoutSaved(false), 2000);
    }
    setLayoutSaving(false);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        {/* Templates */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            テンプレート
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => applyTemplate(t.preview)}
                className={`aspect-[3/4] rounded-lg border-2 transition-all ${
                  theme.template === t.id
                    ? "border-gray-900 scale-105"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                style={{ backgroundColor: t.preview.bgColor }}
                title={t.label}
              >
                <div className="h-full flex flex-col items-center justify-center gap-1 p-1.5">
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: t.preview.buttonBg }}
                  />
                  <div
                    className={`w-full h-1.5 ${t.preview.buttonStyle === "pill" ? "rounded-full" : "rounded-sm"}`}
                    style={{ backgroundColor: t.preview.buttonBg }}
                  />
                  <div
                    className={`w-full h-1.5 ${t.preview.buttonStyle === "pill" ? "rounded-full" : "rounded-sm"}`}
                    style={{ backgroundColor: t.preview.buttonBg }}
                  />
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            {TEMPLATES.map((t) => (
              <span
                key={t.id}
                className="flex-1 text-center text-xs text-gray-500 truncate"
              >
                {t.label}
              </span>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">カラー</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                背景色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.bgColor}
                  onChange={(e) => update("bgColor", e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-gray-200"
                />
                <Input
                  value={theme.bgColor}
                  onChange={(e) => update("bgColor", e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                テキスト色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => update("textColor", e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-gray-200"
                />
                <Input
                  value={theme.textColor}
                  onChange={(e) => update("textColor", e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                ボタン背景色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.buttonBg}
                  onChange={(e) => update("buttonBg", e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-gray-200"
                />
                <Input
                  value={theme.buttonBg}
                  onChange={(e) => update("buttonBg", e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                ボタンテキスト色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.buttonText}
                  onChange={(e) => update("buttonText", e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-gray-200"
                />
                <Input
                  value={theme.buttonText}
                  onChange={(e) => update("buttonText", e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Button Style */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            ボタンスタイル
          </h2>
          <div className="flex gap-2">
            {BUTTON_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => update("buttonStyle", s.id)}
                className={`flex-1 py-2 text-sm border transition-colors ${
                  theme.buttonStyle === s.id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                } ${s.id === "pill" ? "rounded-full" : s.id === "sharp" ? "rounded-none" : "rounded-md"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "保存中..." : saved ? "保存しました" : "テーマを保存"}
        </Button>

        {/* Layout */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            レイアウト
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {LAYOUT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLayout(opt.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  layout === opt.id
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
          <Button
            onClick={handleLayoutSave}
            disabled={layoutSaving}
            variant="outline"
            className="w-full mt-3"
          >
            {layoutSaving
              ? "保存中..."
              : layoutSaved
                ? "保存しました"
                : "レイアウトを保存"}
          </Button>
        </section>

        {/* Custom CSS */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            カスタムCSS
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            公開ページに適用されるCSSを追加できます
          </p>
          <Textarea
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            placeholder={`.profile-page {\n  /* カスタムスタイル */\n}`}
            rows={6}
            className="font-mono text-xs"
          />
          <Button
            onClick={handleCssSave}
            disabled={cssSaving}
            variant="outline"
            className="w-full mt-3"
          >
            {cssSaving
              ? "保存中..."
              : cssSaved
                ? "保存しました"
                : "CSSを保存"}
          </Button>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="lg:w-80 flex-shrink-0">
        <div className="sticky top-8">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            プレビュー
          </p>
          <ProfilePreview profile={previewProfile} links={links} />
        </div>
      </div>
    </div>
  );
}
