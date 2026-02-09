import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface CartItemWithProduct {
  id: string;
  product_id: string;
  size: string;
  color_id: string | null;
  quantity: number;
  product_name: string;
  product_price: number;
  product_image: string;
  color_name?: string;
}

interface CartContextType {
  items: CartItemWithProduct[];
  isLoading: boolean;
  addToCart: (productId: string, size: string, quantity: number, colorId?: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id, product_id, size, color_id, quantity,
        products ( name, price ),
        product_colors ( name ),
        product_images ( url )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error);
      setIsLoading(false);
      return;
    }

    const mapped: CartItemWithProduct[] = (data || []).map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      size: item.size,
      color_id: item.color_id,
      quantity: item.quantity,
      product_name: item.products?.name || "Товар",
      product_price: item.products?.price || 0,
      product_image: item.product_images?.[0]?.url || "/placeholder.svg",
      color_name: item.product_colors?.name,
    }));

    setItems(mapped);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, size: string, quantity: number, colorId?: string) => {
    if (!user) return;

    // Check if item already in cart
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .eq("size", size)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        size,
        quantity,
        color_id: colorId || null,
      });
    }

    toast.success("Товар добавлен в корзину");
    await fetchCart();
  };

  const removeFromCart = async (cartItemId: string) => {
    await supabase.from("cart_items").delete().eq("id", cartItemId);
    toast.success("Товар удалён из корзины");
    await fetchCart();
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId);
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product_price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
