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

interface AddToCartParams {
  productId: string;
  size: string;
  quantity: number;
  productName: string;
  productPrice: number;
  productImage: string;
  colorId?: string;
  colorName?: string;
}

interface CartContextType {
  items: CartItemWithProduct[];
  isLoading: boolean;
  addToCart: (params: AddToCartParams) => Promise<void>;
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
    if (!user) { setItems([]); return; }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);

    if (error) { console.error("Error fetching cart:", error); setIsLoading(false); return; }

    const mapped: CartItemWithProduct[] = (data || []).map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      size: item.size,
      color_id: item.color_id,
      quantity: item.quantity,
      product_name: item.product_name || "Товар",
      product_price: item.product_price || 0,
      product_image: item.product_image || "/placeholder.svg",
      color_name: item.color_name,
    }));
    setItems(mapped);
    setIsLoading(false);
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (params: AddToCartParams) => {
    if (!user) return;

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", params.productId)
      .eq("size", params.size)
      .maybeSingle();

    if (existing) {
      await supabase.from("cart_items")
        .update({ quantity: (existing as any).quantity + params.quantity })
        .eq("id", (existing as any).id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: params.productId,
        size: params.size,
        quantity: params.quantity,
        product_name: params.productName,
        product_price: params.productPrice,
        product_image: params.productImage,
        color_id: params.colorId || null,
        color_name: params.colorName || null,
      } as any);
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
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
