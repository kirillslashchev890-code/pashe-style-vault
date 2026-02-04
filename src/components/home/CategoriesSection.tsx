import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const categories = [
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
    description: "Чиносы, джинсы, классика",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop",
  },
  {
    id: "tshirts",
    name: "Футболки",
    description: "Базовые и принтованные",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Категории</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Выберите категорию и найдите идеальные вещи для вашего гардероба
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
      </div>
    </section>
  );
};

export default CategoriesSection;