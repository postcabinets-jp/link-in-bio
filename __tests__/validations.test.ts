import { describe, it, expect } from "vitest";
import {
  createLinkSchema,
  updateLinkSchema,
  deleteLinkSchema,
  toggleLinkSchema,
  reorderLinksSchema,
  updateProfileSchema,
  updateSeoSchema,
  upsertSocialLinkSchema,
  updateAvatarSchema,
  updateThemeSchema,
  updateCustomCssSchema,
  updateLayoutSchema,
  trackClickSchema,
  getAnalyticsSchema,
} from "@/lib/validations";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const VALID_UUID_2 = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
const INVALID_UUID = "not-a-uuid";

// ── createLinkSchema ─────────────────────────────────────
describe("createLinkSchema", () => {
  it("accepts valid input", () => {
    const result = createLinkSchema.safeParse({
      title: "My Website",
      url: "https://example.com",
    });
    expect(result.success).toBe(true);
  });

  it("accepts title at max length (200 chars)", () => {
    const result = createLinkSchema.safeParse({
      title: "a".repeat(200),
      url: "https://example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createLinkSchema.safeParse({
      title: "",
      url: "https://example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title over 200 chars", () => {
    const result = createLinkSchema.safeParse({
      title: "a".repeat(201),
      url: "https://example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty url", () => {
    const result = createLinkSchema.safeParse({
      title: "Link",
      url: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid url", () => {
    const result = createLinkSchema.safeParse({
      title: "Link",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(createLinkSchema.safeParse({}).success).toBe(false);
    expect(createLinkSchema.safeParse({ title: "X" }).success).toBe(false);
    expect(
      createLinkSchema.safeParse({ url: "https://example.com" }).success
    ).toBe(false);
  });
});

// ── updateLinkSchema ─────────────────────────────────────
describe("updateLinkSchema", () => {
  it("accepts valid input with UUID", () => {
    const result = updateLinkSchema.safeParse({
      id: VALID_UUID,
      title: "Updated Title",
      url: "https://updated.example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID format", () => {
    const result = updateLinkSchema.safeParse({
      id: INVALID_UUID,
      title: "Title",
      url: "https://example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing id", () => {
    const result = updateLinkSchema.safeParse({
      title: "Title",
      url: "https://example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title over 200 chars", () => {
    const result = updateLinkSchema.safeParse({
      id: VALID_UUID,
      title: "x".repeat(201),
      url: "https://example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid url", () => {
    const result = updateLinkSchema.safeParse({
      id: VALID_UUID,
      title: "Title",
      url: "ftp-broken",
    });
    expect(result.success).toBe(false);
  });
});

// ── deleteLinkSchema ─────────────────────────────────────
describe("deleteLinkSchema", () => {
  it("accepts valid UUID", () => {
    expect(deleteLinkSchema.safeParse({ id: VALID_UUID }).success).toBe(true);
  });

  it("rejects invalid UUID", () => {
    expect(deleteLinkSchema.safeParse({ id: INVALID_UUID }).success).toBe(
      false
    );
  });

  it("rejects missing id", () => {
    expect(deleteLinkSchema.safeParse({}).success).toBe(false);
  });

  it("rejects empty string", () => {
    expect(deleteLinkSchema.safeParse({ id: "" }).success).toBe(false);
  });
});

// ── toggleLinkSchema ─────────────────────────────────────
describe("toggleLinkSchema", () => {
  it("accepts valid toggle with true", () => {
    const result = toggleLinkSchema.safeParse({
      id: VALID_UUID,
      is_active: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid toggle with false", () => {
    const result = toggleLinkSchema.safeParse({
      id: VALID_UUID,
      is_active: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-boolean is_active", () => {
    const result = toggleLinkSchema.safeParse({
      id: VALID_UUID,
      is_active: "yes",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID", () => {
    const result = toggleLinkSchema.safeParse({
      id: INVALID_UUID,
      is_active: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing is_active", () => {
    const result = toggleLinkSchema.safeParse({ id: VALID_UUID });
    expect(result.success).toBe(false);
  });
});

// ── reorderLinksSchema ───────────────────────────────────
describe("reorderLinksSchema", () => {
  it("accepts array of valid UUIDs", () => {
    const result = reorderLinksSchema.safeParse({
      orderedIds: [VALID_UUID, VALID_UUID_2],
    });
    expect(result.success).toBe(true);
  });

  it("accepts single UUID array", () => {
    const result = reorderLinksSchema.safeParse({
      orderedIds: [VALID_UUID],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty array", () => {
    const result = reorderLinksSchema.safeParse({ orderedIds: [] });
    expect(result.success).toBe(false);
  });

  it("rejects array with invalid UUID", () => {
    const result = reorderLinksSchema.safeParse({
      orderedIds: [VALID_UUID, INVALID_UUID],
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-array", () => {
    const result = reorderLinksSchema.safeParse({
      orderedIds: VALID_UUID,
    });
    expect(result.success).toBe(false);
  });
});

// ── updateProfileSchema ──────────────────────────────────
describe("updateProfileSchema", () => {
  it("accepts valid profile with both fields", () => {
    const result = updateProfileSchema.safeParse({
      display_name: "Nobu",
      bio: "Hello world",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty object (both fields optional)", () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(true);
  });

  it("accepts only display_name", () => {
    expect(
      updateProfileSchema.safeParse({ display_name: "Test" }).success
    ).toBe(true);
  });

  it("accepts only bio", () => {
    expect(updateProfileSchema.safeParse({ bio: "Test bio" }).success).toBe(
      true
    );
  });

  it("accepts display_name at max 100 chars", () => {
    expect(
      updateProfileSchema.safeParse({ display_name: "a".repeat(100) }).success
    ).toBe(true);
  });

  it("rejects display_name over 100 chars", () => {
    expect(
      updateProfileSchema.safeParse({ display_name: "a".repeat(101) }).success
    ).toBe(false);
  });

  it("accepts bio at max 500 chars", () => {
    expect(
      updateProfileSchema.safeParse({ bio: "b".repeat(500) }).success
    ).toBe(true);
  });

  it("rejects bio over 500 chars", () => {
    expect(
      updateProfileSchema.safeParse({ bio: "b".repeat(501) }).success
    ).toBe(false);
  });
});

// ── updateSeoSchema ──────────────────────────────────────
describe("updateSeoSchema", () => {
  it("accepts valid SEO fields", () => {
    const result = updateSeoSchema.safeParse({
      title: "Page Title",
      description: "Page description for SEO",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    expect(updateSeoSchema.safeParse({}).success).toBe(true);
  });

  it("accepts title at max 100 chars", () => {
    expect(
      updateSeoSchema.safeParse({ title: "t".repeat(100) }).success
    ).toBe(true);
  });

  it("rejects title over 100 chars", () => {
    expect(
      updateSeoSchema.safeParse({ title: "t".repeat(101) }).success
    ).toBe(false);
  });

  it("accepts description at max 300 chars", () => {
    expect(
      updateSeoSchema.safeParse({ description: "d".repeat(300) }).success
    ).toBe(true);
  });

  it("rejects description over 300 chars", () => {
    expect(
      updateSeoSchema.safeParse({ description: "d".repeat(301) }).success
    ).toBe(false);
  });
});

// ── upsertSocialLinkSchema ───────────────────────────────
describe("upsertSocialLinkSchema", () => {
  it("accepts valid platform and url", () => {
    const result = upsertSocialLinkSchema.safeParse({
      platform: "twitter",
      url: "https://twitter.com/user",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty string url (to clear social link)", () => {
    const result = upsertSocialLinkSchema.safeParse({
      platform: "instagram",
      url: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty platform", () => {
    const result = upsertSocialLinkSchema.safeParse({
      platform: "",
      url: "https://example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid url (not empty and not valid url)", () => {
    const result = upsertSocialLinkSchema.safeParse({
      platform: "twitter",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing platform", () => {
    const result = upsertSocialLinkSchema.safeParse({
      url: "https://example.com",
    });
    expect(result.success).toBe(false);
  });
});

// ── updateAvatarSchema ───────────────────────────────────
describe("updateAvatarSchema", () => {
  it("accepts valid avatar url", () => {
    const result = updateAvatarSchema.safeParse({
      avatar_url: "https://cdn.example.com/avatar.png",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty string (to clear avatar)", () => {
    const result = updateAvatarSchema.safeParse({ avatar_url: "" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid url", () => {
    const result = updateAvatarSchema.safeParse({
      avatar_url: "broken-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing avatar_url", () => {
    expect(updateAvatarSchema.safeParse({}).success).toBe(false);
  });
});

// ── updateThemeSchema ────────────────────────────────────
describe("updateThemeSchema", () => {
  const validTheme = {
    template: "default" as const,
    bgColor: "#FFFFFF",
    textColor: "#000000",
    buttonStyle: "rounded" as const,
    buttonBg: "#333333",
    buttonText: "#FFFFFF",
    fontFamily: "Inter",
  };

  it("accepts valid theme", () => {
    expect(updateThemeSchema.safeParse(validTheme).success).toBe(true);
  });

  it.each(["default", "minimal", "bold", "gradient", "dark"] as const)(
    "accepts template: %s",
    (template) => {
      expect(
        updateThemeSchema.safeParse({ ...validTheme, template }).success
      ).toBe(true);
    }
  );

  it("rejects invalid template", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, template: "neon" }).success
    ).toBe(false);
  });

  it.each(["rounded", "pill", "sharp", "outline"] as const)(
    "accepts buttonStyle: %s",
    (buttonStyle) => {
      expect(
        updateThemeSchema.safeParse({ ...validTheme, buttonStyle }).success
      ).toBe(true);
    }
  );

  it("rejects invalid buttonStyle", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, buttonStyle: "square" })
        .success
    ).toBe(false);
  });

  // Hex color regex tests
  it("accepts 3-char hex color", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, bgColor: "#FFF" }).success
    ).toBe(true);
  });

  it("accepts 6-char hex color", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, bgColor: "#FF00AA" })
        .success
    ).toBe(true);
  });

  it("accepts lowercase hex color", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, bgColor: "#abcdef" })
        .success
    ).toBe(true);
  });

  it("accepts mixed case hex color", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, bgColor: "#aAbBcC" })
        .success
    ).toBe(true);
  });

  it("rejects hex without #", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, bgColor: "FFFFFF" }).success
    ).toBe(false);
  });

  it("rejects 4-char hex (invalid length)", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, bgColor: "#FFFF" }).success
    ).toBe(false);
  });

  it("rejects 5-char hex (invalid length)", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, bgColor: "#FFFFF" }).success
    ).toBe(false);
  });

  it("rejects non-hex characters", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, bgColor: "#GGGGGG" })
        .success
    ).toBe(false);
  });

  it("rejects hex validation on all color fields", () => {
    for (const field of [
      "bgColor",
      "textColor",
      "buttonBg",
      "buttonText",
    ] as const) {
      const input = { ...validTheme, [field]: "invalid" };
      expect(updateThemeSchema.safeParse(input).success).toBe(false);
    }
  });

  it("rejects empty fontFamily", () => {
    expect(
      updateThemeSchema.safeParse({ ...validTheme, fontFamily: "" }).success
    ).toBe(false);
  });

  it("rejects fontFamily over 200 chars", () => {
    expect(
      updateThemeSchema.safeParse({
        ...validTheme,
        fontFamily: "f".repeat(201),
      }).success
    ).toBe(false);
  });

  it("accepts fontFamily at max 200 chars", () => {
    expect(
      updateThemeSchema.safeParse({
        ...validTheme,
        fontFamily: "f".repeat(200),
      }).success
    ).toBe(true);
  });
});

// ── updateCustomCssSchema ────────────────────────────────
describe("updateCustomCssSchema", () => {
  it("accepts valid CSS string", () => {
    const result = updateCustomCssSchema.safeParse({
      custom_css: "body { background: red; }",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty CSS string", () => {
    expect(
      updateCustomCssSchema.safeParse({ custom_css: "" }).success
    ).toBe(true);
  });

  it("accepts CSS at max 10000 chars", () => {
    expect(
      updateCustomCssSchema.safeParse({ custom_css: "a".repeat(10000) })
        .success
    ).toBe(true);
  });

  it("rejects CSS over 10000 chars", () => {
    expect(
      updateCustomCssSchema.safeParse({ custom_css: "a".repeat(10001) })
        .success
    ).toBe(false);
  });

  it("rejects missing custom_css", () => {
    expect(updateCustomCssSchema.safeParse({}).success).toBe(false);
  });
});

// ── updateLayoutSchema ───────────────────────────────────
describe("updateLayoutSchema", () => {
  it.each(["standard", "compact", "wide"] as const)(
    "accepts layout: %s",
    (layout) => {
      expect(updateLayoutSchema.safeParse({ layout }).success).toBe(true);
    }
  );

  it("rejects invalid layout value", () => {
    expect(
      updateLayoutSchema.safeParse({ layout: "fullwidth" }).success
    ).toBe(false);
  });

  it("rejects missing layout", () => {
    expect(updateLayoutSchema.safeParse({}).success).toBe(false);
  });
});

// ── trackClickSchema ─────────────────────────────────────
describe("trackClickSchema", () => {
  it("accepts valid click with referrer", () => {
    const result = trackClickSchema.safeParse({
      link_id: VALID_UUID,
      referrer: "https://google.com",
    });
    expect(result.success).toBe(true);
  });

  it("accepts null referrer", () => {
    const result = trackClickSchema.safeParse({
      link_id: VALID_UUID,
      referrer: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts missing referrer (optional)", () => {
    const result = trackClickSchema.safeParse({
      link_id: VALID_UUID,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid link_id UUID", () => {
    const result = trackClickSchema.safeParse({
      link_id: INVALID_UUID,
    });
    expect(result.success).toBe(false);
  });

  it("rejects referrer over 500 chars", () => {
    const result = trackClickSchema.safeParse({
      link_id: VALID_UUID,
      referrer: "r".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts referrer at max 500 chars", () => {
    const result = trackClickSchema.safeParse({
      link_id: VALID_UUID,
      referrer: "r".repeat(500),
    });
    expect(result.success).toBe(true);
  });
});

// ── getAnalyticsSchema ───────────────────────────────────
describe("getAnalyticsSchema", () => {
  it("accepts valid days value", () => {
    const result = getAnalyticsSchema.safeParse({ days: 7 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.days).toBe(7);
  });

  it("uses default 30 when days omitted", () => {
    const result = getAnalyticsSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.days).toBe(30);
  });

  it("accepts minimum days (1)", () => {
    const result = getAnalyticsSchema.safeParse({ days: 1 });
    expect(result.success).toBe(true);
  });

  it("accepts maximum days (365)", () => {
    const result = getAnalyticsSchema.safeParse({ days: 365 });
    expect(result.success).toBe(true);
  });

  it("rejects days below 1", () => {
    expect(getAnalyticsSchema.safeParse({ days: 0 }).success).toBe(false);
  });

  it("rejects days above 365", () => {
    expect(getAnalyticsSchema.safeParse({ days: 366 }).success).toBe(false);
  });

  it("rejects negative days", () => {
    expect(getAnalyticsSchema.safeParse({ days: -1 }).success).toBe(false);
  });

  it("rejects non-integer days", () => {
    expect(getAnalyticsSchema.safeParse({ days: 7.5 }).success).toBe(false);
  });

  it("rejects string days", () => {
    expect(getAnalyticsSchema.safeParse({ days: "30" }).success).toBe(false);
  });
});
