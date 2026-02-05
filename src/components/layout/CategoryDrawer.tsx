import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  {
    id: "outerwear",
    name: "Верхняя одежда",
    subcategories: [
      { id: "jackets-summer", name: "Летние куртки" },
      { id: "jackets-autumn", name: "Осенние куртки" },
      { id: "jackets-winter", name: "Зимние куртки" },
      { id: "coats", name: "Пальто" },
      { id: "down-jackets", name: "Пуховики" },
      { id: "vests", name: "Жилеты" },
    ],
  },
  {
    id: "tshirts",
    name: "Футболки",
    subcategories: [
      { id: "basic-tshirts", name: "Базовые" },
      { id: "print-tshirts", name: "С принтом" },
      { id: "oversized-tshirts", name: "Оверсайз" },
    ],
  },
  {
    id: "polo",
    name: "Поло",
    subcategories: [
      { id: "classic-polo", name: "Классические" },
      { id: "sport-polo", name: "Спортивные" },
    ],
  },
  {
    id: "shirts",
    name: "Рубашки",
    subcategories: [
      { id: "classic-shirts", name: "Классические" },
      { id: "casual-shirts", name: "Casual" },
      { id: "linen-shirts", name: "Льняные" },
    ],
  },
  {
    id: "tanks",
    name: "Майки",
    subcategories: [],
  },
  {
    id: "hoodies",
    name: "Кофты и худи",
    subcategories: [
      { id: "hoodies", name: "Худи" },
      { id: "cardigans", name: "Кардиганы" },
      { id: "zip-hoodies", name: "Толстовки на молнии" },
    ],
  },
  {
    id: "sweatshirts",
    name: "Свитшоты",
    subcategories: [
      { id: "basic-sweatshirts", name: "Базовые" },
      { id: "print-sweatshirts", name: "С принтом" },
    ],
  },
  {
    id: "sweaters",
    name: "Свитеры",
    subcategories: [
      { id: "wool-sweaters", name: "Шерстяные" },
      { id: "cotton-sweaters", name: "Хлопковые" },
    ],
  },
  {
    id: "pants",
    name: "Брюки",
    subcategories: [
      { id: "classic-pants", name: "Классические" },
      { id: "chinos", name: "Чиносы" },
      { id: "joggers", name: "Джоггеры" },
    ],
  },
  {
    id: "jeans",
    name: "Джинсы",
    subcategories: [
      { id: "slim-jeans", name: "Slim Fit" },
      { id: "straight-jeans", name: "Straight Fit" },
      { id: "relaxed-jeans", name: "Relaxed Fit" },
    ],
  },
  {
    id: "shorts",
    name: "Шорты",
    subcategories: [
      { id: "casual-shorts", name: "Casual" },
      { id: "sport-shorts", name: "Спортивные" },
      { id: "denim-shorts", name: "Джинсовые" },
    ],
  },
  {
    id: "suits",
    name: "Костюмы",
    subcategories: [
      { id: "business-suits", name: "Деловые" },
      { id: "casual-suits", name: "Повседневные" },
      { id: "wedding-suits", name: "Свадебные" },
    ],
  },
  {
    id: "shoes",
    name: "Обувь",
    subcategories: [
      { id: "sneakers", name: "Кроссовки" },
      { id: "boots", name: "Ботинки" },
      { id: "loafers", name: "Лоферы" },
      { id: "sandals", name: "Сандалии" },
    ],
  },
  {
    id: "caps",
    name: "Кепки и шляпы",
    subcategories: [
      { id: "baseball-caps", name: "Бейсболки" },
      { id: "beanies", name: "Шапки" },
      { id: "panama-hats", name: "Панамы" },
    ],
  },
  {
    id: "accessories",
    name: "Аксессуары",
    subcategories: [
      { id: "belts", name: "Ремни" },
      { id: "bags", name: "Сумки" },
      { id: "wallets", name: "Кошельки" },
      { id: "watches", name: "Часы" },
      { id: "sunglasses", name: "Очки" },
      { id: "scarves", name: "Шарфы" },
    ],
  },
];

const brands = [
  "PASHE Original",
  "Premium Line",
  "Sport Collection",
  "Urban Style",
  "Classic Edition",
];

const seasons = [
  { id: "spring", name: "Весна" },
  { id: "summer", name: "Лето" },
  { id: "autumn", name: "Осень" },
  { id: "winter", name: "Зима" },
];

const CategoryDrawer = ({ isOpen, onClose }: CategoryDrawerProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(["categories"]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[340px] sm:w-[400px] p-0 bg-background border-r border-border">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-xl font-bold text-gradient-gold">Меню</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4">
            {/* Categories Section */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection("categories")}
                className="w-full flex items-center justify-between py-3 text-lg font-semibold text-foreground"
              >
                Категории
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    expandedSections.includes("categories") ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {expandedSections.includes("categories") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 mt-2">
                      {categories.map((category) => (
                        <div key={category.id}>
                          {category.subcategories.length > 0 ? (
                            <>
                              <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between py-2.5 px-3 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                              >
                                <span>{category.name}</span>
                                <ChevronRight
                                  size={16}
                                  className={`transition-transform ${
                                    expandedCategories.includes(category.id) ? "rotate-90" : ""
                                  }`}
                                />
                              </button>
                              
                              <AnimatePresence>
                                {expandedCategories.includes(category.id) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pl-4 space-y-1 mt-1 mb-2">
                                      <Link
                                        to={`/catalog?category=${category.id}`}
                                        onClick={onClose}
                                        className="block py-2 px-3 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                      >
                                        Все {category.name.toLowerCase()}
                                      </Link>
                                      {category.subcategories.map((sub) => (
                                        <Link
                                          key={sub.id}
                                          to={`/catalog?category=${sub.id}`}
                                          onClick={onClose}
                                          className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                                        >
                                          {sub.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          ) : (
                            <Link
                              to={`/catalog?category=${category.id}`}
                              onClick={onClose}
                              className="block py-2.5 px-3 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                            >
                              {category.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Seasons Section */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection("seasons")}
                className="w-full flex items-center justify-between py-3 text-lg font-semibold text-foreground"
              >
                Сезон
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    expandedSections.includes("seasons") ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {expandedSections.includes("seasons") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 mt-2">
                      {seasons.map((season) => (
                        <Link
                          key={season.id}
                          to={`/catalog?season=${season.id}`}
                          onClick={onClose}
                          className="px-4 py-2 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full text-sm transition-colors"
                        >
                          {season.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Brands Section */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection("brands")}
                className="w-full flex items-center justify-between py-3 text-lg font-semibold text-foreground"
              >
                Бренды
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    expandedSections.includes("brands") ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {expandedSections.includes("brands") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 mt-2">
                      {brands.map((brand) => (
                        <Link
                          key={brand}
                          to={`/catalog?brand=${encodeURIComponent(brand)}`}
                          onClick={onClose}
                          className="block py-2.5 px-3 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Special Links */}
            <div className="border-t border-border pt-4 space-y-1">
              <Link
                to="/catalog?category=new"
                onClick={onClose}
                className="flex items-center gap-2 py-3 px-3 text-primary font-medium hover:bg-primary/10 rounded-lg transition-colors"
              >
                ✨ Новинки
              </Link>
              <Link
                to="/catalog?category=sale"
                onClick={onClose}
                className="flex items-center gap-2 py-3 px-3 text-destructive font-medium hover:bg-destructive/10 rounded-lg transition-colors"
              >
                🔥 Sale
              </Link>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CategoryDrawer;
