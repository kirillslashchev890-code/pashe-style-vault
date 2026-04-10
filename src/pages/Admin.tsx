import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, Users, Shield, ArrowLeft, Star, BarChart3, MapPin, CalendarClock, Tags, RotateCcw, ShoppingCart, MessageCircle, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useStockManager } from "@/hooks/useStockManager";
import { Product, getManagedProducts, getProductOverrides, saveCustomProduct, upsertProductOverride } from "@/data/products";

interface ShippingAddress {
  deliveryType?: "delivery" | "pickup";
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

interface AdminOrder {
  id: string;
  status: string;
  total: number;
  created_at: string;
  user_id: string;
  phone: string | null;
  notes: string | null;
  shipping_address: ShippingAddress | null;
  items: any[];
}

interface AdminUser {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface AdminReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

interface ReturnRequest {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  status: string;
  admin_comment: string | null;
  created_at: string;
  defect_photo_url?: string | null;
  return_description?: string | null;
  return_shipping_note?: string | null;
}

interface SupportMsg {
  id: string;
  user_id: string;
  conversation_id: string;
  role: string;
  content: string;
  needs_admin: boolean;
  admin_reply: string | null;
  created_at: string;
  ticket_status?: string;
  assigned_admin_id?: string | null;
}

const ADMIN_EMAIL = "admin1@gmail.com";
const ADMIN_PASSWORD = "admin1234";

const defaultCustomProduct = {
  name: "",
  category: "tshirts",
  brand: "PASHE Original",
  description: "",
  composition: "100% хлопок",
  care: "Машинная стирка при 30°C",
  country: "Турция",
  price: "",
  originalPrice: "",
  isNew: true,
  color1Name: "Чёрный",
  color1Hex: "#1A1A1A",
  color1Image: "",
  color2Name: "Синий",
  color2Hex: "#4169E1",
  color2Image: "",
  color3Name: "Коричневый",
  color3Hex: "#8B4513",
  color3Image: "",
};

type TabId = "orders" | "users" | "reviews" | "inventory" | "products" | "returns" | "procurement" | "support" | "revenue";

const SEASONS: Record<string, string> = { winter: "Зима", spring: "Весна", summer: "Лето", autumn: "Осень" };

const getCurrentSeason = (): string => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
};

const Admin = () => {
  const { user, isLoading: authLoading, signIn } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);
  const [tab, setTab] = useState<TabId>("orders");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [supportMsgs, setSupportMsgs] = useState<SupportMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const { allLowStock, refreshStock } = useStockManager();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOriginalPrice, setEditOriginalPrice] = useState("");
  const [editIsNew, setEditIsNew] = useState(false);
  const [discountUntil, setDiscountUntil] = useState("");
  const [customProduct, setCustomProduct] = useState(defaultCustomProduct);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [returnComment, setReturnComment] = useState<Record<string, string>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user && !autoLoginAttempted) {
      setAutoLoginAttempted(true);
      signIn(ADMIN_EMAIL, ADMIN_PASSWORD);
    }
  }, [authLoading, user, autoLoginAttempted, signIn]);

  useEffect(() => {
    if (user) checkAdmin();
  }, [user]);

  useEffect(() => {
    if (tab === "products") refreshProducts();
  }, [tab]);

  useEffect(() => {
    if (!selectedProductId || allProducts.length === 0) return;
    const selected = allProducts.find(p => p.id === selectedProductId);
    if (!selected) return;
    const overrides = getProductOverrides();
    const override = overrides[selectedProductId];
    setEditPrice(String(selected.price));
    setEditOriginalPrice(selected.originalPrice ? String(selected.originalPrice) : "");
    setEditIsNew(!!selected.isNew);
    setDiscountUntil(override?.discountUntil || "");
  }, [selectedProductId, allProducts]);

  // Auto-status: delivered after ETA, cancelled for expired pickup
  useEffect(() => {
    if (orders.length === 0) return;
    const now = new Date();
    let changed = false;

    orders.forEach(order => {
      if (!order.shipping_address) return;
      const addr = order.shipping_address;

      // Delivery: mark as delivered when ETA date is reached (for shipped OR processing orders)
      if (addr.deliveryType === "delivery" && (order.status === "shipped" || order.status === "processing") && addr.eta_date) {
        const eta = new Date(addr.eta_date);
        if (now >= eta) {
          supabase.from("orders").update({ status: "delivered" }).eq("id", order.id).then(() => { changed = true; });
        }
      }

      // Pickup: cancel if not picked up within 3 days
      if (addr.deliveryType === "pickup" && (order.status === "pending" || order.status === "processing")) {
        const created = new Date(order.created_at);
        const expiry = new Date(created.getTime() + 3 * 24 * 60 * 60 * 1000);
        if (now >= expiry) {
          supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id).then(() => { changed = true; });
        }
      }
    });

    // Refresh after a delay to pick up changes
    if (changed) setTimeout(() => fetchOrders(), 2000);
  }, [orders.length]);

  const refreshProducts = () => {
    const list = getManagedProducts();
    setAllProducts(list);
    if (!selectedProductId && list.length > 0) setSelectedProductId(list[0].id);
  };

  const checkAdmin = async () => {
    if (!user) return;
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    setIsAdmin(!!data);
    if (data) { fetchOrders(); fetchUsers(); fetchReviews(); fetchReturns(); fetchSupportMsgs(); }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select(`id, status, total, created_at, user_id, phone, notes, shipping_address, order_items ( id, product_name, size, color_name, quantity, price )`).order("created_at", { ascending: false }).limit(200);
    const mapped = (data || []).map((o: any) => ({ ...o, items: o.order_items || [] }));
    setOrders(mapped);

    const monthMap: Record<string, { revenue: number; delivered_orders: number; items_summary: { name: string; qty: number; total: number }[] }> = {};
    mapped.filter((o: any) => o.status === "delivered").forEach((o: any) => {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap[key]) monthMap[key] = { revenue: 0, delivered_orders: 0, items_summary: [] };
      monthMap[key].revenue += Number(o.total || 0);
      monthMap[key].delivered_orders += 1;
      (o.items || []).forEach((item: any) => {
        monthMap[key].items_summary.push({ name: item.product_name, qty: item.quantity, total: item.price * item.quantity });
      });
    });

    const snapshotRows = Object.entries(monthMap).map(([month_key, value]) => ({ month_key, ...value }));
    if (snapshotRows.length > 0) {
      await supabase.from("monthly_revenue_snapshots").upsert(snapshotRows as any, { onConflict: "month_key" });
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("user_id, full_name, phone, created_at").order("created_at", { ascending: false });
    setUsers(data || []);
  };

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(100);
    setReviews((data as AdminReview[]) || []);
  };

  const fetchReturns = async () => {
    const { data } = await supabase.from("return_requests").select("*").order("created_at", { ascending: false });
    setReturns((data as ReturnRequest[]) || []);
  };

  const fetchSupportMsgs = async () => {
    const { data } = await supabase.from("support_messages").select("*").neq("ticket_status", "resolved").order("created_at", { ascending: true }).limit(300);
    setSupportMsgs((data as SupportMsg[]) || []);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    fetchOrders();
  };

  const deleteReview = async (reviewId: string) => {
    await supabase.from("reviews").delete().eq("id", reviewId);
    fetchReviews();
  };

  const deleteUser = async (userId: string) => {
    // Delete user data (profile, cart, wishlist, roles)
    await supabase.from("profiles").delete().eq("user_id", userId);
    await supabase.from("cart_items").delete().eq("user_id", userId);
    await supabase.from("wishlist").delete().eq("user_id", userId);
    await supabase.from("user_roles").delete().eq("user_id", userId);
    fetchUsers();
  };

  const handleReturnAction = async (returnId: string, action: "approved" | "rejected") => {
    const comment = returnComment[returnId] || "";
    await supabase.from("return_requests").update({ status: action, admin_comment: comment || null }).eq("id", returnId);
    
    // If approved, cancel the order
    if (action === "approved") {
      const ret = returns.find(r => r.id === returnId);
      if (ret) {
        await supabase.from("orders").update({ status: "cancelled" }).eq("id", ret.order_id);
      }
    }
    fetchReturns();
    fetchOrders();
  };

  const acceptSupportTicket = async (conversationId: string) => {
    if (!user) return;
    await supabase
      .from("support_messages")
      .update({ ticket_status: "in_progress", assigned_admin_id: user.id } as any)
      .eq("conversation_id", conversationId)
      .neq("ticket_status", "resolved");
    setActiveConversationId(conversationId);
    fetchSupportMsgs();
  };

  const resolveSupportTicket = async (conversationId: string) => {
    if (!user) return;
    await supabase
      .from("support_messages")
      .update({ ticket_status: "resolved", resolved_at: new Date().toISOString(), resolved_by: user.id, needs_admin: false } as any)
      .eq("conversation_id", conversationId);
    if (activeConversationId === conversationId) setActiveConversationId(null);
    fetchSupportMsgs();
  };

  const handleSupportReply = async (conversationId: string) => {
    const reply = replyText[conversationId]?.trim();
    if (!reply) return;
    const targetMessage = [...supportMsgs]
      .reverse()
      .find((msg) => msg.conversation_id === conversationId && msg.role === "user" && !msg.admin_reply);
    if (!targetMessage) return;
    await supabase.from("support_messages").update({ admin_reply: reply, ticket_status: "in_progress", assigned_admin_id: user?.id } as any).eq("id", targetMessage.id);
    setReplyText(prev => ({ ...prev, [conversationId]: "" }));
    fetchSupportMsgs();
  };

  const saveCurrentProductSettings = () => {
    if (!selectedProductId) return;
    const priceNum = Number(editPrice);
    const originalNum = Number(editOriginalPrice);
    upsertProductOverride(selectedProductId, {
      price: Number.isFinite(priceNum) && priceNum > 0 ? priceNum : undefined,
      originalPrice: editOriginalPrice.trim() === "" ? null : Number.isFinite(originalNum) && originalNum > 0 ? originalNum : null,
      isNew: editIsNew,
      discountUntil: discountUntil || null,
    });
    refreshProducts();
  };

  const clearDiscount = () => {
    if (!selectedProductId) return;
    upsertProductOverride(selectedProductId, { originalPrice: null, discountUntil: null });
    setEditOriginalPrice("");
    setDiscountUntil("");
    refreshProducts();
  };

  const addCustomProduct = () => {
    const price = Number(customProduct.price);
    if (!customProduct.name.trim() || !Number.isFinite(price) || price <= 0) return;
    const original = Number(customProduct.originalPrice);
    const preparedColors = [
      { name: customProduct.color1Name.trim(), hex: customProduct.color1Hex.trim(), image: customProduct.color1Image.trim() },
      { name: customProduct.color2Name.trim(), hex: customProduct.color2Hex.trim(), image: customProduct.color2Image.trim() },
      { name: customProduct.color3Name.trim(), hex: customProduct.color3Hex.trim(), image: customProduct.color3Image.trim() },
    ].filter(c => c.name && c.hex && c.image);
    if (preparedColors.length === 0) return;

    const id = `${customProduct.category}-${Date.now()}`;
    const newProduct: Product = {
      id,
      name: customProduct.name.trim(),
      category: customProduct.category,
      subcategory: customProduct.category,
      season: "all",
      brand: customProduct.brand.trim() || "PASHE Original",
      description: customProduct.description.trim() || "Описание товара",
      composition: customProduct.composition.trim() || "100% хлопок",
      care: customProduct.care.trim() || "Машинная стирка при 30°C",
      country: customProduct.country.trim() || "Турция",
      price,
      originalPrice: customProduct.originalPrice.trim() !== "" && Number.isFinite(original) && original > 0 ? original : undefined,
      colors: preparedColors.map(c => ({ name: c.name, hex: c.hex })),
      colorImages: Object.fromEntries(preparedColors.map(c => [c.name, [c.image]])),
      images: [preparedColors[0].image],
      sizes: [{ name: "S", available: true }, { name: "M", available: true }, { name: "L", available: true }, { name: "XL", available: true }],
      isNew: customProduct.isNew,
      isSale: customProduct.originalPrice.trim() !== "" && Number.isFinite(original) && original > price,
    };
    saveCustomProduct(newProduct);
    setCustomProduct(defaultCustomProduct);
    refreshProducts();
  };

  const statusLabels: Record<string, string> = { pending: "Ожидание", processing: "Подтверждён", shipped: "В пути", delivered: "Доставлен", cancelled: "Отменён" };
  const statusColors: Record<string, string> = { pending: "bg-secondary text-foreground", processing: "bg-primary/15 text-primary", shipped: "bg-primary/15 text-primary", delivered: "bg-primary text-primary-foreground", cancelled: "bg-destructive/10 text-destructive" };

  const formatPrice = (p: number) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(p);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const formatAddress = (s: ShippingAddress | null) => {
    if (!s) return "Не указан";
    if (s.deliveryType === "pickup") return s.pickup_point || "Самовывоз";
    return [s.region, s.city, s.street, s.apartment, s.entrance && `п.${s.entrance}`, s.floor && `эт.${s.floor}`, s.zip].filter(Boolean).join(", ") || "Не указан";
  };

  const formatEta = (s: ShippingAddress | null) => {
    if (!s?.eta_date) return s?.delivery_days || "—";
    return new Date(s.eta_date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  };

  const lowStockProducts = allLowStock();
  const selectedProduct = allProducts.find(p => p.id === selectedProductId);
  const supportTickets = useMemo(() => {
    const grouped = new Map<string, SupportMsg>();
    supportMsgs.filter(msg => msg.role === "user").forEach((msg) => {
      const existing = grouped.get(msg.conversation_id);
      if (!existing || new Date(msg.created_at).getTime() > new Date(existing.created_at).getTime()) {
        grouped.set(msg.conversation_id, msg);
      }
    });
    return Array.from(grouped.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [supportMsgs]);

  const activeConversationMessages = activeConversationId
    ? supportMsgs.filter(msg => msg.conversation_id === activeConversationId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : [];

  // Procurement: 1 random low-stock item per category
  const currentSeason = getCurrentSeason();
  const procurementItems = (() => {
    const byCategory: Record<string, typeof lowStockProducts[0]> = {};
    lowStockProducts.forEach(p => {
      if (!byCategory[p.category] || p.count < byCategory[p.category].count) {
        byCategory[p.category] = p;
      }
    });
    return Object.values(byCategory).map(p => {
      const fullProduct = allProducts.find(pr => pr.id === p.id);
      const season = fullProduct?.season || "all";
      const isCurrentSeason = season === currentSeason || season === "all";
      const suggestedQty = isCurrentSeason ? 50 : 15;
      return { ...p, season, isCurrentSeason, suggestedQty };
    });
  })();

  // Revenue report: load from DB snapshots + merge with current orders data
  const [revenueSnapshots, setRevenueSnapshots] = useState<{ month_key: string; revenue: number; delivered_orders: number; items_summary: any[] }[]>([]);

  useEffect(() => {
    const loadSnapshots = async () => {
      const { data } = await supabase.from("monthly_revenue_snapshots").select("*").order("month_key", { ascending: false });
      if (data) setRevenueSnapshots(data as any);
    };
    if (tab === "revenue") loadSnapshots();
  }, [tab]);

  const revenueByMonth = (() => {
    const months: Record<string, { revenue: number; items: { name: string; qty: number; total: number }[] }> = {};

    // Start with DB snapshots
    revenueSnapshots.forEach(snap => {
      months[snap.month_key] = {
        revenue: snap.revenue,
        items: Array.isArray(snap.items_summary) ? snap.items_summary : [],
      };
    });

    // Merge current orders data (override with fresh data)
    orders.filter(o => o.status === "delivered").forEach(o => {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) months[key] = { revenue: 0, items: [] };
      // Only add if not already in snapshot to avoid double-counting
    });

    return Object.entries(months).sort((a, b) => b[0].localeCompare(a[0]));
  })();

  if (authLoading || isAdmin === null) {
    return <Layout><div className="container mx-auto px-4 py-24 text-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div></Layout>;
  }

  if (!user || !isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Доступ запрещён</h1>
          <p className="text-muted-foreground mb-6">У вас нет прав для просмотра этой страницы</p>
          <Button onClick={() => navigate("/")} className="btn-gold">На главную</Button>
        </div>
      </Layout>
    );
  }

  const tabs: { id: TabId; icon: any; label: string }[] = [
    { id: "orders", icon: Package, label: "Заказы" },
    { id: "users", icon: Users, label: "Пользователи" },
    { id: "reviews", icon: Star, label: "Отзывы" },
    { id: "inventory", icon: BarChart3, label: "Остатки" },
    { id: "products", icon: Tags, label: "Товары" },
    { id: "returns", icon: RotateCcw, label: "Возвраты" },
    { id: "procurement", icon: ShoppingCart, label: "Закупки" },
    { id: "support", icon: MessageCircle, label: "Поддержка" },
    { id: "revenue", icon: BarChart3, label: "Выручка" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold flex items-center gap-3">
            <Shield size={28} className="text-primary" /> Админ-панель
          </motion.h1>
          <Button variant="outline" onClick={() => navigate("/")}><ArrowLeft size={16} className="mr-2" /> На сайт</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4"><p className="text-muted-foreground text-sm">Заказов</p><p className="text-2xl font-bold">{orders.length}</p></div>
          <div className="bg-card border border-border rounded-xl p-4"><p className="text-muted-foreground text-sm">Пользователей</p><p className="text-2xl font-bold">{users.length}</p></div>
          <div className="bg-card border border-border rounded-xl p-4"><p className="text-muted-foreground text-sm">Выручка</p><p className="text-2xl font-bold">{formatPrice(orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.total, 0))}</p></div>
          <div className="bg-card border border-border rounded-xl p-4"><p className="text-muted-foreground text-sm">Ожидают</p><p className="text-2xl font-bold">{orders.filter(o => o.status === "pending").length}</p></div>
          <div className="bg-card border border-border rounded-xl p-4"><p className="text-muted-foreground text-sm">Возвраты</p><p className="text-2xl font-bold">{returns.filter(r => r.status === "pending").length}</p></div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); if (t.id === "returns") fetchReturns(); if (t.id === "support") fetchSupportMsgs(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${tab === t.id ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-secondary"}`}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>

        {/* ORDERS */}
        {tab === "orders" && (
          <div className="space-y-4">
            {loading && <p className="text-center text-muted-foreground py-6">Загрузка...</p>}
            {!loading && orders.length === 0 ? <p className="text-center text-muted-foreground py-12">Заказов пока нет</p> : orders.map(order => (
              <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div><p className="font-medium">Заказ #{order.id.slice(0, 8)}</p><p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p></div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-secondary"}`}>{statusLabels[order.status] || order.status}</span>
                    <span className="font-bold">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="p-3 rounded-lg bg-secondary/40"><p className="flex items-center gap-2 font-medium mb-1"><MapPin size={14} /> Адрес</p><p className="text-muted-foreground">{formatAddress(order.shipping_address)}</p></div>
                  <div className="p-3 rounded-lg bg-secondary/40"><p className="flex items-center gap-2 font-medium mb-1"><CalendarClock size={14} /> ETA</p><p className="text-muted-foreground">{formatEta(order.shipping_address)}</p></div>
                </div>
                <div className="space-y-1 text-sm mb-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-muted-foreground">
                      <span>{item.product_name} • {item.size}{item.color_name ? ` • ${item.color_name}` : ""} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                {order.notes && <div className="p-3 rounded-lg bg-secondary/30 text-sm mb-3"><p className="font-medium text-xs text-muted-foreground mb-1">💬 Комментарий:</p><p>{order.notes}</p></div>}
                {order.phone && <p className="text-xs text-muted-foreground mb-3">📞 {order.phone}</p>}
                <div className="flex gap-2 flex-wrap">
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                    <button key={s} onClick={() => updateStatus(order.id, s)} disabled={order.status === s}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${order.status === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                      {statusLabels[s]}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 font-semibold">Имя</th>
                <th className="text-left p-4 font-semibold">Телефон</th>
                <th className="text-left p-4 font-semibold">Дата регистрации</th>
                <th className="text-left p-4 font-semibold">Действия</th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.user_id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                    <td className="p-4">{u.full_name || "—"}</td>
                    <td className="p-4 text-muted-foreground">{u.phone || "—"}</td>
                    <td className="p-4 text-muted-foreground">{formatDate(u.created_at)}</td>
                    <td className="p-4">
                      <button onClick={() => { if (confirm("Удалить пользователя?")) deleteUser(u.user_id); }} className="text-destructive hover:underline text-xs flex items-center gap-1">
                        <Trash2 size={14} /> Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REVIEWS */}
        {tab === "reviews" && (
          <div className="space-y-4">
            {reviews.length === 0 ? <p className="text-center text-muted-foreground py-12">Отзывов пока нет</p> : reviews.map(review => (
              <div key={review.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className={s <= review.rating ? "text-primary fill-primary" : "text-muted-foreground"} />)}</div>
                    <span className="text-sm text-muted-foreground">Товар: {review.product_id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                    <button onClick={() => deleteReview(review.id)} className="text-xs text-destructive hover:underline">Удалить</button>
                  </div>
                </div>
                {review.review_text && <p className="text-sm">{review.review_text}</p>}
              </div>
            ))}
          </div>
        )}

        {/* INVENTORY */}
        {tab === "inventory" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Товары с малым остатком (≤10 шт)</h3>
              <Button variant="outline" size="sm" onClick={async () => { await refreshStock(); toast.success("Остатки обновлены"); }}>Обновить</Button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 font-semibold">Товар</th>
                <th className="text-left p-4 font-semibold">Категория</th>
                <th className="text-left p-4 font-semibold">Размер</th>
                <th className="text-left p-4 font-semibold">Цвет</th>
                <th className="text-left p-4 font-semibold">Остаток</th>
              </tr></thead>
              <tbody>
                {lowStockProducts.map((p, idx) => (
                  <tr key={`${p.id}-${p.size}-${p.color}-${idx}`} className="border-b border-border last:border-0 hover:bg-secondary/20">
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4 text-muted-foreground">{p.category}</td>
                    <td className="p-4">{p.size}</td>
                    <td className="p-4">{p.color}</td>
                    <td className="p-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.count === 0 ? "bg-destructive/20 text-destructive" : "bg-secondary"}`}>{p.count} шт</span></td>
                  </tr>
                ))}
                {lowStockProducts.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Все товары в наличии</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">Управление скидкой и NEW</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Товар</label>
                  <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full mt-1.5 h-11 px-3 bg-background border border-border rounded-lg">
                    {allProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm text-muted-foreground">Цена</label><input type="text" inputMode="numeric" value={editPrice} onChange={e => setEditPrice(e.target.value.replace(/[^\d]/g, "").slice(0, 7))} className="w-full mt-1.5 h-11 px-3 bg-background border border-border rounded-lg" /></div>
                  <div><label className="text-sm text-muted-foreground">Старая цена</label><input type="text" inputMode="numeric" value={editOriginalPrice} onChange={e => setEditOriginalPrice(e.target.value.replace(/[^\d]/g, "").slice(0, 7))} className="w-full mt-1.5 h-11 px-3 bg-background border border-border rounded-lg" /></div>
                </div>
                <div><label className="text-sm text-muted-foreground">Скидка активна до</label><input type="date" value={discountUntil} onChange={e => setDiscountUntil(e.target.value)} className="w-full mt-1.5 h-11 px-3 bg-background border border-border rounded-lg" /></div>
                <div className="flex items-center gap-3 mt-7"><input id="is-new-toggle" type="checkbox" checked={editIsNew} onChange={e => setEditIsNew(e.target.checked)} /><label htmlFor="is-new-toggle" className="text-sm">Бейдж NEW</label></div>
              </div>
              {selectedProduct && <p className="text-xs text-muted-foreground mt-3">Текущая цена: {formatPrice(selectedProduct.price)} {selectedProduct.originalPrice ? ` • Было: ${formatPrice(selectedProduct.originalPrice)}` : ""}</p>}
              <div className="flex flex-wrap gap-3 mt-4">
                <Button className="btn-gold" onClick={saveCurrentProductSettings}>Сохранить</Button>
                <Button variant="outline" onClick={clearDiscount}>Снять скидку</Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">Добавить новый товар</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={customProduct.name} onChange={e => setCustomProduct(p => ({ ...p, name: e.target.value.slice(0, 120) }))} placeholder="Название" className="h-11 px-3 bg-background border border-border rounded-lg" />
                <select value={customProduct.category} onChange={e => setCustomProduct(p => ({ ...p, category: e.target.value }))} className="h-11 px-3 bg-background border border-border rounded-lg">
                  {["tshirts", "outerwear", "shirts", "pants", "jeans", "shorts", "sweatshirts", "polo", "shoes", "suits", "accessories", "caps"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input value={customProduct.brand} onChange={e => setCustomProduct(p => ({ ...p, brand: e.target.value.slice(0, 60) }))} placeholder="Бренд" className="h-11 px-3 bg-background border border-border rounded-lg" />
                <input type="text" inputMode="numeric" value={customProduct.price} onChange={e => setCustomProduct(p => ({ ...p, price: e.target.value.replace(/[^\d]/g, "").slice(0, 7) }))} placeholder="Цена" className="h-11 px-3 bg-background border border-border rounded-lg" />
                <input type="text" inputMode="numeric" value={customProduct.originalPrice} onChange={e => setCustomProduct(p => ({ ...p, originalPrice: e.target.value.replace(/[^\d]/g, "").slice(0, 7) }))} placeholder="Старая цена" className="h-11 px-3 bg-background border border-border rounded-lg" />
                <div className="flex items-center gap-2"><input id="custom-is-new" type="checkbox" checked={customProduct.isNew} onChange={e => setCustomProduct(p => ({ ...p, isNew: e.target.checked }))} /><label htmlFor="custom-is-new" className="text-sm">NEW</label></div>
                <textarea value={customProduct.description} onChange={e => setCustomProduct(p => ({ ...p, description: e.target.value.slice(0, 500) }))} placeholder="Описание" className="md:col-span-2 min-h-24 p-3 bg-background border border-border rounded-lg" />
                <input value={customProduct.composition} onChange={e => setCustomProduct(p => ({ ...p, composition: e.target.value.slice(0, 120) }))} placeholder="Состав" className="h-11 px-3 bg-background border border-border rounded-lg" />
                <input value={customProduct.care} onChange={e => setCustomProduct(p => ({ ...p, care: e.target.value.slice(0, 120) }))} placeholder="Уход" className="h-11 px-3 bg-background border border-border rounded-lg" />
              </div>
              <div className="mt-5 space-y-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <input value={(customProduct as any)[`color${n}Name`]} onChange={e => setCustomProduct(p => ({ ...p, [`color${n}Name`]: e.target.value.slice(0, 30) }))} placeholder={`Цвет ${n}: название`} className="h-11 px-3 bg-background border border-border rounded-lg" />
                    <input value={(customProduct as any)[`color${n}Hex`]} onChange={e => setCustomProduct(p => ({ ...p, [`color${n}Hex`]: e.target.value.slice(0, 7) }))} placeholder={`HEX (#000000)`} className="h-11 px-3 bg-background border border-border rounded-lg" />
                    <div className="flex items-center gap-2">
                      <label className="h-11 px-3 bg-background border border-border rounded-lg flex items-center gap-2 cursor-pointer hover:border-primary/50 transition-colors flex-1 min-w-0">
                        <span className="text-sm text-muted-foreground truncate">{(customProduct as any)[`color${n}Image`] ? '📷 Загружено' : '📷 Выбрать фото'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => setCustomProduct(p => ({ ...p, [`color${n}Image`]: reader.result as string }));
                          reader.readAsDataURL(file);
                        }} />
                      </label>
                      {(customProduct as any)[`color${n}Image`] && <img src={(customProduct as any)[`color${n}Image`]} alt="" className="w-11 h-11 rounded-lg object-cover border border-border shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>
              <Button className="btn-gold mt-5" onClick={addCustomProduct}>Добавить товар</Button>
            </div>
          </div>
        )}

        {/* RETURNS */}
        {tab === "returns" && (
          <div className="space-y-4">
            {returns.length === 0 ? <p className="text-center text-muted-foreground py-12">Заявок на возврат нет</p> : returns.map(ret => (
              <div key={ret.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">Возврат к заказу #{ret.order_id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(ret.created_at)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ret.status === "approved" ? "bg-primary text-primary-foreground" : ret.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-secondary"}`}>
                    {ret.status === "pending" ? "На рассмотрении" : ret.status === "approved" ? "Одобрен" : "Отклонён"}
                  </span>
                </div>
                <p className="text-sm mb-3">Причина: {ret.reason}</p>
                {ret.return_description && <p className="text-sm mb-3 text-muted-foreground">Описание: {ret.return_description}</p>}
                {ret.defect_photo_url && <img src={ret.defect_photo_url} alt="Брак" className="mb-3 w-32 h-32 rounded-lg object-cover border border-border" />}
                {ret.status === "pending" && (
                  <div className="space-y-2">
                    <input value={returnComment[ret.id] || ""} onChange={e => setReturnComment(prev => ({ ...prev, [ret.id]: e.target.value }))} placeholder="Комментарий (необязательно)" className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm" />
                    <div className="flex gap-2">
                      <Button size="sm" className="btn-gold" onClick={() => handleReturnAction(ret.id, "approved")}>Одобрить</Button>
                      <Button size="sm" variant="outline" onClick={() => handleReturnAction(ret.id, "rejected")}>Отклонить</Button>
                    </div>
                  </div>
                )}
                {ret.admin_comment && <p className="text-xs text-muted-foreground mt-2">💬 Ответ: {ret.admin_comment}</p>}
                {ret.return_shipping_note && <p className="text-xs text-muted-foreground mt-2">↩️ {ret.return_shipping_note}</p>}
              </div>
            ))}
          </div>
        )}

        {/* PROCUREMENT */}
        {tab === "procurement" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-2">📦 План закупок — {SEASONS[currentSeason]} (закупка 1-го числа каждого месяца)</h3>
              <p className="text-sm text-muted-foreground mb-4">Товары с остатком ≤10 шт. Сезонные товары текущего сезона закупаются в полном объёме, внесезонные — в минимальном.</p>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-4 font-semibold">Товар</th>
                  <th className="text-left p-4 font-semibold">Размер</th>
                  <th className="text-left p-4 font-semibold">Цвет</th>
                  <th className="text-left p-4 font-semibold">Остаток</th>
                  <th className="text-left p-4 font-semibold">Сезон</th>
                  <th className="text-left p-4 font-semibold">Закупить</th>
                </tr></thead>
                <tbody>
                  {procurementItems.map((p, idx) => (
                    <tr key={idx} className={`border-b border-border last:border-0 ${p.isCurrentSeason ? "bg-primary/5" : ""}`}>
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4">{p.size}</td>
                      <td className="p-4">{p.color}</td>
                      <td className="p-4"><span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary">{p.count} шт</span></td>
                      <td className="p-4 text-muted-foreground">{SEASONS[p.season] || "Все"}</td>
                      <td className="p-4 font-semibold text-primary">{p.suggestedQty} шт</td>
                    </tr>
                  ))}
                  {procurementItems.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Нет товаров для закупки</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUPPORT MESSAGES */}
        {tab === "support" && (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4">
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Обращения</h3>
                <Button variant="outline" size="sm" onClick={fetchSupportMsgs}>Обновить</Button>
              </div>
              {supportTickets.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">Нет активных обращений</p> : supportTickets.map(ticket => (
                <button
                  key={ticket.conversation_id}
                  onClick={() => setActiveConversationId(ticket.conversation_id)}
                  className={`w-full text-left border rounded-xl p-3 transition-colors ${activeConversationId === ticket.conversation_id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-medium">Клиент {ticket.user_id.slice(0, 8)}</span>
                    <span className="text-[11px] text-muted-foreground">{ticket.ticket_status === "in_progress" ? "В работе" : "Новое"}</span>
                  </div>
                  <p className="text-sm line-clamp-2">{ticket.content}</p>
                  <div className="flex gap-2 mt-3">
                    <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); acceptSupportTicket(ticket.conversation_id); }}>Принять</Button>
                    <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); resolveSupportTicket(ticket.conversation_id); }}>Выполнено</Button>
                  </div>
                </button>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              {!activeConversationId ? (
                <p className="text-muted-foreground text-center py-16">Выберите обращение слева</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Чат с клиентом</h4>
                      <p className="text-sm text-muted-foreground">Диалог по конкретному обращению</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => resolveSupportTicket(activeConversationId)}>Выполнено</Button>
                  </div>
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {activeConversationMessages.map((msg) => (
                      <div key={msg.id} className="space-y-2">
                        <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.role === "user" ? "bg-secondary" : "bg-primary text-primary-foreground ml-auto"}`}>
                          {msg.content}
                        </div>
                        {msg.admin_reply && (
                          <div className="max-w-[85%] px-3 py-2 rounded-xl text-sm bg-primary text-primary-foreground ml-auto">
                            {msg.admin_reply}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={replyText[activeConversationId] || ""} onChange={e => setReplyText(prev => ({ ...prev, [activeConversationId]: e.target.value }))} placeholder="Написать ответ клиенту..." className="flex-1 h-10 px-3 bg-background border border-border rounded-lg text-sm" />
                    <Button size="sm" className="btn-gold" onClick={() => handleSupportReply(activeConversationId)}>Ответить</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVENUE REPORT */}
        {tab === "revenue" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-2">📊 Отчёт по выручке</h3>
              <p className="text-sm text-muted-foreground">Данные по доставленным заказам за каждый месяц.</p>
            </div>
            {revenueByMonth.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Нет данных о выручке</p>
            ) : revenueByMonth.map(([month, data]) => (
              <div key={month} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
                  <h4 className="font-semibold">{new Date(month + "-01").toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}</h4>
                  <span className="text-lg font-bold text-primary">{formatPrice(data.revenue)}</span>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Товар</th>
                    <th className="text-left p-3 font-semibold">Кол-во</th>
                    <th className="text-left p-3 font-semibold">Сумма</th>
                  </tr></thead>
                  <tbody>
                    {data.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-border last:border-0">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-muted-foreground">{item.qty} шт</td>
                        <td className="p-3 font-medium">{formatPrice(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
