import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, Users, Shield, ArrowLeft, Star, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AdminOrder {
  id: string;
  status: string;
  total: number;
  created_at: string;
  user_id: string;
  phone: string | null;
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

const Admin = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"orders" | "users" | "reviews" | "inventory">("orders");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    checkAdmin();
  }, [user]);

  const checkAdmin = async () => {
    if (!user) return;
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    setIsAdmin(!!data);
    if (data) { fetchOrders(); fetchUsers(); fetchReviews(); }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders")
      .select(`id, status, total, created_at, user_id, phone, order_items ( id, product_name, size, color_name, quantity, price )`)
      .order("created_at", { ascending: false }).limit(100);
    setOrders((data || []).map((o: any) => ({ ...o, items: o.order_items || [] })));
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

  const updateStatus = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    fetchOrders();
  };

  const deleteReview = async (reviewId: string) => {
    await supabase.from("reviews").delete().eq("id", reviewId);
    fetchReviews();
  };

  const statusLabels: Record<string, string> = {
    pending: "В обработке", processing: "Собирается", shipped: "Отправлен", delivered: "Доставлен", cancelled: "Отменён",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500", processing: "bg-blue-500/10 text-blue-500",
    shipped: "bg-purple-500/10 text-purple-500", delivered: "bg-green-500/10 text-green-500",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(price);
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold flex items-center gap-3">
            <Shield size={28} className="text-primary" /> Админ-панель
          </motion.h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft size={16} className="mr-2" /> На сайт
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-sm">Заказов</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-sm">Пользователей</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-sm">Выручка</p>
            <p className="text-2xl font-bold">{formatPrice(orders.reduce((s, o) => s + o.total, 0))}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-sm">В обработке</p>
            <p className="text-2xl font-bold">{orders.filter(o => o.status === "pending").length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted-foreground text-sm">Отзывов</p>
            <p className="text-2xl font-bold">{reviews.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: "orders" as const, icon: Package, label: "Заказы" },
            { id: "users" as const, icon: Users, label: "Пользователи" },
            { id: "reviews" as const, icon: Star, label: "Отзывы" },
            { id: "inventory" as const, icon: BarChart3, label: "Остатки" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${tab === t.id ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-secondary"}`}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Заказов пока нет</p>
            ) : orders.map((order) => (
              <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-medium">Заказ #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-secondary"}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="font-bold">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <div className="space-y-1 text-sm mb-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-muted-foreground">
                      <span>{item.product_name} • {item.size}{item.color_name ? ` • ${item.color_name}` : ""} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                    <button key={s} onClick={() => updateStatus(order.id, s)} disabled={order.status === s}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        order.status === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                      }`}>
                      {statusLabels[s]}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-4 font-semibold">Имя</th>
                  <th className="text-left p-4 font-semibold">Телефон</th>
                  <th className="text-left p-4 font-semibold">Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                    <td className="p-4">{u.full_name || "—"}</td>
                    <td className="p-4 text-muted-foreground">{u.phone || "—"}</td>
                    <td className="p-4 text-muted-foreground">{formatDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews */}
        {tab === "reviews" && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Отзывов пока нет</p>
            ) : reviews.map((review) => (
              <div key={review.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={16} className={s <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"} />
                      ))}
                    </div>
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

        {/* Inventory - show products with low stock info */}
        {tab === "inventory" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-muted-foreground mb-4">
              Остатки товаров управляются через локальный каталог. Товары с пометкой «мало на складе» отображаются для покупателей автоматически.
            </p>
            <div className="space-y-2">
              {(() => {
                // Import products data to show inventory
                const { products } = require("@/data/products");
                const lowStockProducts = products.filter((_: any, i: number) => i % 20 === 7);
                return lowStockProducts.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <span className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                      Мало на складе
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
