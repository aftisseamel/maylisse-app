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
      article: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          price: number
          quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          price: number
          quantity?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          price?: number
          quantity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      client: {
        Row: {
          address_client: string | null
          created_at: string | null
          email: string
          id: number
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address_client?: string | null
          created_at?: string | null
          email: string
          id?: number
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address_client?: string | null
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      delivery_man: {
        Row: {
          address_delivery_man: string | null
          created_at: string | null
          email: string
          first_name: string
          id: number
          last_name: string
          phone: string | null
          pseudo_delivery_man: string
          updated_at: string | null
        }
        Insert: {
          address_delivery_man?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: number
          last_name: string
          phone?: string | null
          pseudo_delivery_man: string
          updated_at?: string | null
        }
        Update: {
          address_delivery_man?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          phone?: string | null
          pseudo_delivery_man?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order: {
        Row: {
          created_at: string | null
          delivery_address: string
          description_order: string
          id: number
          name_client: string
          pseudo_delivery_man: string | null
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_address: string
          description_order: string
          id?: number
          name_client: string
          pseudo_delivery_man?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_address?: string
          description_order?: string
          id?: number
          name_client?: string
          pseudo_delivery_man?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_name_client_fkey"
            columns: ["name_client"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "order_pseudo_delivery_man_fkey"
            columns: ["pseudo_delivery_man"]
            isOneToOne: false
            referencedRelation: "delivery_man"
            referencedColumns: ["pseudo_delivery_man"]
          },
        ]
      }
      order_article: {
        Row: {
          created_at: string | null
          id_article: number
          id_order: number
          price: number
          quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id_article: number
          id_order: number
          price?: number
          quantity?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id_article?: number
          id_order?: number
          price?: number
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_article_id_article_fkey"
            columns: ["id_article"]
            isOneToOne: false
            referencedRelation: "article"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_article_id_order_fkey"
            columns: ["id_order"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          role_profile: Database["public"]["Enums"]["role_profile"]
        }
        Insert: {
          id: string
          role_profile?: Database["public"]["Enums"]["role_profile"]
        }
        Update: {
          id?: string
          role_profile?: Database["public"]["Enums"]["role_profile"]
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
      order_status:
        | "initiated"
        | "preparation"
        | "prepared"
        | "delivering"
        | "delivered"
        | "finished"
        | "canceled"
      role_profile: "admin" | "delivery_man"
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
      order_status: [
        "initiated",
        "preparation",
        "prepared",
        "delivering",
        "delivered",
        "finished",
        "canceled",
      ],
      role_profile: ["admin", "delivery_man"],
    },
  },
} as const
