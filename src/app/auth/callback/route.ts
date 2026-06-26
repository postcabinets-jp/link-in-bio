import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Create profile for OAuth users on first login
  if (data.user) {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (!existingProfile) {
      // Generate username from email
      const baseUsername = data.user.email
        ?.split("@")[0]
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .slice(0, 25) ?? "user";

      let username = baseUsername;
      let suffix = 1;

      while (true) {
        const { data: taken } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .single();

        if (!taken) break;
        username = `${baseUsername}${suffix}`;
        suffix++;
      }

      await supabase.from("profiles").insert({
        id: data.user.id,
        username,
        display_name: data.user.user_metadata?.full_name ?? username,
        avatar_url: data.user.user_metadata?.avatar_url ?? null,
      });
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
