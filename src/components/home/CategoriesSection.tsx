import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import trendsHero from "@/assets/trends-hero.jpg";

const categories = [
  { id: "tshirts", name: "Футболки", tag: "Тренд: оверсайз", image: "/images/categories/tshirts.jpg" },
  { id: "outerwear", name: "Верхняя одежда", tag: "Новинка", image: "/images/categories/outerwear.jpg" },
  { id: "shirts", name: "Рубашки", tag: "Базовое", image: "/images/categories/shirts.jpg" },
  { id: "pants", name: "Брюки", tag: "Тренд: wide leg", image: "/images/categories/pants.jpg" },
  { id: "jeans", name: "Джинсы", tag: "Новинка", image: "/images/categories/jeans.jpg" },
  { id: "shorts", name: "Шорты", tag: "Лето", image: "/images/categories/shorts.jpg" },
  { id: "sweatshirts", name: "Свитшоты", tag: "Тренд", image: "/images/categories/sweatshirts.jpg" },
  { id: "polo", name: "Поло", tag: "Классика", image: "/images/categories/polo.jpg" },
  { id: "shoes", name: "Обувь", tag: "Бестселлер", image: "/images/categories/shoes.jpg" },
  { id: "suits", name: "Костюмы", tag: "Премиум", image: "/images/categories/suits.jpg" },
  { id: "accessories", name: "Аксессуары", tag: "Детали", image: "/images/categories/accessories.jpg" },
  { id: "caps", name: "Кепки", tag: "Стрит", image: "/images/categories/caps.jpg" },
];

const CategoriesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container mx-auto px-4">
        {/* Trend hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden mb-8 aspect-[16/7] md:aspect-[21/8]"
        >
          <img src={trendsHero} alt="Гид по трендам" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-14 max-w-xl">
            <p className="text-primary text-xs uppercase tracking-[0.3em] mb-3">SS&apos;26</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-none mb-4">Гид<br />по трендам</h2>
            <p className="text-foreground/70 mb-6 max-w-md">Главные образы сезона — от базовых до экспериментальных.</p>
            <Link to="/catalog">
              <Button className="btn-gold w-fit">Смотреть подборку</Button>
            </Link>
          </div>
        </motion.div>

        {/* Mini categories carousel — Zara-like */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Категории</h3>
            <p className="text-muted-foreground text-sm mt-1">Выберите свой стиль</p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="rounded-full">
              <ChevronLeft size={18} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="rounded-full">
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="flex-shrink-0 w-[160px] md:w-[200px] snap-start"
            >
              <Link to={`/catalog?category=${category.id}`} className="group block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] uppercase tracking-wider bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded">
                      {category.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{category.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
