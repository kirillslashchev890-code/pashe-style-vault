import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const Cart = () => {
  const { items, isLoading, removeFromCart, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(price);

  const shipping = subtotal >= 10000 ? 0 : 500;
  const total = subtotal + shipping;

  if (isLoading) {
    return <Layout><div className="container mx-auto px-4 py-16 md:py-24 text-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div></Layout>;
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
            <p className="text-muted-foreground mb-8">Добавьте товары в корзину, чтобы оформить заказ</p>
            <Link to="/catalog"><Button className="btn-gold">Перейти в каталог <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold mb-8">Корзина</motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 bg-card rounded-2xl border border-border">
                <Link to={`/product/${item.product_id}`} className="shrink-0">
                  <img src={item.product_image} alt={item.product_name} className="w-24 h-32 object-cover rounded-lg bg-secondary" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product_id}`}><h3 className="font-medium hover:text-primary transition-colors">{item.product_name}</h3></Link>
                  <p className="text-muted-foreground text-sm mt-1">Размер: {item.size}{item.color_name && ` • Цвет: ${item.color_name}`}</p>
                  <p className="font-semibold mt-2">{formatPrice(item.product_price)}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Minus size={14} /></button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Итого</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between"><span className="text-muted-foreground">Товары ({items.length})</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Доставка</span><span>{shipping === 0 ? "Бесплатно" : formatPrice(shipping)}</span></div>
                {shipping > 0 && <p className="text-sm text-muted-foreground">До бесплатной доставки осталось {formatPrice(10000 - subtotal)}</p>}
                <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold"><span>К оплате</span><span>{formatPrice(total)}</span></div>
              </div>
              <Button className="w-full btn-gold py-6 mb-4" onClick={() => {
                if (!user) { navigate("/account"); return; }
                navigate("/checkout");
              }}>
                Оформить заказ
              </Button>
              <Link to="/catalog"><Button variant="outline" className="w-full">Продолжить покупки</Button></Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
