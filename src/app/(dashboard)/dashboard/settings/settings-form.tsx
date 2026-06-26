"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile, updateSeo, upsertSocialLink } from "@/app/actions/profile";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];

const SOCIAL_PLATFORMS = [
  { id: "x", label: "X (Twitter)", placeholder: "https://x.com/yourname" },
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourname" },
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourname" },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourname" },
  { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname" },
  { id: "github", label: "GitHub", placeholder: "https://github.com/yourname" },
];

export function SettingsForm({
  profile,
  socialLinks,
  email,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
  email: string;
}) {
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [seoSaving, setSeoSaving] = useState(false);
  const [seoMsg, setSeoMsg] = useState("");
  const [socialStatus, setSocialStatus] = useState<Record<string, string>>({});

  const socialMap = Object.fromEntries(socialLinks.map((s) => [s.platform, s.url]));

  async function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg("");
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    setProfileMsg(result?.error ?? "保存しました");
    setProfileSaving(false);
    setTimeout(() => setProfileMsg(""), 3000);
  }

  async function handleSeoSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSeoSaving(true);
    setSeoMsg("");
    const formData = new FormData(e.currentTarget);
    const result = await updateSeo(formData);
    setSeoMsg(result?.error ?? "保存しました");
    setSeoSaving(false);
    setTimeout(() => setSeoMsg(""), 3000);
  }

  async function handleSocialSave(platform: string, url: string) {
    setSocialStatus((prev) => ({ ...prev, [platform]: "保存中..." }));
    const result = await upsertSocialLink(platform, url);
    setSocialStatus((prev) => ({ ...prev, [platform]: result?.error ?? "保存しました" }));
    setTimeout(() => setSocialStatus((prev) => ({ ...prev, [platform]: "" })), 2000);
  }

  const seo = profile.seo as { title?: string; description?: string };

  return (
    <div className="space-y-8">
      {/* Profile */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">プロフィール</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <Label htmlFor="display_name">表示名</Label>
            <Input id="display_name" name="display_name" defaultValue={profile.display_name ?? ""} />
          </div>
          <div>
            <Label htmlFor="bio">自己紹介</Label>
            <Textarea id="bio" name="bio" defaultValue={profile.bio ?? ""} rows={3} placeholder="あなたについて教えてください" />
          </div>
          <div>
            <Label>ユーザーネーム</Label>
            <Input value={profile.username} disabled className="bg-gray-50 text-gray-500" />
            <p className="text-xs text-gray-400 mt-1">ユーザーネームは変更できません</p>
          </div>
          <div>
            <Label>メールアドレス</Label>
            <Input value={email} disabled className="bg-gray-50 text-gray-500" />
          </div>
          {profileMsg && <p className="text-sm text-gray-600">{profileMsg}</p>}
          <Button type="submit" disabled={profileSaving}>
            {profileSaving ? "保存中..." : "保存"}
          </Button>
        </form>
      </section>

      {/* SNS */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">SNSリンク</h2>
        <div className="space-y-4">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform.id} className="flex items-center gap-3">
              <div className="flex-1">
                <Label htmlFor={`social_${platform.id}`} className="text-sm">{platform.label}</Label>
                <Input
                  id={`social_${platform.id}`}
                  type="url"
                  defaultValue={socialMap[platform.id] ?? ""}
                  placeholder={platform.placeholder}
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    const current = socialMap[platform.id] ?? "";
                    if (val !== current) {
                      handleSocialSave(platform.id, val);
                    }
                  }}
                />
              </div>
              {socialStatus[platform.id] && (
                <span className="text-xs text-gray-500 flex-shrink-0">{socialStatus[platform.id]}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">SEO / OGP設定</h2>
        <p className="text-xs text-gray-500 mb-4">SNSでシェアされたときのプレビューをカスタマイズ</p>
        <form onSubmit={handleSeoSave} className="space-y-4">
          <div>
            <Label htmlFor="seo_title">タイトル</Label>
            <Input id="seo_title" name="seo_title" defaultValue={seo?.title ?? ""} placeholder={`${profile.display_name ?? profile.username} — リンク集`} />
          </div>
          <div>
            <Label htmlFor="seo_description">説明文</Label>
            <Textarea id="seo_description" name="seo_description" defaultValue={seo?.description ?? ""} rows={2} placeholder={profile.bio ?? "SNSのリンクをまとめています"} />
          </div>
          {seoMsg && <p className="text-sm text-gray-600">{seoMsg}</p>}
          <Button type="submit" disabled={seoSaving}>
            {seoSaving ? "保存中..." : "保存"}
          </Button>
        </form>
      </section>
    </div>
  );
}
