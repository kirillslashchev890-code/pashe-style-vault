import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface WishlistItemWithProduct {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_old_price?: number;
  product_image: string;
}

interface WishlistContextType {
  items: WishlistItemWithProduct[];
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("wishlist")
      .select(`
        id, product_id,
        products ( name, price, old_price )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching wishlist:", error);
      setIsLoading(false);
      return;
    }

    // Fetch images separately for each product
    const mapped: WishlistItemWithProduct[] = [];
    for (const item of data || []) {
      const product = item.products as any;
      // Get first image
      const { data: imgData } = await supabase
        .from("product_images")
        .select("url")
        .eq("product_id", item.product_id)
        .order("sort_order")
        .limit(1);

      mapped.push({
        id: item.id,
        product_id: item.product_id,
        product_name: product?.name || "Товар",
        product_price: product?.price || 0,
        product_old_price: product?.old_price || undefined,
        product_image: imgData?.[0]?.url || "/placeholder.svg",
      });
    }

    setItems(mapped);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId: string) => {
    if (!user) return;
    const { error } = await supabase.from("wishlist").insert({
      user_id: user.id,
      product_id: productId,
    });
    if (error) {
      if (error.code === "23505") {
        toast.info("Товар уже в избранном");
        return;
      }
      console.error("Error adding to wishlist:", error);
      return;
    }
    toast.success("Добавлено в избранное");
    await fetchWishlist();
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
    toast.success("Удалено из избранного");
    await fetchWishlist();
  };

  const isInWishlist = (productId: string) => {
    return items.some(i => i.product_id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{ items, isLoading, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
