import { z } from "zod";

// ── Links ──────────────────────────────────────────────
export const createLinkSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(200, "タイトルは200文字以内にしてください"),
  url: z
    .string()
    .min(1, "URLは必須です")
    .url("有効なURLを入力してください"),
});

export const updateLinkSchema = z.object({
  id: z.string().uuid("無効なリンクIDです"),
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(200, "タイトルは200文字以内にしてください"),
  url: z
    .string()
    .min(1, "URLは必須です")
    .url("有効なURLを入力してください"),
});

export const deleteLinkSchema = z.object({
  id: z.string().uuid("無効なリンクIDです"),
});

export const toggleLinkSchema = z.object({
  id: z.string().uuid("無効なリンクIDです"),
  is_active: z.boolean(),
});

export const reorderLinksSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1, "リンクIDが必要です"),
});

// ── Profile ────────────────────────────────────────────
export const updateProfileSchema = z.object({
  display_name: z.string().max(100, "表示名は100文字以内にしてください").optional(),
  bio: z.string().max(500, "自己紹介は500文字以内にしてください").optional(),
});

export const updateSeoSchema = z.object({
  title: z.string().max(100, "タイトルは100文字以内にしてください").optional(),
  description: z.string().max(300, "説明文は300文字以内にしてください").optional(),
});

export const upsertSocialLinkSchema = z.object({
  platform: z.string().min(1, "プラットフォームは必須です"),
  url: z.union([
    z.literal(""),
    z.string().url("有効なURLを入力してください"),
  ]),
});

export const updateAvatarSchema = z.object({
  avatar_url: z.union([
    z.literal(""),
    z.string().url("有効なURLを入力してください"),
  ]),
});

// ── Appearance ─────────────────────────────────────────
const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const updateThemeSchema = z.object({
  template: z.enum(["default", "minimal", "bold", "gradient", "dark"]),
  bgColor: z.string().regex(hexColorRegex, "有効な16進カラーコードを入力してください"),
  textColor: z.string().regex(hexColorRegex, "有効な16進カラーコードを入力してください"),
  buttonStyle: z.enum(["rounded", "pill", "sharp", "outline"]),
  buttonBg: z.string().regex(hexColorRegex, "有効な16進カラーコードを入力してください"),
  buttonText: z.string().regex(hexColorRegex, "有効な16進カラーコードを入力してください"),
  fontFamily: z.string().min(1).max(200),
});

export const updateCustomCssSchema = z.object({
  custom_css: z.string().max(10000, "CSSは10,000文字以内にしてください"),
});

export const updateLayoutSchema = z.object({
  layout: z.enum(["standard", "compact", "wide"]),
});

// ── Analytics ──────────────────────────────────────────
export const trackClickSchema = z.object({
  link_id: z.string().uuid("無効なリンクIDです"),
  referrer: z.string().max(500).nullable().optional(),
});

export const getAnalyticsSchema = z.object({
  days: z.number().int().min(1).max(365).default(30),
});
