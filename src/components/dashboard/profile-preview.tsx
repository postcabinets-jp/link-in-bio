import type { Database, ThemeConfig } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Link = Database["public"]["Tables"]["links"]["Row"];

const buttonStyles: Record<string, string> = {
  rounded: "rounded-lg",
  pill: "rounded-full",
  sharp: "rounded-none",
  outline: "rounded-lg border-2",
};

export function ProfilePreview({
  profile,
  links,
}: {
  profile: Profile;
  links: Link[];
}) {
  const theme = profile.theme as ThemeConfig;

  return (
    <div
      className="w-full max-w-[320px] mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-lg"
      style={{ backgroundColor: theme.bgColor, color: theme.textColor, fontFamily: theme.fontFamily }}
    >
      <div className="px-6 pt-8 pb-4 text-center">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name ?? profile.username}
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
          >
            {(profile.display_name ?? profile.username)[0].toUpperCase()}
          </div>
        )}
        <h2 className="font-bold text-lg">{profile.display_name ?? profile.username}</h2>
        {profile.bio && (
          <p className="text-sm mt-1 opacity-80 leading-relaxed">{profile.bio}</p>
        )}
      </div>

      <div className="px-4 pb-6 space-y-2.5">
        {links.filter((l) => l.is_active).map((link) => (
          <div
            key={link.id}
            className={`w-full px-4 py-3 text-sm font-medium text-center transition-opacity hover:opacity-80 cursor-pointer ${buttonStyles[theme.buttonStyle] ?? "rounded-lg"}`}
            style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
          >
            {link.title}
          </div>
        ))}
        {links.filter((l) => l.is_active).length === 0 && (
          <p className="text-center text-xs opacity-40 py-4">リンクがまだありません</p>
        )}
      </div>
    </div>
  );
}
