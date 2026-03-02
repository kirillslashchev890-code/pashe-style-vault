import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { searchProducts, Product } from "@/data/products";

// Маппинг поисковых терминов на категории каталога
const categorySearchMap: Record<string, string> = {
  "футболки": "tshirts", "футболка": "tshirts", "футболку": "tshirts",
  "джинсы": "jeans", "джинс": "jeans",
  "куртки": "outerwear", "куртка": "outerwear", "куртку": "outerwear", "верхняя одежда": "outerwear", "пуховик": "outerwear", "бомбер": "outerwear",
  "рубашки": "shirts", "рубашка": "shirts", "рубашку": "shirts",
  "брюки": "pants", "штаны": "pants",
  "шорты": "shorts",
  "свитшоты": "sweatshirts", "свитшот": "sweatshirts", "толстовка": "sweatshirts", "толстовки": "sweatshirts",
  "поло": "polo",
  "обувь": "shoes", "кроссовки": "shoes", "ботинки": "shoes", "кеды": "shoes",
  "костюмы": "suits", "костюм": "suits",
  "аксессуары": "accessories", "сумка": "accessories", "ремень": "accessories",
  "кепки": "caps", "кепка": "caps", "шапка": "caps", "панама": "caps",
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [categoryMatch, setCategoryMatch] = useState<{ name: string; slug: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setCategoryMatch(null); return; }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const q = query.toLowerCase().trim();
      
      // Check if query matches a category
      const matchedCategory = categorySearchMap[q];
      if (matchedCategory) {
        const categoryNames: Record<string, string> = {
          tshirts: "Футболки", outerwear: "Верхняя одежда", shirts: "Рубашки",
          pants: "Брюки", jeans: "Джинсы", shorts: "Шорты", sweatshirts: "Свитшоты",
          polo: "Поло", shoes: "Обувь", suits: "Костюмы", accessories: "Аксессуары", caps: "Кепки",
        };
        setCategoryMatch({ name: categoryNames[matchedCategory] || matchedCategory, slug: matchedCategory });
      } else {
        setCategoryMatch(null);
      }

      const searchResults = searchProducts(query);
      setResults(searchResults.slice(0, 10));
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) { window.addEventListener("keydown", handleKeyDown); document.body.style.overflow = "hidden"; }
    return () => { window.removeEventListener("keydown", handleKeyDown); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(price);

  const handleResultClick = () => { setQuery(""); setResults([]); setCategoryMatch(null); onClose(); };

  const handleCategoryClick = (slug: string) => {
    setQuery(""); setResults([]); setCategoryMatch(null); onClose();
    navigate(`/catalog?category=${slug}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl mx-auto mt-20 bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          <div className="relative border-b border-border">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input ref={inputRef} type="text" placeholder="Поиск товаров или категорий..."
              value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-12 border-0 bg-transparent text-lg focus-visible:ring-0" />
            {isSearching ? (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" size={20} />
            ) : (
              <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {/* Category match */}
            {categoryMatch && (
              <div className="p-3 border-b border-border">
                <button onClick={() => handleCategoryClick(categoryMatch.slug)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors">
                  <Search size={18} className="text-primary" />
                  <span className="font-medium">Перейти в категорию: <span className="text-primary">{categoryMatch.name}</span></span>
                </button>
              </div>
            )}

            {query.trim() && !isSearching && results.length === 0 && !categoryMatch && (
              <div className="p-8 text-center text-muted-foreground">
                <p>По запросу "{query}" ничего не найдено</p>
                <p className="text-sm mt-2">Попробуйте изменить запрос</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2">
                {results.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} onClick={handleResultClick}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary transition-colors">
                    <img src={product.images[0]} alt={product.name} className="w-16 h-20 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <p className="font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground text-sm line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!query.trim() && (
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4">Популярные запросы</p>
                <div className="flex flex-wrap gap-2">
                  {["Футболки", "Джинсы", "Куртки", "Обувь", "Костюмы"].map((term) => (
                    <button key={term} onClick={() => setQuery(term)}
                      className="px-4 py-2 rounded-full bg-secondary text-sm hover:bg-secondary/80 transition-colors">
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchModal;
