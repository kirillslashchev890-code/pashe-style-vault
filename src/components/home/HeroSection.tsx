import { motion, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import mannequinImg from "@/assets/hero-mannequin.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  // Smooth fade + slight scale of the mannequin tied to scroll position
  const mannequinOpacity = useTransform(scrollY, [0, 400, 700], [1, 0.6, 0]);
  const mannequinY = useTransform(scrollY, [0, 700], [0, -80]);
  const mannequinScale = useTransform(scrollY, [0, 700], [1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-background flex items-center"
    >
      {/* Subtle radial backdrop */}
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, hsl(var(--primary) / 0.08), transparent 60%)",
        }}
      />

      {/* Mannequin centered, fades on scroll */}
      <motion.div
        style={{ opacity: mannequinOpacity, y: mannequinY, scale: mannequinScale }}
        className="absolute inset-0 z-10 flex items-end md:items-center justify-center pointer-events-none"
      >
        <img
          src={mannequinImg}
          alt="ЮВЕНТУС look"
          className="h-[90vh] md:h-[95vh] w-auto object-contain select-none"
          draggable={false}
        />
      </motion.div>

      {/* Top left text */}
      <div className="absolute top-24 left-6 md:left-12 z-20">
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
      <div className="absolute top-24 left-1/4 z-20 hidden md:block">
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

      {/* Huge split typography around the mannequin (Aura-store style) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center">
        <div className="container mx-auto px-4 md:px-12 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[14vw] md:text-[11vw] font-black uppercase leading-[0.85] tracking-tighter text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            СТИЛЬ
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[14vw] md:text-[11vw] font-black uppercase leading-[0.85] tracking-tighter text-gradient-gold"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            СМЕЛЫХ
          </motion.h1>
        </div>
      </div>

      {/* Middle "ДЛЯ" connector */}
      <div className="absolute inset-x-0 top-[68%] md:top-auto md:bottom-32 z-20 flex justify-center pointer-events-none">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-foreground/70 text-xs md:text-sm uppercase tracking-[0.4em] font-light"
        >
          для
        </motion.span>
      </div>

      {/* Bottom left - description */}
      <div className="absolute bottom-12 left-6 md:left-12 z-20 max-w-[220px]">
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

      {/* Bottom right - CTA */}
      <div className="absolute bottom-12 right-6 md:right-12 z-20">
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
