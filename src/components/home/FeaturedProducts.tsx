import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";

// Mock данные - позже будут из базы данных
const featuredProducts = [
  {
    id: "1",
    name: "Пальто из шерсти",
    price: 24990,
    originalPrice: 32990,
    image: "https://images.unsplash.com/photo-1544923246-77307dd628b1?w=500&h=700&fit=crop",
    category: "Верхняя одежда",
    isNew: true,
  },
  {
    id: "2",
    name: "Хлопковая рубашка",
    price: 5990,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=700&fit=crop",
    category: "Рубашки",
  },
  {
    id: "3",
    name: "Брюки чиносы",
    price: 7990,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=700&fit=crop",
    category: "Брюки",
  },
  {
    id: "4",
    name: "Базовая футболка",
    price: 2990,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=700&fit=crop",
    category: "Футболки",
    isNew: true,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Популярное</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Самые востребованные товары этого сезона
            </p>
          </div>
          <Link
            to="/catalog"
            className="mt-4 md:mt-0 text-primary hover:text-accent font-medium transition-colors"
          >
            Смотреть все →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;