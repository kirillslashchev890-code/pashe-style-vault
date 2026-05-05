import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Truck, Package, Clock, MapPin } from "lucide-react";

const Delivery = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Доставка</h1>
        <p className="text-muted-foreground mb-12">Привезём ваш заказ быстро и аккуратно по всей России.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { icon: Truck, title: "Курьерская доставка", desc: "По Москве — от 1 дня, по России — 2–7 дней. Стоимость рассчитывается на оформлении." },
            { icon: Package, title: "Пункты выдачи", desc: "Более 15 000 ПВЗ по всей стране — СДЭК, Boxberry, Почта России." },
            { icon: Clock, title: "Сроки", desc: "Заказы, оформленные до 16:00, отправляем в тот же день." },
            { icon: MapPin, title: "Самовывоз", desc: "Бесплатно из шоурума: Москва, ул. Тверская, 1. Ежедневно 10:00–22:00." },
          ].map((item) => (
            <div key={item.title} className="bg-card border border-border rounded-2xl p-6">
              <item.icon className="text-primary mb-3" size={28} />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Стоимость доставки</h2>
            <ul className="text-muted-foreground space-y-2">
              <li>• Москва в пределах МКАД — от 350 ₽</li>
              <li>• Московская область — от 500 ₽</li>
              <li>• Регионы России — от 450 ₽ (рассчитывается по тарифам перевозчика)</li>
              <li>• <span className="text-foreground font-medium">Бесплатно</span> при заказе от 10 000 ₽</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Оплата</h2>
            <p className="text-muted-foreground">Доступна оплата картой онлайн, при получении (наличными или картой курьеру) и через СБП.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Отслеживание</h2>
            <p className="text-muted-foreground">После отправки вы получите трек-номер на e-mail и в личном кабинете.</p>
          </section>
        </div>
      </motion.div>
    </div>
  </Layout>
);

export default Delivery;
