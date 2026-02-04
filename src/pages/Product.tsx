import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Minus, Plus, ChevronLeft, Truck, RefreshCw, Shield } from "lucide-react";

// Mock данные
const productData = {
  id: "1",
  name: "Пальто из шерсти",
  price: 24990,
  originalPrice: 32990,
  description: "Классическое мужское пальто из высококачественной шерсти. Идеально подходит для холодной погоды, сохраняя элегантный внешний вид. Застёжка на пуговицы, два боковых кармана, внутренний карман.",
  images: [
    "https://images.unsplash.com/photo-1544923246-77307dd628b1?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=1000&fit=crop",
  ],
  category: "Верхняя одежда",
  sizes: [
    { name: "S", available: true },
    { name: "M", available: true },
    { name: "L", available: true },
    { name: "XL", available: false },
    { name: "XXL", available: true },
  ],
  colors: ["Чёрный", "Серый", "Тёмно-синий"],
  composition: "80% шерсть, 20% полиэстер",
  care: "Сухая чистка",
};

const Product = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const product = productData; // В реальности загрузка по id

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
            <p className="text-primary text-sm font-medium mb-2">{product.category}</p>
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

            {/* Details */}
            <div className="border-t border-border mt-8 pt-8">
              <h3 className="font-semibold mb-4">Детали</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex">
                  <dt className="text-muted-foreground w-32">Состав</dt>
                  <dd>{product.composition}</dd>
                </div>
                <div className="flex">
                  <dt className="text-muted-foreground w-32">Уход</dt>
                  <dd>{product.care}</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;