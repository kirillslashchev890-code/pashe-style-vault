import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";

// Mock данные - позже из БД
const allProducts = [
  {
    id: "1",
    name: "Пальто из шерсти",
    price: 24990,
    originalPrice: 32990,
    image: "https://images.unsplash.com/photo-1544923246-77307dd628b1?w=500&h=700&fit=crop",
    category: "Верхняя одежда",
    categoryId: "outerwear",
    isNew: true,
  },
  {
    id: "2",
    name: "Хлопковая рубашка",
    price: 5990,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=700&fit=crop",
    category: "Рубашки",
    categoryId: "shirts",
  },
  {
    id: "3",
    name: "Брюки чиносы",
    price: 7990,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=700&fit=crop",
    category: "Брюки",
    categoryId: "pants",
  },
  {
    id: "4",
    name: "Базовая футболка",
    price: 2990,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=700&fit=crop",
    category: "Футболки",
    categoryId: "tshirts",
    isNew: true,
  },
  {
    id: "5",
    name: "Кожаная куртка",
    price: 34990,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=700&fit=crop",
    category: "Верхняя одежда",
    categoryId: "outerwear",
  },
  {
    id: "6",
    name: "Льняная рубашка",
    price: 6990,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=700&fit=crop",
    category: "Рубашки",
    categoryId: "shirts",
    isNew: true,
  },
  {
    id: "7",
    name: "Классические брюки",
    price: 9990,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=700&fit=crop",
    category: "Брюки",
    categoryId: "pants",
  },
  {
    id: "8",
    name: "Футболка с принтом",
    price: 3490,
    originalPrice: 4990,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=700&fit=crop",
    category: "Футболки",
    categoryId: "tshirts",
  },
];

const categories = [
  { id: "all", name: "Все" },
  { id: "new", name: "Новинки" },
  { id: "outerwear", name: "Верхняя одежда" },
  { id: "shirts", name: "Рубашки" },
  { id: "pants", name: "Брюки" },
  { id: "tshirts", name: "Футболки" },
];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const selectedCategory = searchParams.get("category") || "all";

  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "new") return product.isNew;
    return product.categoryId === selectedCategory;
  });

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Каталог</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} товаров
          </p>
        </motion.div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Filter button */}
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal size={16} className="mr-2" />
            Фильтры
          </Button>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-card border border-border rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Фильтры</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Цена</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Размер</label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      className="px-3 py-1 bg-secondary border border-border rounded-lg text-sm hover:border-primary transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Сортировка</label>
                <button className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm flex items-center justify-between">
                  По популярности
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Товары не найдены
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Catalog;