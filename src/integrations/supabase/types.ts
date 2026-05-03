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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          color_id: string | null
          color_name: string | null
          created_at: string
          id: string
          product_id: string
          product_image: string
          product_name: string
          product_price: number
          quantity: number
          size: string
          user_id: string
        }
        Insert: {
          color_id?: string | null
          color_name?: string | null
          created_at?: string
          id?: string
          product_id: string
          product_image?: string
          product_name?: string
          product_price?: number
          quantity?: number
          size: string
          user_id: string
        }
        Update: {
          color_id?: string | null
          color_name?: string | null
          created_at?: string
          id?: string
          product_id?: string
          product_image?: string
          product_name?: string
          product_price?: number
          quantity?: number
          size?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_products: {
        Row: {
          brand: string
          care: string | null
          category: string
          color_images: Json
          colors: Json
          composition: string | null
          country: string | null
          created_at: string
          description: string | null
          id: string
          images: Json
          is_new: boolean | null
          name: string
          original_price: number | null
          price: number
          product_key: string
          sizes: Json
          subcategory: string | null
        }
        Insert: {
          brand?: string
          care?: string | null
          category: string
          color_images?: Json
          colors?: Json
          composition?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json
          is_new?: boolean | null
          name: string
          original_price?: number | null
          price: number
          product_key: string
          sizes?: Json
          subcategory?: string | null
        }
        Update: {
          brand?: string
          care?: string | null
          category?: string
          color_images?: Json
          colors?: Json
          composition?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json
          is_new?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          product_key?: string
          sizes?: Json
          subcategory?: string | null
        }
        Relationships: []
      }
      monthly_revenue_snapshots: {
        Row: {
          created_at: string
          delivered_orders: number
          id: string
          items_summary: Json
          month_key: string
          revenue: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivered_orders?: number
          id?: string
          items_summary?: Json
          month_key: string
          revenue?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivered_orders?: number
          id?: string
          items_summary?: Json
          month_key?: string
          revenue?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color_name: string | null
          id: string
          order_id: string
          price: number
          product_id: string | null
          product_name: string
          quantity: number
          size: string
        }
        Insert: {
          color_name?: string | null
          id?: string
          order_id: string
          price: number
          product_id?: string | null
          product_name: string
          quantity: number
          size: string
        }
        Update: {
          color_name?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
          size?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          phone: string | null
          shipping_address: Json | null
          status: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          phone?: string | null
          shipping_address?: Json | null
          status?: string
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          phone?: string | null
          shipping_address?: Json | null
          status?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_colors: {
        Row: {
          hex: string
          id: string
          name: string
          product_id: string
          sort_order: number | null
        }
        Insert: {
          hex: string
          id?: string
          name: string
          product_id: string
          sort_order?: number | null
        }
        Update: {
          hex?: string
          id?: string
          name?: string
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_colors_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          color_id: string | null
          id: string
          product_id: string
          sort_order: number | null
          url: string
        }
        Insert: {
          color_id?: string | null
          id?: string
          product_id: string
          sort_order?: number | null
          url: string
        }
        Update: {
          color_id?: string | null
          id?: string
          product_id?: string
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "product_colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_inventory: {
        Row: {
          color_id: string | null
          id: string
          product_id: string
          quantity: number
          size: string
        }
        Insert: {
          color_id?: string | null
          id?: string
          product_id: string
          quantity?: number
          size: string
        }
        Update: {
          color_id?: string | null
          id?: string
          product_id?: string
          quantity?: number
          size?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_inventory_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "product_colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_overrides: {
        Row: {
          created_at: string
          discount_until: string | null
          id: string
          is_new: boolean | null
          original_price: number | null
          price: number | null
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_until?: string | null
          id?: string
          is_new?: boolean | null
          original_price?: number | null
          price?: number | null
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_until?: string | null
          id?: string
          is_new?: boolean | null
          original_price?: number | null
          price?: number | null
          product_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand_id: string | null
          care: string | null
          category_id: string | null
          composition: string | null
          created_at: string
          description: string | null
          details: string | null
          id: string
          is_active: boolean | null
          is_new: boolean | null
          name: string
          old_price: number | null
          price: number
          season: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          care?: string | null
          category_id?: string | null
          composition?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          id?: string
          is_active?: boolean | null
          is_new?: boolean | null
          name: string
          old_price?: number | null
          price: number
          season?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          care?: string | null
          category_id?: string | null
          composition?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          id?: string
          is_active?: boolean | null
          is_new?: boolean | null
          name?: string
          old_price?: number | null
          price?: number
          season?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_apartment: string | null
          address_city: string | null
          address_street: string | null
          address_zip: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_apartment?: string | null
          address_city?: string | null
          address_street?: string | null
          address_zip?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_apartment?: string | null
          address_city?: string | null
          address_street?: string | null
          address_zip?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      return_requests: {
        Row: {
          admin_comment: string | null
          created_at: string
          defect_photo_url: string | null
          id: string
          order_id: string
          reason: string
          return_description: string | null
          return_shipping_note: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_comment?: string | null
          created_at?: string
          defect_photo_url?: string | null
          id?: string
          order_id: string
          reason: string
          return_description?: string | null
          return_shipping_note?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_comment?: string | null
          created_at?: string
          defect_photo_url?: string | null
          id?: string
          order_id?: string
          reason?: string
          return_description?: string | null
          return_shipping_note?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          product_id: string
          rating: number
          review_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id: string
          rating?: number
          review_text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string
          rating?: number
          review_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      size_guide: {
        Row: {
          category_slug: string
          chest_cm: number | null
          foot_cm: number | null
          hips_cm: number | null
          id: string
          length_cm: number | null
          shoulder_cm: number | null
          size: string
          waist_cm: number | null
        }
        Insert: {
          category_slug: string
          chest_cm?: number | null
          foot_cm?: number | null
          hips_cm?: number | null
          id?: string
          length_cm?: number | null
          shoulder_cm?: number | null
          size: string
          waist_cm?: number | null
        }
        Update: {
          category_slug?: string
          chest_cm?: number | null
          foot_cm?: number | null
          hips_cm?: number | null
          id?: string
          length_cm?: number | null
          shoulder_cm?: number | null
          size?: string
          waist_cm?: number | null
        }
        Relationships: []
      }
      stock_levels: {
        Row: {
          color_name: string
          id: string
          product_id: string
          quantity: number
          size: string
        }
        Insert: {
          color_name: string
          id?: string
          product_id: string
          quantity?: number
          size: string
        }
        Update: {
          color_name?: string
          id?: string
          product_id?: string
          quantity?: number
          size?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          admin_reply: string | null
          assigned_admin_id: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          needs_admin: boolean
          resolved_at: string | null
          resolved_by: string | null
          role: string
          ticket_status: string
          user_id: string
        }
        Insert: {
          admin_reply?: string | null
          assigned_admin_id?: string | null
          content: string
          conversation_id?: string
          created_at?: string
          id?: string
          needs_admin?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          role?: string
          ticket_status?: string
          user_id: string
        }
        Update: {
          admin_reply?: string | null
          assigned_admin_id?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          needs_admin?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          role?: string
          ticket_status?: string
          user_id?: string
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
          role?: Database["public"]["Enums"]["app_role"]
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
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_stock: {
        Args: {
          _color_name: string
          _product_id: string
          _qty: number
          _size: string
        }
        Returns: number
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
