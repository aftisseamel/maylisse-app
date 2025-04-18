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
          categorie: Database["public"]["Enums"]["article_category"]
          description: string | null
          id: number
          quantity: number | 0
        }
        Insert: {
          categorie: Database["public"]["Enums"]["article_category"]
          description?: string | null
          id?: number
          quantity?: number | 0
        }
        Update: {
          categorie?: Database["public"]["Enums"]["article_category"]
          description?: string | null
          id?: number
          quantity?: number | 0
        }
        Relationships: []
      }
      cardboard: {
        Row: {
          description: string | null
          id: number
          size: Database["public"]["Enums"]["cardboard_category"] | null
        }
        Insert: {
          description?: string | null
          id?: number
          size?: Database["public"]["Enums"]["cardboard_category"] | null
        }
        Update: {
          description?: string | null
          id?: number
          size?: Database["public"]["Enums"]["cardboard_category"] | null
        }
        Relationships: []
      }
      client: {
        Row: {
          address: string | null
          family_name: string | null
          id: number
          name: string
          phone: number | null
        }
        Insert: {
          address?: string | null
          family_name?: string | null
          id?: number
          name: string
          phone?: number | null
        }
        Update: {
          address?: string | null
          family_name?: string | null
          id?: number
          name?: string
          phone?: number | null
        }
        Relationships: []
      }
      commanded_articles: {
        Row: {
          commanded_quantity: number | null
          description: string | null
          id_article: number
          id_carboard: number | null
          id_order: number
        }
        Insert: {
          commanded_quantity?: number | null
          description?: string | null
          id_article: number
          id_carboard?: number | null
          id_order: number
        }
        Update: {
          commanded_quantity?: number | null
          description?: string | null
          id_article?: number
          id_carboard?: number | null
          id_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "articles_to_deliver_id_article_fkey"
            columns: ["id_article"]
            isOneToOne: false
            referencedRelation: "article"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commanded_articles_id_carboard_fkey"
            columns: ["id_carboard"]
            isOneToOne: false
            referencedRelation: "cardboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commanded_articles_id_order_fkey"
            columns: ["id_order"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery: {
        Row: {
          description: string
          id_delivery_man: number
          id_order: number
        }
        Insert: {
          description: string
          id_delivery_man: number
          id_order: number
        }
        Update: {
          description?: string
          id_delivery_man?: number
          id_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "delivery_id_order_fkey"
            columns: ["id_order"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livraison_id_delivery_man_fkey"
            columns: ["id_delivery_man"]
            isOneToOne: false
            referencedRelation: "delivery_man"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_man: {
        Row: {
          created_at: string
          family_name: string | null
          id: number
          mail: string | null
          name: string | null
          phone_number: number | null
        }
        Insert: {
          created_at: string
          family_name?: string | null
          id?: number
          mail?: string | null
          name?: string | null
          phone_number?: number | null
        }
        Update: {
          created_at?: string
          family_name?: string | null
          id?: number
          mail?: string | null
          name?: string | null
          phone_number?: number | null
        }
        Relationships: []
      }
      order: {
        Row: {
          delivery_address: string | null
          description: string
          id: number
          id_client: number | null
        }
        Insert: {
          delivery_address?: string | null
          description: string
          id?: number
          id_client?: number | null
        }
        Update: {
          delivery_address?: string | null
          description?: string
          id?: number
          id_client?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "command_id_client_fkey"
            columns: ["id_client"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      sum_quantity_above: {
        Args: { val: number }
        Returns: number
      }
    }
    Enums: {
      article_category:
        | "moule_rouge"
        | "moule_bleu"
        | "moule_noir"
        | "papier_spécial1"
        | "papier_spécial2"
        | "papier_spécial3"
        | "papier_spécial4"
        | "papier_spécial5"
        | "papier_spécial6"
        | "papier_spécial7"
      cardboard_category: "S" | "M" | "L" | "XL"
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
      article_category: [
        "moule_rouge",
        "moule_bleu",
        "moule_noir",
        "papier_spécial1",
        "papier_spécial2",
        "papier_spécial3",
        "papier_spécial4",
        "papier_spécial5",
        "papier_spécial6",
        "papier_spécial7",
      ],
      cardboard_category: ["S", "M", "L", "XL"],
    },
  },
} as const
