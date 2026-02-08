import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";

// ============================================
// 🖼️ ЗАМЕНИТЕ ИЗОБРАЖЕНИЯ НИЖЕ НА СВОИ
// Положите фото в папку: public/images/hero/
// Рекомендуемый размер: 1920x1080
// ============================================
const heroImages = [
  "/images/hero/slide-1.jpg", // 🖼️ Замените: public/images/hero/slide-1.jpg
  "/images/hero/slide-2.jpg", // 🖼️ Замените: public/images/hero/slide-2.jpg
  "/images/hero/slide-3.jpg", // 🖼️ Замените: public/images/hero/slide-3.jpg
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Images Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroImages[currentSlide]}
            alt="PASHE fashion"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm border border-foreground/10 flex items-center justify-center text-foreground/80 hover:bg-background/40 hover:text-foreground transition-all"
        aria-label="Предыдущий слайд"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm border border-foreground/10 flex items-center justify-center text-foreground/80 hover:bg-background/40 hover:text-foreground transition-all"
        aria-label="Следующий слайд"
      >
        <ChevronRight size={24} />
      </button>

      {/* Top left corner text */}
      <div className="absolute top-24 left-6 md:left-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-foreground/60 text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed font-light"
        >
          <p>Добро пожаловать</p>
          <p>в мир стиля</p>
          <p>и качества</p>
        </motion.div>
      </div>

      {/* Top center-left text */}
      <div className="absolute top-24 left-1/4 z-10 hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-foreground/60 text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed font-light"
        >
          <p>Премиальная</p>
          <p>мужская одежда</p>
          <p>2025</p>
        </motion.div>
      </div>

      {/* Main large typography - center */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center select-none"
        >
          <h1
            className="text-[12vw] md:text-[10vw] lg:text-[9vw] font-black uppercase leading-[0.85] tracking-tighter text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <span className="block">СТИЛЬ</span>
            <span className="block">ДЛЯ</span>
            <span className="block text-gradient-gold">СМЕЛЫХ</span>
          </h1>
        </motion.div>
      </div>

      {/* Bottom left - description */}
      <div className="absolute bottom-12 left-6 md:left-12 z-10 max-w-[200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-foreground/50 text-[10px] md:text-xs uppercase tracking-[0.15em] leading-relaxed font-light">
            Создан для тех, кто<br />
            выбирает качество<br />
            и индивидуальность
          </p>
        </motion.div>
      </div>

      {/* Bottom center - slide indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              currentSlide === index
                ? "w-8 h-1 bg-primary rounded-full"
                : "w-2 h-2 rounded-full bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Слайд ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom right - CTA */}
      <div className="absolute bottom-12 right-6 md:right-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-end gap-3"
        >
          <p className="text-foreground/50 text-[10px] md:text-xs uppercase tracking-[0.15em] text-right font-light">
            Открой для себя<br />
            стиль нового<br />
            поколения
          </p>
          <Link
            to="/catalog"
            className="w-12 h-12 rounded-full border border-foreground/30 flex items-center justify-center text-foreground/70 hover:border-primary hover:text-primary transition-all group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
