import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { getManagedProducts } from "@/data/products";
import { useStockManager } from "@/hooks/useStockManager";

const categories = [
  { id: "all", name: "Все" },
  { id: "new", name: "Новинки" },
  { id: "sale", name: "Sale" },
  { id: "tshirts", name: "Футболки" },
  { id: "outerwear", name: "Верхняя одежда" },
  { id: "shirts", name: "Рубашки" },
  { id: "pants", name: "Брюки" },
  { id: "jeans", name: "Джинсы" },
  { id: "shorts", name: "Шорты" },
  { id: "sweatshirts", name: "Свитшоты" },
  { id: "polo", name: "Поло" },
  { id: "shoes", name: "Обувь" },
  { id: "suits", name: "Костюмы" },
  { id: "accessories", name: "Аксессуары" },
  { id: "caps", name: "Кепки" },
];

const seasons = [
  { id: "all", name: "Все сезоны" },
  { id: "spring", name: "Весна" },
  { id: "summer", name: "Лето" },
  { id: "autumn", name: "Осень" },
  { id: "winter", name: "Зима" },
];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "new">("popular");
  const { getLowStock } = useStockManager();

  const selectedCategory = searchParams.get("category") || "all";
  const selectedSeason = searchParams.get("season") || "all";
  const selectedBrand = searchParams.get("brand") || "";

  const filteredProducts = useMemo(() => {
    const allProducts = getManagedProducts();

    const filtered = allProducts.filter((product) => {
      if (selectedCategory !== "all") {
        if (selectedCategory === "new") {
          if (!product.isNew) return false;
        } else if (selectedCategory === "sale") {
          if (!product.isSale) return false;
        } else if (product.category !== selectedCategory && product.subcategory !== selectedCategory) {
          return false;
        }
      }

      if (selectedBrand && product.brand !== selectedBrand) return false;

      if (priceFrom && product.price < Number(priceFrom)) return false;
      if (priceTo && product.price > Number(priceTo)) return false;

      if (selectedSizes.length > 0) {
        const hasSize = product.sizes.some((s) => selectedSizes.includes(s.name) && s.available);
        if (!hasSize) return false;
      }

      if (selectedSeason !== "all" && product.season !== selectedSeason && product.season !== "all") {
        return false;
      }

      return true;
    });

    if (sortBy === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === "new") return [...filtered].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));

    return filtered;
  }, [selectedCategory, selectedBrand, priceFrom, priceTo, selectedSizes, selectedSeason, sortBy]);

  const handleCategoryChange = (categoryId: string) => {
    const next = new URLSearchParams(searchParams);
    if (categoryId === "all") next.delete("category");
    else next.set("category", categoryId);
    setSearchParams(next);
  };

  const handleSeasonChange = (seasonId: string) => {
    const next = new URLSearchParams(searchParams);
    if (seasonId === "all") next.delete("season");
    else next.set("season", seasonId);
    setSearchParams(next);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setPriceFrom("");
    setPriceTo("");
    setSelectedSizes([]);
    setSortBy("popular");

    const next = new URLSearchParams(searchParams);
    next.delete("season");
    next.delete("brand");
    setSearchParams(next);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Каталог</h1>
          <p className="text-muted-foreground">{filteredProducts.length} товаров</p>
          {(selectedBrand || selectedSeason !== "all") && (
            <p className="text-sm text-muted-foreground mt-2">
              {selectedBrand ? `Бренд: ${selectedBrand}` : ""}
              {selectedBrand && selectedSeason !== "all" ? " • " : ""}
              {selectedSeason !== "all" ? `Сезон: ${seasons.find((s) => s.id === selectedSeason)?.name}` : ""}
            </p>
          )}
        </motion.div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <Button variant="outline" className="ml-auto" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <SlidersHorizontal size={16} className="mr-2" /> Фильтры
          </Button>
        </div>

        {isFilterOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card border border-border rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Фильтры</h3>
              <div className="flex items-center gap-4">
                <button onClick={clearFilters} className="text-primary text-sm hover:underline">Сбросить</button>
                <button onClick={() => setIsFilterOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Цена</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value.replace(/\D/g, "").slice(0, 6))}
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
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                        selectedSizes.includes(size)
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-secondary border-border hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Сезон</label>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((season) => (
                    <button
                      key={season.id}
                      onClick={() => handleSeasonChange(season.id)}
                      className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                        selectedSeason === season.id
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-secondary border-border hover:border-primary"
                      }`}
                    >
                      {season.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Сортировка</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "popular" | "price-asc" | "price-desc" | "new")}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="popular">По популярности</option>
                  <option value="new">Сначала новинки</option>
                  <option value="price-asc">Цена: по возрастанию</option>
                  <option value="price-desc">Цена: по убыванию</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product, index) => {
            const lowStock = getLowStock(product.id);
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}>
                <ProductCard
                  product={product}
                  showLowStock={!!lowStock}
                  lowStockSize={lowStock?.size}
                  lowStockColor={lowStock?.color}
                  lowStockCount={lowStock?.count}
                />
              </motion.div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">Товары не найдены</p>
            <Button onClick={clearFilters} className="btn-gold">Сбросить фильтры</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Catalog;
