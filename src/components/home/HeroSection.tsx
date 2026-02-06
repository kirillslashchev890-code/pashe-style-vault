import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// ============================================
// 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
// Формат: URL изображения (рекомендуемый размер: 1920x1080)
// ============================================
const heroImages = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop", // Изображение 1 - замените на своё
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop", // Изображение 2 - замените на своё
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&h=1080&fit=crop", // Изображение 3 - замените на своё
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Автоматическое переключение слайдов
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Images Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroImages[currentSlide]}
            alt="Fashion background"
            className="w-full h-full object-cover scale-105"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/30 backdrop-blur-sm border border-primary/30 flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary transition-all"
        aria-label="Предыдущий слайд"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/30 backdrop-blur-sm border border-primary/30 flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary transition-all"
        aria-label="Следующий слайд"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index
                ? "w-8 bg-primary"
                : "bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-foreground">Стиль — это</span>
            <br />
            <span className="text-gradient-gold">способ сказать</span>
            <br />
            <span className="text-foreground">кто ты</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto"
          >
            Премиальная мужская одежда для тех, кто ценит качество и индивидуальность
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/catalog">
              <Button size="lg" className="btn-gold px-8 py-6 text-base">
                Смотреть каталог
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/catalog?category=new">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base border-primary/50 hover:bg-primary/10"
              >
                Новинки
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
