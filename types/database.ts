export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          provider_account_id: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          provider_account_id: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          provider_account_id?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          class_code: string
          class_corequisites: Json | null
          class_credits: number
          class_name: string
          class_number: string
          class_prerequisites: Json | null
          class_requirement_tags: Json | null
          class_subject: string
          course_id: string | null
          created_at: string | null
          grade: string | null
          id: string
          index: number
          map_id: string
          semester_id: string
          status: Database["public"]["Enums"]["class_status"] | null
          updated_at: string | null
        }
        Insert: {
          class_code: string
          class_corequisites?: Json | null
          class_credits: number
          class_name: string
          class_number: string
          class_prerequisites?: Json | null
          class_requirement_tags?: Json | null
          class_subject: string
          course_id?: string | null
          created_at?: string | null
          grade?: string | null
          id: string
          index: number
          map_id: string
          semester_id: string
          status?: Database["public"]["Enums"]["class_status"] | null
          updated_at?: string | null
        }
        Update: {
          class_code?: string
          class_corequisites?: Json | null
          class_credits?: number
          class_name?: string
          class_number?: string
          class_prerequisites?: Json | null
          class_requirement_tags?: Json | null
          class_subject?: string
          course_id?: string | null
          created_at?: string | null
          grade?: string | null
          id?: string
          index?: number
          map_id?: string
          semester_id?: string
          status?: Database["public"]["Enums"]["class_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          corequisites: Json | null
          course_code: string
          created_at: string | null
          credit_hours: number
          description: string | null
          id: string
          name: string
          number: string
          prerequisites: Json | null
          requirement_tags: Json | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          corequisites?: Json | null
          course_code: string
          created_at?: string | null
          credit_hours: number
          description?: string | null
          id: string
          name: string
          number: string
          prerequisites?: Json | null
          requirement_tags?: Json | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          corequisites?: Json | null
          course_code?: string
          created_at?: string | null
          credit_hours?: number
          description?: string | null
          id?: string
          name?: string
          number?: string
          prerequisites?: Json | null
          requirement_tags?: Json | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      maps: {
        Row: {
          created_at: string | null
          id: string
          map_degree: string | null
          map_name: string
          map_requirements: Json | null
          map_university: string | null
          start_term: Database["public"]["Enums"]["term"]
          start_year: number
          status: Database["public"]["Enums"]["map_status"] | null
          track_total_credits: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id: string
          map_degree?: string | null
          map_name: string
          map_requirements?: Json | null
          map_university?: string | null
          start_term: Database["public"]["Enums"]["term"]
          start_year: number
          status?: Database["public"]["Enums"]["map_status"] | null
          track_total_credits?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          map_degree?: string | null
          map_name?: string
          map_requirements?: Json | null
          map_university?: string | null
          start_term?: Database["public"]["Enums"]["term"]
          start_year?: number
          status?: Database["public"]["Enums"]["map_status"] | null
          track_total_credits?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      requirements: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_custom: boolean | null
          name: string
          tag: string
          type: Database["public"]["Enums"]["requirement_type"]
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id: string
          is_custom?: boolean | null
          name: string
          tag: string
          type: Database["public"]["Enums"]["requirement_type"]
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_custom?: boolean | null
          name?: string
          tag?: string
          type?: Database["public"]["Enums"]["requirement_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      semesters: {
        Row: {
          id: string
          index: number
          map_id: string
          term: Database["public"]["Enums"]["term"]
          year: number
        }
        Insert: {
          id: string
          index: number
          map_id: string
          term: Database["public"]["Enums"]["term"]
          year: number
        }
        Update: {
          id?: string
          index?: number
          map_id?: string
          term?: Database["public"]["Enums"]["term"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "semesters_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          expires: string
          id: string
          session_token: string
          user_id: string
        }
        Insert: {
          expires: string
          id: string
          session_token: string
          user_id: string
        }
        Update: {
          expires?: string
          id?: string
          session_token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          email_verified: string | null
          id: string
          image: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified?: string | null
          id: string
          image?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified?: string | null
          id?: string
          image?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      verification_tokens: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      class_status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "DROPPED"
      map_status: "ACTIVE" | "ARCHIVED" | "COMPLETED"
      requirement_type: "CREDIT_HOURS" | "CLASS_COUNT"
      term: "FALL" | "SPRING" | "SUMMER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      class_status: ["PLANNED", "IN_PROGRESS", "COMPLETED", "DROPPED"],
      map_status: ["ACTIVE", "ARCHIVED", "COMPLETED"],
      requirement_type: ["CREDIT_HOURS", "CLASS_COUNT"],
      term: ["FALL", "SPRING", "SUMMER"],
    },
  },
} as const
