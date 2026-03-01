import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Truck, Store, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { createOrder, orders } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const isFirstOrder = orders.length === 0;
  const discount = isFirstOrder ? Math.round(subtotal * 0.1) : 0;
  const shipping = deliveryType === "pickup" ? 0 : subtotal >= 10000 ? 0 : 500;
  const total = subtotal - discount + shipping;

  useEffect(() => {
    if (!user) navigate("/account");
    if (items.length === 0) navigate("/cart");
  }, [user, items]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(price);

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);
  };

  const handleSubmit = async () => {
    if (deliveryType === "delivery" && (!city.trim() || !street.trim())) {
      toast.error("Заполните адрес доставки");
      return;
    }
    if (!phone || phone.length !== 11) {
      toast.error("Введите корректный номер телефона (11 цифр)");
      return;
    }

    setIsOrdering(true);

    const orderItems = items.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      size: item.size,
      color_name: item.color_name || null,
      quantity: item.quantity,
      product_price: item.product_price,
    }));

    const { error } = await createOrder(orderItems, total);
    if (error) {
      toast.error("Ошибка при оформлении заказа");
      setIsOrdering(false);
      return;
    }

    await clearCart();
    toast.success("Заказ успешно оформлен! 🎉");
    setIsOrdering(false);
    navigate("/account");
  };

  if (items.length === 0) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <button onClick={() => navigate("/cart")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={18} /> Назад в корзину
        </button>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-8">
          Оформление заказа
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery type */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">Способ получения</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryType("delivery")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                    deliveryType === "delivery" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Truck size={24} className={deliveryType === "delivery" ? "text-primary" : "text-muted-foreground"} />
                  <div className="text-left">
                    <p className="font-medium">Доставка</p>
                    <p className="text-xs text-muted-foreground">{subtotal >= 10000 ? "Бесплатно" : "500 ₽"}</p>
                  </div>
                </button>
                <button
                  onClick={() => setDeliveryType("pickup")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                    deliveryType === "pickup" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Store size={24} className={deliveryType === "pickup" ? "text-primary" : "text-muted-foreground"} />
                  <div className="text-left">
                    <p className="font-medium">Самовывоз</p>
                    <p className="text-xs text-muted-foreground">Бесплатно</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Address */}
            {deliveryType === "delivery" ? (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-lg mb-4">Адрес доставки</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Город</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Москва" className="mt-1.5 h-12" />
                  </div>
                  <div>
                    <Label>Индекс</Label>
                    <Input value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="101000" className="mt-1.5 h-12" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Улица, дом</Label>
                    <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="ул. Тверская, д. 1" className="mt-1.5 h-12" />
                  </div>
                  <div>
                    <Label>Квартира / офис</Label>
                    <Input value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="кв. 10" className="mt-1.5 h-12" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-lg mb-4">Пункт самовывоза</h2>
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                  <Store size={20} className="text-primary" />
                  <div>
                    <p className="font-medium">Москва, ул. Тверская, 1</p>
                    <p className="text-sm text-muted-foreground">Пн-Вс: 10:00 - 22:00</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">Контактные данные</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Телефон</Label>
                  <Input
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="89627923580"
                    className="mt-1.5 h-12"
                    maxLength={11}
                  />
                  <p className="text-xs text-muted-foreground mt-1">11 цифр, начиная с 8</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled className="mt-1.5 h-12" />
                </div>
              </div>
              <div className="mt-4">
                <Label>Комментарий к заказу</Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-1.5 bg-background border border-border rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Пожелания по доставке..."
                  maxLength={500}
                />
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Ваш заказ</h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.product_image} alt={item.product_name} className="w-14 h-18 object-cover rounded-lg bg-secondary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">{item.size} × {item.quantity}</p>
                      <p className="text-sm font-semibold">{formatPrice(item.product_price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Товары ({items.length})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {isFirstOrder && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>🎉 Скидка первый заказ -10%</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доставка</span>
                  <span>{shipping === 0 ? "Бесплатно" : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                  <span>Итого</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button
                className="w-full btn-gold py-6 mt-6"
                onClick={handleSubmit}
                disabled={isOrdering}
              >
                {isOrdering ? "Оформление..." : `Оформить заказ • ${formatPrice(total)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
