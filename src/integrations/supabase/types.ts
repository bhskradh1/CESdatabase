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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      about_info: {
        Row: {
          created_at: string
          id: string
          mission: string
          updated_at: string
          values: string
          vision: string
          welcome_description: string | null
          welcome_title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mission: string
          updated_at?: string
          values: string
          vision: string
          welcome_description?: string | null
          welcome_title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mission?: string
          updated_at?: string
          values?: string
          vision?: string
          welcome_description?: string | null
          welcome_title?: string | null
        }
        Relationships: []
      }
      about_media: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean | null
          media_type: string
          media_url: string
          section: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          media_type?: string
          media_url: string
          section: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          media_type?: string
          media_url?: string
          section?: string
          title?: string
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          created_at: string
          created_by: string
          date: string
          id: string
          remarks: string | null
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date?: string
          id?: string
          remarks?: string | null
          status: string
          student_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          id?: string
          remarks?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      child_care_info: {
        Row: {
          created_at: string
          description: string
          features: Json | null
          id: string
          is_active: boolean | null
          location: string | null
          tagline: string | null
          timing: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          tagline?: string | null
          timing?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          tagline?: string | null
          timing?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          class_name: string
          created_at: string
          description: string | null
          id: string
          routine: Json | null
          updated_at: string
        }
        Insert: {
          class_name: string
          created_at?: string
          description?: string | null
          id?: string
          routine?: Json | null
          updated_at?: string
        }
        Update: {
          class_name?: string
          created_at?: string
          description?: string | null
          id?: string
          routine?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          event_date: string
          event_time: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          location: string | null
          target_class_id: string | null
          target_role: Database["public"]["Enums"]["user_role"] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          event_date: string
          event_time?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string | null
          target_class_id?: string | null
          target_role?: Database["public"]["Enums"]["user_role"] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string | null
          target_class_id?: string | null
          target_role?: Database["public"]["Enums"]["user_role"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_target_class_id_fkey"
            columns: ["target_class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          id: string
          payment_date: string
          payment_method: string | null
          receipt_number: string | null
          remarks: string | null
          student_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          id?: string
          payment_date?: string
          payment_method?: string | null
          receipt_number?: string | null
          remarks?: string | null
          student_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          id?: string
          payment_date?: string
          payment_method?: string | null
          receipt_number?: string | null
          remarks?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_fee_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery: {
        Row: {
          category: string | null
          created_at: string
          created_by: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          is_published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leadership: {
        Row: {
          created_at: string
          created_by: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean | null
          message: string | null
          name: string
          position: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          message?: string | null
          name: string
          position: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          message?: string | null
          name?: string
          position?: string
          updated_at?: string
        }
        Relationships: []
      }
      notices: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          is_important: boolean | null
          is_published: boolean | null
          priority: string | null
          target_class_id: string | null
          target_role: Database["public"]["Enums"]["user_role"] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_important?: boolean | null
          is_published?: boolean | null
          priority?: string | null
          target_class_id?: string | null
          target_role?: Database["public"]["Enums"]["user_role"] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_important?: boolean | null
          is_published?: boolean | null
          priority?: string | null
          target_class_id?: string | null
          target_role?: Database["public"]["Enums"]["user_role"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notices_target_class_id_fkey"
            columns: ["target_class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      popup_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          popup_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          popup_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          popup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "popup_images_popup_id_fkey"
            columns: ["popup_id"]
            isOneToOne: false
            referencedRelation: "welcome_popup"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          class_id: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          class_id?: string | null
          created_at?: string
          full_name: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          class_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          file_url: string
          id: string
          is_published: boolean | null
          published_date: string
          result_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          file_url: string
          id?: string
          is_published?: boolean | null
          published_date?: string
          result_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          file_url?: string
          id?: string
          is_published?: boolean | null
          published_date?: string
          result_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          address: string | null
          attendance_percentage: number | null
          class: string
          contact: string | null
          created_at: string
          created_by: string
          fee_paid: number | null
          fee_paid_current_year: number | null
          id: string
          name: string
          photo_url: string | null
          previous_year_balance: number | null
          remarks: string | null
          roll_number: string
          section: string | null
          student_id: string
          total_fee: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          attendance_percentage?: number | null
          class: string
          contact?: string | null
          created_at?: string
          created_by: string
          fee_paid?: number | null
          fee_paid_current_year?: number | null
          id?: string
          name: string
          photo_url?: string | null
          previous_year_balance?: number | null
          remarks?: string | null
          roll_number: string
          section?: string | null
          student_id: string
          total_fee?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          attendance_percentage?: number | null
          class?: string
          contact?: string | null
          created_at?: string
          created_by?: string
          fee_paid?: number | null
          fee_paid_current_year?: number | null
          id?: string
          name?: string
          photo_url?: string | null
          previous_year_balance?: number | null
          remarks?: string | null
          roll_number?: string
          section?: string | null
          student_id?: string
          total_fee?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          contact: string
          created_at: string
          created_by: string
          email: string
          experience: number
          id: string
          name: string
          photo_url: string | null
          qualification: string
          subject: string
          updated_at: string
        }
        Insert: {
          contact: string
          created_at?: string
          created_by: string
          email: string
          experience?: number
          id?: string
          name: string
          photo_url?: string | null
          qualification: string
          subject: string
          updated_at?: string
        }
        Update: {
          contact?: string
          created_at?: string
          created_by?: string
          email?: string
          experience?: number
          id?: string
          name?: string
          photo_url?: string | null
          qualification?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      welcome_popup: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      student_fee_overview: {
        Row: {
          class: string | null
          current_year_fees: number | null
          extra_paid: number | null
          fee_paid_current_year: number | null
          id: string | null
          name: string | null
          outstanding: number | null
          previous_year_balance: number | null
          section: string | null
          student_id: string | null
          total_due: number | null
        }
        Insert: {
          class?: string | null
          current_year_fees?: number | null
          extra_paid?: never
          fee_paid_current_year?: number | null
          id?: string | null
          name?: string | null
          outstanding?: never
          previous_year_balance?: number | null
          section?: string | null
          student_id?: string | null
          total_due?: never
        }
        Update: {
          class?: string | null
          current_year_fees?: number | null
          extra_paid?: never
          fee_paid_current_year?: number | null
          id?: string | null
          name?: string | null
          outstanding?: never
          previous_year_balance?: number | null
          section?: string | null
          student_id?: string | null
          total_due?: never
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_fee_due: {
        Args: { student_uuid: string }
        Returns: number
      }
      calculate_total_due: {
        Args: {
          p_current_year_fees: number
          p_fee_paid_current_year: number
          p_previous_year_balance: number
        }
        Returns: number
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role: "admin" | "teacher" | "student"
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
      user_role: ["admin", "teacher", "student"],
    },
  },
} as const
