import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: "tshirts",
    name: "Футболки",
    description: "Базовые и с принтом",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
  },
  {
    id: "outerwear",
    name: "Верхняя одежда",
    description: "Куртки, пальто, пуховики",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
  },
  {
    id: "shirts",
    name: "Рубашки",
    description: "Классические и casual",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop",
  },
  {
    id: "pants",
    name: "Брюки",
    description: "Чиносы, джоггеры, классика",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop",
  },
  {
    id: "jeans",
    name: "Джинсы",
    description: "Slim, straight, relaxed",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
  },
  {
    id: "shorts",
    name: "Шорты",
    description: "Casual и спортивные",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=800&fit=crop",
  },
  {
    id: "sweatshirts",
    name: "Свитшоты",
    description: "Базовые и с принтом",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop",
  },
  {
    id: "polo",
    name: "Поло",
    description: "Классика стиля",
    image: "https://images.unsplash.com/photo-1625910513413-5fc41ef81b18?w=600&h=800&fit=crop",
  },
  {
    id: "shoes",
    name: "Обувь",
    description: "Кроссовки, ботинки, лоферы",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
  },
  {
    id: "suits",
    name: "Костюмы",
    description: "Деловые и повседневные",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
  },
  {
    id: "accessories",
    name: "Аксессуары",
    description: "Ремни, сумки, кошельки",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
  },
  {
    id: "caps",
    name: "Кепки",
    description: "Бейсболки, шапки, панамы",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop",
  },
];

const CategoriesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Категории</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Выберите категорию и найдите идеальные вещи для вашего гардероба
            </p>
          </div>
          
          {/* Scroll buttons */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </motion.div>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex-shrink-0 w-[280px] snap-start"
            >
              <Link
                to={`/catalog?category=${category.id}`}
                className="group block relative aspect-[3/4] rounded-2xl overflow-hidden hover-lift"
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <p className="text-center text-muted-foreground text-sm mt-4 md:hidden">
          ← Листайте для просмотра →
        </p>
      </div>
    </section>
  );
};

export default CategoriesSection;
