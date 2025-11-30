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
      salary_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          id: string
          month: string
          payment_date: string
          payment_method: string | null
          remarks: string | null
          teacher_id: string
          year: number
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          id?: string
          month: string
          payment_date?: string
          payment_method?: string | null
          remarks?: string | null
          teacher_id: string
          year: number
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          id?: string
          month?: string
          payment_date?: string
          payment_method?: string | null
          remarks?: string | null
          teacher_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "salary_payments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          address: string | null
          contact: string
          created_at: string
          created_by: string
          id: string
          name: string
          photo_url: string | null
          salary: number | null
          staff_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          photo_url?: string | null
          salary?: number | null
          staff_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          photo_url?: string | null
          salary?: number | null
          staff_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staff_salary_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          id: string
          month: string
          payment_date: string
          payment_method: string | null
          remarks: string | null
          staff_id: string
          year: number
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          id?: string
          month: string
          payment_date?: string
          payment_method?: string | null
          remarks?: string | null
          staff_id: string
          year: number
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          id?: string
          month?: string
          payment_date?: string
          payment_method?: string | null
          remarks?: string | null
          staff_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "staff_salary_payments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
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
          class_taught: string | null
          contact: string
          created_at: string
          created_by: string
          email: string
          experience: number
          id: string
          level: string | null
          name: string
          photo_url: string | null
          qualification: string
          salary: number | null
          subject: string
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          class_taught?: string | null
          contact: string
          created_at?: string
          created_by: string
          email: string
          experience?: number
          id?: string
          level?: string | null
          name: string
          photo_url?: string | null
          qualification: string
          salary?: number | null
          subject: string
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          class_taught?: string | null
          contact?: string
          created_at?: string
          created_by?: string
          email?: string
          experience?: number
          id?: string
          level?: string | null
          name?: string
          photo_url?: string | null
          qualification?: string
          salary?: number | null
          subject?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      calculate_fee_due: { Args: { student_uuid: string }; Returns: number }
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher" | "student"
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
      app_role: ["admin", "teacher", "student"],
      user_role: ["admin", "teacher", "student"],
    },
  },
} as const
