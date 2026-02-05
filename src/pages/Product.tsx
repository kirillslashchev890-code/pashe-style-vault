import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Minus, Plus, ChevronLeft, Truck, RefreshCw, Shield, ChevronDown } from "lucide-react";
import { getProductById, products } from "@/data/products";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Product = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [compositionOpen, setCompositionOpen] = useState(false);
  const [careOpen, setCareOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  // Find product by ID or use first product as fallback
  const product = getProductById(id || "") || products[0];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Link
          to="/catalog"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft size={16} className="mr-1" />
          Назад в каталог
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {discount && (
                <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm font-semibold px-3 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
              {product.isNew && (
                <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
                  NEW
                </span>
              )}
            </div>
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <p className="text-primary text-sm font-medium">{product.brand}</p>
              <span className="text-muted-foreground">•</span>
              <p className="text-muted-foreground text-sm">{product.category}</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through text-lg">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-8">{product.description}</p>

            {/* Colors */}
            <div className="mb-6">
              <span className="font-medium block mb-3">Цвет: {product.colors[0]}</span>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className="px-4 py-2 rounded-lg border border-border hover:border-primary text-sm transition-colors"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Размер</span>
                <Link to="/size-guide" className="text-primary text-sm hover:underline">
                  Таблица размеров
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => size.available && setSelectedSize(size.name)}
                    disabled={!size.available}
                    className={`w-14 h-14 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size.name
                        ? "border-primary bg-primary text-primary-foreground"
                        : size.available
                        ? "border-border hover:border-primary text-foreground"
                        : "border-border bg-muted text-muted-foreground cursor-not-allowed line-through"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
              {product.sizes.some(s => !s.available) && (
                <p className="text-muted-foreground text-sm mt-2">
                  Зачёркнутые размеры временно недоступны
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="font-medium block mb-3">Количество</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1 btn-gold py-6"
                disabled={!selectedSize}
              >
                <ShoppingBag size={20} className="mr-2" />
                {selectedSize ? "Добавить в корзину" : "Выберите размер"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-14 h-14 p-0"
              >
                <Heart size={20} />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4 border-t border-border pt-8">
              <div className="flex items-center gap-4">
                <Truck size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Бесплатная доставка</p>
                  <p className="text-muted-foreground text-sm">При заказе от 10 000 ₽</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <RefreshCw size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Возврат 30 дней</p>
                  <p className="text-muted-foreground text-sm">Простой обмен и возврат</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Shield size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Гарантия качества</p>
                  <p className="text-muted-foreground text-sm">Только оригинальные товары</p>
                </div>
              </div>
            </div>

            {/* Collapsible Details */}
            <div className="border-t border-border mt-8 pt-8 space-y-4">
              {/* Composition */}
              <Collapsible open={compositionOpen} onOpenChange={setCompositionOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-3 hover:text-primary transition-colors">
                  <span className="font-semibold">Состав</span>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform duration-200 ${compositionOpen ? "rotate-180" : ""}`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pb-4"
                    >
                      <dl className="space-y-2 text-sm">
                        <div className="flex">
                          <dt className="text-muted-foreground w-40">Материал</dt>
                          <dd>{product.composition}</dd>
                        </div>
                        <div className="flex">
                          <dt className="text-muted-foreground w-40">Страна производства</dt>
                          <dd>{product.country}</dd>
                        </div>
                      </dl>
                    </motion.div>
                  </AnimatePresence>
                </CollapsibleContent>
              </Collapsible>

              {/* Care Instructions */}
              <Collapsible open={careOpen} onOpenChange={setCareOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-3 hover:text-primary transition-colors border-t border-border">
                  <span className="font-semibold">Уход за изделием</span>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform duration-200 ${careOpen ? "rotate-180" : ""}`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pb-4"
                    >
                      <p className="text-sm text-muted-foreground">{product.care}</p>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          Стирать при температуре не выше указанной
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          Не отбеливать
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          Гладить при средней температуре
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          Не сушить в барабане
                        </li>
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                </CollapsibleContent>
              </Collapsible>

              {/* Delivery */}
              <Collapsible open={deliveryOpen} onOpenChange={setDeliveryOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-3 hover:text-primary transition-colors border-t border-border">
                  <span className="font-semibold">Доставка и возврат</span>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform duration-200 ${deliveryOpen ? "rotate-180" : ""}`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pb-4"
                    >
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">Доставка</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Курьером по Москве: 1-2 дня</li>
                            <li>• В пункты выдачи: 2-5 дней</li>
                            <li>• Почтой России: 5-14 дней</li>
                            <li>• Бесплатная доставка при заказе от 10 000 ₽</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Возврат</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Возврат в течение 30 дней</li>
                            <li>• Товар должен сохранить товарный вид</li>
                            <li>• Бесплатный возврат курьером</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
