import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Instagram, Send } from "lucide-react";

const Contacts = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Контакты</h1>
        <p className="text-muted-foreground mb-12">Свяжитесь с нами любым удобным способом — мы всегда на связи.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { icon: Phone, title: "Телефон", value: "+7 (999) 123-45-67", href: "tel:+79991234567" },
            { icon: Mail, title: "E-mail", value: "info@pashe.ru", href: "mailto:info@pashe.ru" },
            { icon: MapPin, title: "Шоурум", value: "Москва, ул. Тверская, 1" },
            { icon: Clock, title: "График работы", value: "Ежедневно 10:00 – 22:00" },
          ].map((c) => (
            <a
              key={c.title}
              href={c.href ?? "#"}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-colors"
            >
              <c.icon className="text-primary mb-3" size={28} />
              <h3 className="font-semibold mb-1">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.value}</p>
            </a>
          ))}
        </div>

        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Мы в соцсетях</h2>
          <div className="flex gap-3">
            <a href="#" className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
              <Send size={20} />
            </a>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Реквизиты</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>ИП Слащев К.А.</p>
            <p>ИНН: 770000000000</p>
            <p>ОГРНИП: 000000000000000</p>
          </div>
        </section>
      </motion.div>
    </div>
  </Layout>
);

export default Contacts;
