export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      feature_requests: {
        Row: {
          analysis_id: string
          description: string
          feature_name: string
          first_mentioned: string
          id: string
          mention_count: number
          status: string | null
        }
        Insert: {
          analysis_id: string
          description: string
          feature_name: string
          first_mentioned: string
          id?: string
          mention_count: number
          status?: string | null
        }
        Update: {
          analysis_id?: string
          description?: string
          feature_name?: string
          first_mentioned?: string
          id?: string
          mention_count?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_requests_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "sentiment_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      sentiment_analysis: {
        Row: {
          analyzed_at: string
          channel_name: string
          id: string
          message_count: number
          period: string
          platform: string
          sentiment_summary: Json
          topics: Json
        }
        Insert: {
          analyzed_at?: string
          channel_name: string
          id?: string
          message_count: number
          period: string
          platform: string
          sentiment_summary: Json
          topics: Json
        }
        Update: {
          analyzed_at?: string
          channel_name?: string
          id?: string
          message_count?: number
          period?: string
          platform?: string
          sentiment_summary?: Json
          topics?: Json
        }
        Relationships: []
      }
      sentiment_details: {
        Row: {
          analysis_id: string
          emotion_type: string
          id: string
          keywords: Json
          percentage: number
        }
        Insert: {
          analysis_id: string
          emotion_type: string
          id?: string
          keywords: Json
          percentage: number
        }
        Update: {
          analysis_id?: string
          emotion_type?: string
          id?: string
          keywords?: Json
          percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "sentiment_details_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "sentiment_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      sentiment_insights: {
        Row: {
          analysis_id: string
          confidence_score: number
          created_at: string
          description: string
          id: string
          insight_type: string
        }
        Insert: {
          analysis_id: string
          confidence_score: number
          created_at?: string
          description: string
          id?: string
          insight_type: string
        }
        Update: {
          analysis_id?: string
          confidence_score?: number
          created_at?: string
          description?: string
          id?: string
          insight_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sentiment_insights_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "sentiment_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      sentiment_notification_settings: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          notification_threshold: number
          platforms: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          notification_threshold?: number
          platforms?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          notification_threshold?: number
          platforms?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_media_analytics: {
        Row: {
          content_id: string
          id: string
          metrics: Json
          recorded_at: string | null
        }
        Insert: {
          content_id: string
          id?: string
          metrics: Json
          recorded_at?: string | null
        }
        Update: {
          content_id?: string
          id?: string
          metrics?: Json
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_media_analytics_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "social_media_content"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_content: {
        Row: {
          content: Json
          fetched_at: string | null
          id: string
          platform: string
          platform_content_id: string
          user_id: string
        }
        Insert: {
          content: Json
          fetched_at?: string | null
          id?: string
          platform: string
          platform_content_id: string
          user_id: string
        }
        Update: {
          content?: Json
          fetched_at?: string | null
          id?: string
          platform?: string
          platform_content_id?: string
          user_id?: string
        }
        Relationships: []
      }
      social_media_credentials: {
        Row: {
          access_token: string | null
          created_at: string | null
          id: string
          platform: string
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          platform: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          platform?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      social_platforms: {
        Row: {
          created_at: string
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          platform_name: string
          platform_username: string | null
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          platform_name: string
          platform_username?: string | null
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          platform_name?: string
          platform_username?: string | null
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          content: string | null
          engagement_metrics: Json | null
          fetched_at: string
          id: string
          media_urls: Json | null
          platform_id: string | null
          platform_post_id: string
          posted_at: string | null
        }
        Insert: {
          content?: string | null
          engagement_metrics?: Json | null
          fetched_at?: string
          id?: string
          media_urls?: Json | null
          platform_id?: string | null
          platform_post_id: string
          posted_at?: string | null
        }
        Update: {
          content?: string | null
          engagement_metrics?: Json | null
          fetched_at?: string
          id?: string
          media_urls?: Json | null
          platform_id?: string | null
          platform_post_id?: string
          posted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "social_platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          interaction_type: string
          metadata: Json | null
          platform: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          interaction_type: string
          metadata?: Json | null
          platform: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          interaction_type?: string
          metadata?: Json | null
          platform?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          feed_preferences: Json
          id: string
          notification_enabled: boolean
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feed_preferences?: Json
          id?: string
          notification_enabled?: boolean
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feed_preferences?: Json
          id?: string
          notification_enabled?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_connections: {
        Row: {
          chain_id: number
          created_at: string
          id: string
          last_connected_at: string
          nonce: string
          user_id: string
          wallet_address: string
          wallet_type: Database["public"]["Enums"]["wallet_type"]
        }
        Insert: {
          chain_id: number
          created_at?: string
          id?: string
          last_connected_at?: string
          nonce: string
          user_id: string
          wallet_address: string
          wallet_type: Database["public"]["Enums"]["wallet_type"]
        }
        Update: {
          chain_id?: number
          created_at?: string
          id?: string
          last_connected_at?: string
          nonce?: string
          user_id?: string
          wallet_address?: string
          wallet_type?: Database["public"]["Enums"]["wallet_type"]
        }
        Relationships: []
      }
      web3_auth_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string | null
          id: string
          token_type: string | null
          user_id: string | null
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: string | null
          id?: string
          token_type?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          token_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "web3_auth_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "web3_users"
            referencedColumns: ["id"]
          },
        ]
      }
      web3_users: {
        Row: {
          chain_id: number
          created_at: string
          id: string
          is_active: boolean | null
          nonce: string | null
          updated_at: string
          wallet_address: string
          wallet_type: string
        }
        Insert: {
          chain_id?: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          nonce?: string | null
          updated_at?: string
          wallet_address: string
          wallet_type?: string
        }
        Update: {
          chain_id?: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          nonce?: string | null
          updated_at?: string
          wallet_address?: string
          wallet_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_nonce: {
        Args: { user_id: string; wallet_address: string }
        Returns: string
      }
      generate_web3_nonce: {
        Args: {
          p_wallet_address: string
          p_chain_id?: number
          p_wallet_type?: string
        }
        Returns: string
      }
      get_feed_by_wallet: {
        Args: { p_wallet_address: string; p_limit?: number }
        Returns: {
          id: string
          platform_post_id: string
          content: string
          media_urls: Json
          engagement_metrics: Json
          posted_at: string
          fetched_at: string
          platform_name: string
          platform_username: string
        }[]
      }
      get_platforms_by_wallet: {
        Args: { p_wallet_address: string }
        Returns: {
          id: string
          platform_name: string
          platform_username: string
          is_connected: boolean
          last_sync_at: string
          created_at: string
          updated_at: string
        }[]
      }
      verify_web3_signature: {
        Args: {
          p_wallet_address: string
          p_signature: string
          p_chain_id?: number
          p_wallet_type?: string
        }
        Returns: Json
      }
    }
    Enums: {
      wallet_type: "metamask" | "walletconnect" | "coinbase"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      wallet_type: ["metamask", "walletconnect", "coinbase"],
    },
  },
} as const
