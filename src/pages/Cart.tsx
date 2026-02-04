import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

// Mock данные корзины
const initialCartItems = [
  {
    id: "1",
    name: "Пальто из шерсти",
    price: 24990,
    image: "https://images.unsplash.com/photo-1544923246-77307dd628b1?w=200&h=250&fit=crop",
    size: "M",
    quantity: 1,
  },
  {
    id: "2",
    name: "Хлопковая рубашка",
    price: 5990,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=250&fit=crop",
    size: "L",
    quantity: 2,
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 10000 ? 0 : 500;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
            <p className="text-muted-foreground mb-8">
              Добавьте товары в корзину, чтобы оформить заказ
            </p>
            <Link to="/catalog">
              <Button className="btn-gold">
                Перейти в каталог
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          Корзина
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 bg-card rounded-2xl border border-border"
              >
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-medium hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1">
                    Размер: {item.size}
                  </p>
                  <p className="font-semibold mt-2">{formatPrice(item.price)}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Итого</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Товары ({cartItems.length})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Доставка</span>
                  <span>{shipping === 0 ? "Бесплатно" : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    До бесплатной доставки осталось {formatPrice(10000 - subtotal)}
                  </p>
                )}
                <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold">
                  <span>К оплате</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button className="w-full btn-gold py-6 mb-4">
                Оформить заказ
              </Button>

              <Link to="/catalog">
                <Button variant="outline" className="w-full">
                  Продолжить покупки
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;