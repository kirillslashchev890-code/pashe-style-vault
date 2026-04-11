import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Truck, Store, ArrowLeft, AlertTriangle, CreditCard, Banknote } from "lucide-react";
import { z } from "zod";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { useStockManager } from "@/hooks/useStockManager";
import { toast } from "sonner";
import { deliveryRegions, getDeliveryCost, getCitiesByRegion } from "@/data/deliveryRegions";
import { getProductById } from "@/data/products";

const phoneSchema = z.string().regex(/^8\d{10}$/, { message: "Введите номер в формате 8XXXXXXXXXX" });

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { createOrder, orders } = useOrders();
  const { user } = useAuth();
  const { decrementStock } = useStockManager();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "on-receive">("online");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const isFirstOrder = orders.length === 0;
  const discount = isFirstOrder ? Math.round(subtotal * 0.1) : 0;

  const regionInfo = selectedRegion ? getDeliveryCost(selectedRegion) : undefined;
  const availableCities = useMemo(() => getCitiesByRegion(selectedRegion), [selectedRegion]);
  const shipping = deliveryType === "pickup" ? 0 : (regionInfo?.cost || 0);
  const freeShippingThreshold = 15000;
  const isFreeShipping = deliveryType === "delivery" && subtotal >= freeShippingThreshold;
  const finalShipping = isFreeShipping ? 0 : shipping;
  const total = subtotal - discount + finalShipping;

  useEffect(() => {
    if (!user) navigate("/account");
    if (items.length === 0) navigate("/cart");
  }, [user, items, navigate]);

  useEffect(() => {
    if (!selectedRegion) { setSelectedCity(""); return; }
    if (selectedCity && !availableCities.includes(selectedCity)) setSelectedCity("");
  }, [selectedRegion, selectedCity, availableCities]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(price);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (!digits) { setPhone(""); return; }
    let normalized = digits;
    if (normalized.startsWith("7")) normalized = `8${normalized.slice(1)}`;
    if (!normalized.startsWith("8")) normalized = `8${normalized.slice(1)}`;
    setPhone(normalized.slice(0, 11));
  };

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
  };

  const handleCardExpiryChange = (value: string) => {
    let digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) digits = digits.slice(0, 2) + "/" + digits.slice(2);
    setCardExpiry(digits);
  };

  const parseMinDays = (days: string | undefined) => {
    if (!days) return 0;
    const match = days.match(/\d+/);
    return match ? Number(match[0]) : 0;
  };

  const handleSubmit = async () => {
    if (deliveryType === "delivery" && !selectedRegion) { toast.error("Выберите регион доставки"); return; }
    if (deliveryType === "delivery" && !selectedCity) { toast.error("Выберите город доставки"); return; }

    const safeStreet = street.trim().slice(0, 120);
    const safeApartment = apartment.trim().slice(0, 40);
    const safeNotes = notes.trim().slice(0, 500);

    if (deliveryType === "delivery" && safeStreet.length < 5) { toast.error("Введите корректный адрес (минимум 5 символов)"); return; }
    if (deliveryType === "delivery" && zip && zip.length !== 6) { toast.error("Индекс должен содержать 6 цифр"); return; }

    const parsedPhone = phoneSchema.safeParse(phone);
    if (!parsedPhone.success) { toast.error("Введите корректный номер телефона (11 цифр, начинается с 8)"); return; }

    if (paymentMethod === "online") {
      if (cardNumber.replace(/\s/g, "").length !== 16) { toast.error("Введите 16-значный номер карты"); return; }
      if (cardExpiry.length !== 5) { toast.error("Введите срок действия карты (MM/YY)"); return; }
      if (cardCvv.length !== 3) { toast.error("Введите 3-значный CVV"); return; }
    }

    setIsOrdering(true);

    const orderItems = items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      size: item.size,
      color_name: item.color_name || null,
      quantity: item.quantity,
      product_price: item.product_price,
    }));

    const minDays = parseMinDays(regionInfo?.days);
    const eta = new Date();
    eta.setDate(eta.getDate() + minDays);

    const shippingAddress = deliveryType === "pickup"
      ? {
          deliveryType: "pickup" as const,
          pickup_point: "Москва, ул. Тверская, 1",
          delivery_days: "Самовывоз — хранение 3 дня",
          eta_date: new Date().toISOString(),
          paymentMethod,
        }
      : {
          deliveryType: "delivery" as const,
          region: selectedRegion,
          city: selectedCity,
          street: safeStreet,
          apartment: safeApartment || undefined,
          entrance: entrance || undefined,
          floor: floor || undefined,
          zip: zip || undefined,
          delivery_days: regionInfo?.days,
          eta_date: eta.toISOString(),
          paymentMethod,
        };

    const { error } = await createOrder(orderItems, total, {
      phone: parsedPhone.data,
      notes: safeNotes || undefined,
      shippingAddress,
    });

    if (error) { toast.error("Ошибка при оформлении заказа"); setIsOrdering(false); return; }

    for (const item of items) {
      const fallbackColor = item.color_name || getProductById(item.product_id)?.colors[0]?.name || "Базовый";
      await decrementStock(item.product_id, item.size, fallbackColor, item.quantity);
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
                <button onClick={() => setDeliveryType("delivery")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${deliveryType === "delivery" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                  <Truck size={24} className={deliveryType === "delivery" ? "text-primary" : "text-muted-foreground"} />
                  <div className="text-left"><p className="font-medium">Доставка</p><p className="text-xs text-muted-foreground">По России, 500-2000 ₽</p></div>
                </button>
                <button onClick={() => setDeliveryType("pickup")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${deliveryType === "pickup" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                  <Store size={24} className={deliveryType === "pickup" ? "text-primary" : "text-muted-foreground"} />
                  <div className="text-left"><p className="font-medium">Самовывоз</p><p className="text-xs text-muted-foreground">Бесплатно</p></div>
                </button>
              </div>
            </div>

            {deliveryType === "delivery" ? (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-lg mb-4">Адрес доставки</h2>
                <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  <AlertTriangle size={16} className="shrink-0" />
                  Доставка осуществляется только по территории России.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label>Регион</Label>
                    <select value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setSelectedCity(""); }}
                      className="w-full mt-1.5 h-12 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Выберите регион</option>
                      {deliveryRegions.map((r) => (<option key={r.name} value={r.name}>{r.name} — {r.cost} ₽ ({r.days})</option>))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Город</Label>
                    <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedRegion}
                      className="w-full mt-1.5 h-12 px-3 bg-background border border-border rounded-lg text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Выберите город</option>
                      {availableCities.map((city) => (<option key={city} value={city}>{city}</option>))}
                    </select>
                  </div>
                  <div>
                    <Label>Индекс</Label>
                    <Input value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="101000" className="mt-1.5 h-12" maxLength={6} />
                  </div>
                  <div>
                    <Label>Улица, дом</Label>
                    <Input value={street} onChange={(e) => setStreet(e.target.value.slice(0, 120))} placeholder="ул. Тверская, д. 1" className="mt-1.5 h-12" maxLength={120} />
                  </div>
                  <div>
                    <Label>Квартира / офис</Label>
                    <Input value={apartment} onChange={(e) => setApartment(e.target.value.slice(0, 40))} placeholder="кв. 10" className="mt-1.5 h-12" maxLength={40} />
                  </div>
                  <div>
                    <Label>Подъезд</Label>
                    <Input value={entrance} onChange={(e) => setEntrance(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="1" className="mt-1.5 h-12" maxLength={3} />
                  </div>
                  <div>
                    <Label>Этаж</Label>
                    <Input value={floor} onChange={(e) => setFloor(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="5" className="mt-1.5 h-12" maxLength={3} />
                  </div>
                </div>
                {regionInfo && (
                  <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-sm">
                    <p>📦 Доставка в <strong>{regionInfo.name}</strong>{selectedCity ? `, ${selectedCity}` : ""}: <strong>{isFreeShipping ? "Бесплатно" : `${regionInfo.cost} ₽`}</strong></p>
                    <p className="text-muted-foreground">Срок: {regionInfo.days}</p>
                    {!isFreeShipping && subtotal < freeShippingThreshold && (
                      <p className="text-primary mt-1">Бесплатная доставка при заказе от {formatPrice(freeShippingThreshold)}</p>
                    )}
                  </div>
                )}
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
                <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
                  <AlertTriangle size={14} className="text-destructive shrink-0" />
                  Хранение товара — 3 дня. После истечения срока заказ будет автоматически отменён.
                </p>
              </div>
            )}

            {/* Payment method */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">Способ оплаты</h2>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setPaymentMethod("online")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${paymentMethod === "online" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                  <CreditCard size={24} className={paymentMethod === "online" ? "text-primary" : "text-muted-foreground"} />
                  <div className="text-left"><p className="font-medium">Картой онлайн</p><p className="text-xs text-muted-foreground">Visa, Mastercard, Мир</p></div>
                </button>
                <button onClick={() => setPaymentMethod("on-receive")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${paymentMethod === "on-receive" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                  <Banknote size={24} className={paymentMethod === "on-receive" ? "text-primary" : "text-muted-foreground"} />
                  <div className="text-left"><p className="font-medium">При получении</p><p className="text-xs text-muted-foreground">Наличные или карта</p></div>
                </button>
              </div>

              {paymentMethod === "online" && (
                <div className="mt-4 space-y-3">
                  <div>
                    <Label>Номер карты</Label>
                    <Input value={cardNumber} onChange={(e) => handleCardNumberChange(e.target.value)} placeholder="0000 0000 0000 0000" className="mt-1.5 h-12" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Срок действия</Label>
                      <Input value={cardExpiry} onChange={(e) => handleCardExpiryChange(e.target.value)} placeholder="MM/YY" className="mt-1.5 h-12" maxLength={5} />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="•••" className="mt-1.5 h-12" maxLength={3} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">🔒 Данные карты не сохраняются (демо-режим)</p>
                </div>
              )}
            </div>

            {/* Contact info */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">Контактные данные</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Телефон</Label>
                  <Input value={phone} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="89627923580" className="mt-1.5 h-12" maxLength={11} />
                  <p className="text-xs text-muted-foreground mt-1">11 цифр, начиная с 8</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled className="mt-1.5 h-12" />
                </div>
              </div>
              <div className="mt-4">
                <Label>Комментарий к заказу</Label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                  className="w-full mt-1.5 bg-background border border-border rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Пожелания по доставке..." maxLength={500} />
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
                      <p className="text-xs text-muted-foreground">{item.size}{item.color_name ? ` • ${item.color_name}` : ""} × {item.quantity}</p>
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
                  <span>{finalShipping === 0 ? "Бесплатно" : formatPrice(finalShipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Оплата</span>
                  <span>{paymentMethod === "online" ? "Картой онлайн" : "При получении"}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                  <span>Итого</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button className="w-full btn-gold py-6 mt-6" onClick={handleSubmit} disabled={isOrdering}>
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
