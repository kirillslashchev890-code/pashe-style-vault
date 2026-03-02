import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { products, Product } from "@/data/products";

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

// Generate deterministic "low stock" items — 1 per category, every 20th product offset by 7
const LOW_STOCK_MAP = new Map<string, { size: string; count: number }>();
products.forEach((p, i) => {
  if (i % 20 === 7) {
    const availableSizes = p.sizes.filter(s => s.available);
    if (availableSizes.length > 0) {
      const randomSize = availableSizes[i % availableSizes.length];
      LOW_STOCK_MAP.set(p.id, { size: randomSize.name, count: (i % 7) + 3 }); // 3-9 items
    }
  }
});

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState("all");
  
  const selectedCategory = searchParams.get("category") || "all";

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "all") {
      if (selectedCategory === "new") { if (!product.isNew) return false; }
      else if (selectedCategory === "sale") { if (!product.isSale) return false; }
      else if (product.category !== selectedCategory && product.subcategory !== selectedCategory) return false;
    }
    if (priceFrom && product.price < parseInt(priceFrom)) return false;
    if (priceTo && product.price > parseInt(priceTo)) return false;
    if (selectedSizes.length > 0) {
      const hasSize = product.sizes.some(s => selectedSizes.includes(s.name) && s.available);
      if (!hasSize) return false;
    }
    if (selectedSeason !== "all" && product.season !== selectedSeason && product.season !== "all") return false;
    return true;
  });

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") searchParams.delete("category");
    else searchParams.set("category", categoryId);
    setSearchParams(searchParams);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const clearFilters = () => { setPriceFrom(""); setPriceTo(""); setSelectedSizes([]); setSelectedSeason("all"); };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Каталог</h1>
          <p className="text-muted-foreground">{filteredProducts.length} товаров</p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
            {categories.map((category) => (
              <button key={category.id} onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-muted"
                }`}>
                {category.name}
              </button>
            ))}
          </div>
          <Button variant="outline" className="ml-auto" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <SlidersHorizontal size={16} className="mr-2" /> Фильтры
          </Button>
        </div>

        {isFilterOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="bg-card border border-border rounded-2xl p-6 mb-8">
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
                  <input type="number" placeholder="От" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm" />
                  <input type="number" placeholder="До" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Размер</label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button key={size} onClick={() => toggleSize(size)}
                      className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                        selectedSizes.includes(size) ? "bg-primary border-primary text-primary-foreground" : "bg-secondary border-border hover:border-primary"
                      }`}>{size}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Сезон</label>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((season) => (
                    <button key={season.id} onClick={() => setSelectedSeason(season.id)}
                      className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                        selectedSeason === season.id ? "bg-primary border-primary text-primary-foreground" : "bg-secondary border-border hover:border-primary"
                      }`}>{season.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Сортировка</label>
                <button className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm flex items-center justify-between">
                  По популярности <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product, index) => {
            const lowStock = LOW_STOCK_MAP.get(product.id);
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}>
                <ProductCard
                  product={product}
                  showLowStock={!!lowStock}
                  lowStockSize={lowStock?.size}
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
