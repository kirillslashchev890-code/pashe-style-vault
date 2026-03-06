import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface OrderItemData {
  id: string;
  product_name: string;
  size: string;
  color_name: string | null;
  quantity: number;
  price: number;
}

export interface ShippingAddressData {
  deliveryType: "delivery" | "pickup";
  region?: string;
  city?: string;
  street?: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  zip?: string;
  delivery_days?: string;
  eta_date?: string;
  pickup_point?: string;
}

export interface OrderData {
  id: string;
  status: string;
  total: number;
  created_at: string;
  phone: string | null;
  notes: string | null;
  shipping_address: ShippingAddressData | null;
  items: OrderItemData[];
}

interface CreateOrderMeta {
  phone?: string;
  notes?: string;
  shippingAddress?: ShippingAddressData | null;
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id, status, total, created_at, phone, notes, shipping_address,
        order_items ( id, product_name, size, color_name, quantity, price )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      setIsLoading(false);
      return;
    }

    const mapped: OrderData[] = (data || []).map((order: any) => ({
      id: order.id,
      status: order.status,
      total: order.total,
      created_at: order.created_at,
      phone: order.phone || null,
      notes: order.notes || null,
      shipping_address: (order.shipping_address as ShippingAddressData | null) || null,
      items: order.order_items || [],
    }));

    setOrders(mapped);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (cartItems: any[], total: number, meta?: CreateOrderMeta) => {
    if (!user) return { error: "Not authenticated" };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        status: "pending",
        phone: meta?.phone || null,
        notes: meta?.notes || null,
        shipping_address: (meta?.shippingAddress as any) || null,
      } as any)
      .select()
      .single();

    if (orderError) return { error: orderError.message };

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      size: item.size,
      color_name: item.color_name || null,
      quantity: item.quantity,
      price: item.product_price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) return { error: itemsError.message };

    await fetchOrders();
    return { error: null, orderId: order.id };
  };

  const statusLabels: Record<string, string> = {
    pending: "Ожидание подтверждения",
    processing: "Подтверждён",
    shipped: "В пути",
    delivered: "Доставлен",
    cancelled: "Отменён",
  };

  return { orders, isLoading, createOrder, fetchOrders, statusLabels };
};
