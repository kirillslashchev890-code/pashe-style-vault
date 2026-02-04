import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import VideoSection from "@/components/home/VideoSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { motion } from "framer-motion";
import { ArrowRight, Truck, RefreshCw, Shield, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Truck,
    title: "Бесплатная доставка",
    description: "При заказе от 10 000 ₽",
  },
  {
    icon: RefreshCw,
    title: "Возврат 30 дней",
    description: "Простой обмен и возврат",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Только оригинальные товары",
  },
  {
    icon: Headphones,
    title: "Поддержка 24/7",
    description: "Всегда на связи",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <HeroSection />

      {/* Video Block с овальным квадратом */}
      <VideoSection />

      {/* Categories */}
      <CategoriesSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Features */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Будьте в курсе новинок
            </h2>
            <p className="text-muted-foreground mb-8">
              Подпишитесь на рассылку и получите скидку 10% на первый заказ
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="btn-gold px-6 py-3">
                Подписаться
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;