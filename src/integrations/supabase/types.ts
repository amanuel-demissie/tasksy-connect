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
      appointments: {
        Row: {
          business_id: string
          created_at: string
          customer_id: string
          date: string
          id: string
          service_id: string
          status: string
          time: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_id: string
          date: string
          id?: string
          service_id: string
          status?: string
          time: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_id?: string
          date?: string
          id?: string
          service_id?: string
          status?: string
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "business_services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_availability: {
        Row: {
          business_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          slot_duration: number
          start_time: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          slot_duration: number
          start_time: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          slot_duration?: number
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_availability_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_blocked_dates: {
        Row: {
          blocked_date: string
          business_id: string
          created_at: string
          id: string
          reason: string | null
          updated_at: string
        }
        Insert: {
          blocked_date: string
          business_id: string
          created_at?: string
          id?: string
          reason?: string | null
          updated_at?: string
        }
        Update: {
          blocked_date?: string
          business_id?: string
          created_at?: string
          id?: string
          reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_blocked_dates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["service_category"]
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          owner_id: string
          ratings: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          category: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          owner_id: string
          ratings?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          owner_id?: string
          ratings?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_services: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          duration: number
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          business_id: string | null
          created_at: string
          customer_id: string
          id: string
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_profiles: {
        Row: {
          bio: string | null
          category: Database["public"]["Enums"]["service_category"]
          created_at: string
          full_name: string
          hourly_rate: number | null
          id: string
          image_url: string | null
          owner_id: string
          title: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          category: Database["public"]["Enums"]["service_category"]
          created_at?: string
          full_name: string
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          owner_id: string
          title: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          full_name?: string
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          owner_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_profiles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_skills: {
        Row: {
          freelancer_id: string
          skill_id: string
        }
        Insert: {
          freelancer_id: string
          skill_id: string
        }
        Update: {
          freelancer_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_skills_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelancer_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          phone_number: string | null
          profile_image: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          phone_number?: string | null
          profile_image?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone_number?: string | null
          profile_image?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
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
      service_category: "beauty" | "dining" | "professional" | "home"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
