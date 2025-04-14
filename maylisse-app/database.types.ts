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
          quantity: number | null
        }
        Insert: {
          categorie: Database["public"]["Enums"]["article_category"]
          description?: string | null
          id?: number
          quantity?: number | null
        }
        Update: {
          categorie?: Database["public"]["Enums"]["article_category"]
          description?: string | null
          id?: number
          quantity?: number | null
        }
        Relationships: []
      }
      carboard: {
        Row: {
          description: string | null
          id: number
          id_command: number | null
          quantityMax: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          id_command?: number | null
          quantityMax?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          id_command?: number | null
          quantityMax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "carboard_id_command_fkey"
            columns: ["id_command"]
            isOneToOne: false
            referencedRelation: "command"
            referencedColumns: ["id"]
          },
        ]
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
      command: {
        Row: {
          delivery_address: string | null
          description: string
          id: number
          id_client: number | null
          list_articles: number | null
        }
        Insert: {
          delivery_address?: string | null
          description: string
          id?: number
          id_client?: number | null
          list_articles?: number | null
        }
        Update: {
          delivery_address?: string | null
          description?: string
          id?: number
          id_client?: number | null
          list_articles?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "command_id_client_fkey"
            columns: ["id_client"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "command_list_articles_fkey"
            columns: ["list_articles"]
            isOneToOne: false
            referencedRelation: "article"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery: {
        Row: {
          description: string
          id_command: number
          id_delivery_man: number
        }
        Insert: {
          description: string
          id_command: number
          id_delivery_man: number
        }
        Update: {
          description?: string
          id_command?: number
          id_delivery_man?: number
        }
        Relationships: [
          {
            foreignKeyName: "livraison_id_command_fkey"
            columns: ["id_command"]
            isOneToOne: false
            referencedRelation: "command"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
    },
  },
} as const
