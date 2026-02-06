import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { searchProducts, Product } from "@/data/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const searchResults = searchProducts(query);
      setResults(searchResults.slice(0, 10)); // Показываем максимум 10 результатов
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl mx-auto mt-20 bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="relative border-b border-border">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Поиск товаров..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-12 border-0 bg-transparent text-lg focus-visible:ring-0"
            />
            {isSearching ? (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" size={20} />
            ) : (
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.trim() && !isSearching && results.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p>По запросу "{query}" ничего не найдено</p>
                <p className="text-sm mt-2">Попробуйте изменить запрос</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <p className="font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground text-sm line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
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
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 rounded-full bg-secondary text-sm hover:bg-secondary/80 transition-colors"
                    >
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
