export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ThemeConfig = {
  template: "default" | "minimal" | "bold" | "gradient" | "dark";
  bgColor: string;
  textColor: string;
  buttonStyle: "rounded" | "pill" | "sharp" | "outline";
  buttonBg: string;
  buttonText: string;
  fontFamily: string;
  custom_css?: string;
  layout?: "standard" | "compact" | "wide";
};

export type SeoConfig = {
  title?: string;
  description?: string;
  ogImage?: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          theme: Json;
          seo: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          theme?: Json;
          seo?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          theme?: Json;
          seo?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      links: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };
      social_links: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          url: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          url: string;
          sort_order?: number;
        };
        Update: {
          platform?: string;
          url?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      click_events: {
        Row: {
          id: string;
          link_id: string;
          referrer: string | null;
          user_agent: string | null;
          country: string | null;
          clicked_at: string;
        };
        Insert: {
          id?: string;
          link_id: string;
          referrer?: string | null;
          user_agent?: string | null;
          country?: string | null;
          clicked_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
