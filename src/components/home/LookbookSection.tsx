import { motion } from "framer-motion";
import { Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import lookbookImg from "@/assets/lookbook-rack.jpg";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { getProductById } from "@/data/products";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Hotspot positions in % (top, left), point to product ids
const hotspots = [
  { id: "tshirt-1", top: 45, left: 32, label: "Джинсы" },
  { id: "sweatshirt-1", top: 38, left: 50, label: "Свитшот" },
  { id: "sweatshirt-2", top: 50, left: 62, label: "Худи" },
  { id: "caps-1", top: 22, left: 38, label: "Кепка" },
];

const LookbookSection = () => {
  const [active, setActive] = useState<string | null>(null);
  const { user } = useAuth();
  const { addToCart } = useCart();

  const addAll = async () => {
    if (!user) { toast.error("Войдите, чтобы добавить образ"); return; }
    let added = 0;
    for (const h of hotspots) {
      const p = getProductById(h.id);
      if (!p) continue;
      const size = p.sizes?.find((s: any) => s.available)?.name || "M";
      const color = p.colors?.[0];
      await addToCart({
        productId: p.id,
        productName: p.name,
        productPrice: p.price,
        productImage: (color && p.colorImages?.[color.name]?.[0]) || p.images?.[0] || "/placeholder.svg",
        size,
        colorId: color?.name,
        colorName: color?.name,
        quantity: 1,
      });
      added++;
    }
    toast.success(`Образ добавлен в корзину (${added} товара)`);
  };

  const activeProduct = active ? getProductById(active) : null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-12 flex items-end justify-between gap-4 flex-wrap"
        >
          <div>
            <p className="text-primary text-xs uppercase tracking-[0.25em] mb-3">Lookbook</p>
            <h2 className="text-3xl md:text-5xl font-bold">Собери образ</h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Кликните на точки и добавьте весь образ в корзину одним нажатием.
            </p>
          </div>
          <Button onClick={addAll} className="btn-gold">
            <ShoppingBag size={16} className="mr-2" />
            Добавить весь образ
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden bg-card">
            <img src={lookbookImg} alt="Lookbook" className="w-full h-full object-cover" />
            {hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => setActive(h.id)}
                style={{ top: `${h.top}%`, left: `${h.left}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                aria-label={h.label}
              >
                <span className="absolute inset-0 -m-3 rounded-full bg-primary/30 animate-ping" />
                <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
                  <Plus size={16} />
                </span>
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 flex flex-col">
            <h3 className="font-semibold mb-4">Товары образа</h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {hotspots.map((h) => {
                const p = getProductById(h.id);
                if (!p) return null;
                const img = p.colorImages?.[p.colors?.[0]?.name]?.[0] || p.images?.[0] || "/placeholder.svg";
                return (
                  <Link
                    key={h.id}
                    to={`/product/${p.id}`}
                    onMouseEnter={() => setActive(h.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${active === h.id ? "border-primary bg-secondary/40" : "border-border hover:border-primary/50"}`}
                  >
                    <img src={img} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{new Intl.NumberFormat("ru-RU").format(p.price)} ₽</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            {activeProduct && (
              <p className="text-xs text-muted-foreground mt-4">Выбрано: {activeProduct.name}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LookbookSection;
