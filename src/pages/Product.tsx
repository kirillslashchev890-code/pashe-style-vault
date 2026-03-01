import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Minus, Plus, ChevronLeft, Truck, RefreshCw, Shield, ChevronDown, Ruler } from "lucide-react";
import { getProductById, products } from "@/data/products";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ImageLightbox from "@/components/product/ImageLightbox";
import AuthModal from "@/components/auth/AuthModal";
import ReviewSection from "@/components/product/ReviewSection";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { supabase } from "@/integrations/supabase/client";

const Product = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [compositionOpen, setCompositionOpen] = useState(false);
  const [careOpen, setCareOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sizeGuideData, setSizeGuideData] = useState<any[]>([]);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = getProductById(id || "") || products[0];

  useEffect(() => {
    const fetchSizeGuide = async () => {
      const { data } = await supabase.from("size_guide").select("*").eq("category_slug", product.category).order("size");
      if (data) setSizeGuideData(data);
    };
    fetchSizeGuide();
  }, [product.category]);

  const currentImages = selectedColor && product.colorImages?.[selectedColor] ? product.colorImages[selectedColor] : product.images;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0 }).format(price);

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Link to="/catalog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8">
          <ChevronLeft size={16} className="mr-1" /> Назад в каталог
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary mb-4 cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
              <img src={currentImages[selectedImage]} alt={product.name} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              {discount && <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm font-semibold px-3 py-1 rounded-full">-{discount}%</span>}
              {product.isNew && <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">NEW</span>}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-background/20">
                <span className="bg-background/80 px-3 py-1.5 rounded-full text-sm">Нажмите для увеличения</span>
              </div>
            </div>
            <div className="flex gap-4">
              {currentImages.map((image, index) => (
                <button key={`${selectedColor}-${index}`} onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square w-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-transparent hover:border-border"}`}>
                  <img src={image} alt={`${product.name} - ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-primary text-sm font-medium">{product.brand}</p>
              <span className="text-muted-foreground">•</span>
              <p className="text-muted-foreground text-sm">{product.category}</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-muted-foreground line-through text-lg">{formatPrice(product.originalPrice)}</span>}
            </div>
            <p className="text-muted-foreground mb-8">{product.description}</p>

            {/* Colors */}
            <div className="mb-6">
              <span className="font-medium block mb-3">Цвет: {selectedColor || product.colors[0]?.name || "Выберите цвет"}</span>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button key={color.name} onClick={() => { setSelectedColor(color.name); setSelectedImage(0); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${selectedColor === color.name ? "border-primary bg-primary/10" : "border-border hover:border-primary"}`}>
                    <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Размер</span>
                <button onClick={() => setSizeGuideOpen(!sizeGuideOpen)} className="text-primary text-sm hover:underline flex items-center gap-1">
                  <Ruler size={14} /> Таблица размеров
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button key={size.name} onClick={() => size.available && setSelectedSize(size.name)} disabled={!size.available}
                    className={`w-14 h-14 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size.name ? "border-primary bg-primary text-primary-foreground"
                      : size.available ? "border-border hover:border-primary text-foreground"
                      : "border-border bg-muted text-muted-foreground cursor-not-allowed line-through"
                    }`}>{size.name}</button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="font-medium block mb-3">Количество</span>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Minus size={18} /></button>
                <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Plus size={18} /></button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button size="lg" className="flex-1 btn-gold py-6" disabled={!selectedSize}
                onClick={() => {
                  if (!user) { setAuthModalOpen(true); return; }
                  if (selectedSize) {
                    addToCart({
                      productId: product.id,
                      size: selectedSize,
                      quantity,
                      productName: product.name,
                      productPrice: product.price,
                      productImage: currentImages[0],
                      colorId: selectedColor || undefined,
                      colorName: selectedColor || undefined,
                    });
                  }
                }}>
                <ShoppingBag size={20} className="mr-2" />
                {selectedSize ? "Добавить в корзину" : "Выберите размер"}
              </Button>
              <Button size="lg" variant="outline"
                className={`w-14 h-14 p-0 ${isInWishlist(product.id) ? "text-destructive border-destructive" : ""}`}
                onClick={() => { if (!user) { setAuthModalOpen(true); return; } toggleWishlist(product.id); }}>
                <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </Button>
            </div>

            {/* Size Guide */}
            {sizeGuideOpen && sizeGuideData.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8 border border-border rounded-xl overflow-hidden">
                <div className="p-4 bg-secondary/50"><h3 className="font-semibold flex items-center gap-2"><Ruler size={18} /> Таблица размеров (см)</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-secondary/30">
                      <th className="text-left p-3 font-semibold">Размер</th>
                      {sizeGuideData[0]?.chest_cm != null && <th className="text-center p-3 font-semibold">Грудь</th>}
                      {sizeGuideData[0]?.waist_cm != null && <th className="text-center p-3 font-semibold">Талия</th>}
                      {sizeGuideData[0]?.hips_cm != null && <th className="text-center p-3 font-semibold">Бёдра</th>}
                      {sizeGuideData[0]?.shoulder_cm != null && <th className="text-center p-3 font-semibold">Плечи</th>}
                      {sizeGuideData[0]?.length_cm != null && <th className="text-center p-3 font-semibold">Длина</th>}
                      {sizeGuideData[0]?.foot_cm != null && <th className="text-center p-3 font-semibold">Стопа</th>}
                    </tr></thead>
                    <tbody>
                      {sizeGuideData.map((row, i) => (
                        <tr key={row.id} className={`border-b border-border last:border-0 ${i % 2 !== 0 ? "bg-secondary/20" : ""}`}>
                          <td className="p-3 font-medium">{row.size}</td>
                          {row.chest_cm != null && <td className="text-center p-3">{row.chest_cm}</td>}
                          {row.waist_cm != null && <td className="text-center p-3">{row.waist_cm}</td>}
                          {row.hips_cm != null && <td className="text-center p-3">{row.hips_cm}</td>}
                          {row.shoulder_cm != null && <td className="text-center p-3">{row.shoulder_cm}</td>}
                          {row.length_cm != null && <td className="text-center p-3">{row.length_cm}</td>}
                          {row.foot_cm != null && <td className="text-center p-3">{row.foot_cm}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Features */}
            <div className="space-y-4 border-t border-border pt-8">
              <div className="flex items-center gap-4"><Truck size={20} className="text-primary" /><div><p className="font-medium">Бесплатная доставка</p><p className="text-muted-foreground text-sm">При заказе от 10 000 ₽</p></div></div>
              <div className="flex items-center gap-4"><RefreshCw size={20} className="text-primary" /><div><p className="font-medium">Возврат 30 дней</p><p className="text-muted-foreground text-sm">Простой обмен и возврат</p></div></div>
              <div className="flex items-center gap-4"><Shield size={20} className="text-primary" /><div><p className="font-medium">Гарантия качества</p><p className="text-muted-foreground text-sm">Только оригинальные товары</p></div></div>
            </div>

            {/* Collapsible Details */}
            <div className="border-t border-border mt-8 pt-8 space-y-4">
              <Collapsible open={compositionOpen} onOpenChange={setCompositionOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-3 hover:text-primary transition-colors">
                  <span className="font-semibold">Состав</span>
                  <ChevronDown size={20} className={`transition-transform duration-200 ${compositionOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <AnimatePresence><motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pb-4">
                    <dl className="space-y-2 text-sm">
                      <div className="flex"><dt className="text-muted-foreground w-40">Материал</dt><dd>{product.composition}</dd></div>
                      <div className="flex"><dt className="text-muted-foreground w-40">Страна производства</dt><dd>{product.country}</dd></div>
                    </dl>
                  </motion.div></AnimatePresence>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={careOpen} onOpenChange={setCareOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-3 hover:text-primary transition-colors border-t border-border">
                  <span className="font-semibold">Уход за изделием</span>
                  <ChevronDown size={20} className={`transition-transform duration-200 ${careOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <AnimatePresence><motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pb-4">
                    <p className="text-sm text-muted-foreground">{product.care}</p>
                  </motion.div></AnimatePresence>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={deliveryOpen} onOpenChange={setDeliveryOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-3 hover:text-primary transition-colors border-t border-border">
                  <span className="font-semibold">Доставка и возврат</span>
                  <ChevronDown size={20} className={`transition-transform duration-200 ${deliveryOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <AnimatePresence><motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pb-4">
                    <div className="space-y-4 text-sm">
                      <div><p className="font-medium mb-1">Доставка</p><ul className="space-y-1 text-muted-foreground"><li>• Курьером по Москве: 1-2 дня</li><li>• В пункты выдачи: 2-5 дней</li><li>• Бесплатная доставка при заказе от 10 000 ₽</li></ul></div>
                      <div><p className="font-medium mb-1">Возврат</p><ul className="space-y-1 text-muted-foreground"><li>• Возврат в течение 30 дней</li><li>• Бесплатный возврат курьером</li></ul></div>
                    </div>
                  </motion.div></AnimatePresence>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product.id} />
      </div>

      <ImageLightbox images={currentImages} initialIndex={selectedImage} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onSuccess={() => setAuthModalOpen(false)} />
    </Layout>
  );
};

export default Product;
