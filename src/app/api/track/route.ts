import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Simple in-memory rate limit: max 30 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.link_id || typeof body.link_id !== "string") {
    return NextResponse.json({ error: "missing link_id" }, { status: 400 });
  }

  if (!UUID_RE.test(body.link_id)) {
    return NextResponse.json({ error: "invalid link_id" }, { status: 400 });
  }

  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  // Verify the link exists and is active
  const { data: link } = await supabase
    .from("links")
    .select("id")
    .eq("id", body.link_id)
    .eq("is_active", true)
    .single();

  if (!link) {
    return NextResponse.json({ error: "link not found" }, { status: 404 });
  }

  const userAgent = request.headers.get("user-agent") ?? null;
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

  await supabase.from("click_events").insert({
    link_id: body.link_id,
    referrer,
    user_agent: userAgent,
  });

  return NextResponse.json({ ok: true });
}
