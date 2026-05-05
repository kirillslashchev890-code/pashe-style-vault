import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle2, XCircle, CreditCard } from "lucide-react";

const Returns = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Возврат и обмен</h1>
        <p className="text-muted-foreground mb-12">У вас есть 14 дней, чтобы вернуть товар без объяснения причин.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { icon: RotateCcw, title: "14 дней на возврат", desc: "С момента получения заказа." },
            { icon: CreditCard, title: "Возврат денег", desc: "На ту же карту в течение 3–10 рабочих дней." },
            { icon: CheckCircle2, title: "Что можно вернуть", desc: "Товар в оригинальной упаковке, без следов носки, с бирками." },
            { icon: XCircle, title: "Что нельзя вернуть", desc: "Нижнее бельё, носки, парфюмерию и аксессуары личной гигиены." },
          ].map((i) => (
            <div key={i.title} className="bg-card border border-border rounded-2xl p-6">
              <i.icon className="text-primary mb-3" size={28} />
              <h3 className="font-semibold mb-2">{i.title}</h3>
              <p className="text-sm text-muted-foreground">{i.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Как оформить возврат</h2>
            <ol className="text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Напишите нам на info@pashe.ru или в чат на сайте.</li>
              <li>Получите бланк возврата и инструкцию.</li>
              <li>Отправьте товар через любую транспортную компанию.</li>
              <li>После проверки мы вернём деньги тем же способом, что и оплата.</li>
            </ol>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Обмен</h2>
            <p className="text-muted-foreground">Если товар не подошёл по размеру, мы обменяем его бесплатно при условии наличия нужного варианта на складе.</p>
          </section>
        </div>
      </motion.div>
    </div>
  </Layout>
);

export default Returns;
