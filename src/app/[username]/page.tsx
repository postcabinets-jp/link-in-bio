import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicProfile } from "./public-profile";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, seo, avatar_url")
    .eq("username", username.toLowerCase())
    .single();

  if (!profile) return {};

  const seo = profile.seo as { title?: string; description?: string } | null;

  const title = seo?.title ?? `${profile.display_name ?? username}`;
  const description = seo?.description ?? profile.bio ?? `${username}のリンク集`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .single();

  if (!profile) notFound();

  const [{ data: links }, { data: socialLinks }] = await Promise.all([
    supabase
      .from("links")
      .select("*")
      .eq("user_id", profile.id)
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("social_links")
      .select("*")
      .eq("user_id", profile.id)
      .order("sort_order"),
  ]);

  return (
    <PublicProfile
      profile={profile}
      links={links ?? []}
      socialLinks={socialLinks ?? []}
    />
  );
}
