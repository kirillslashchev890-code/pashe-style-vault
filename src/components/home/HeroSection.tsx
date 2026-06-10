import { motion, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import mannequinImg from "@/assets/hero-mannequin.png";
import bgImg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const mannequinOpacity = useTransform(scrollY, [0, 400, 700], [1, 0.6, 0]);
  const mannequinY = useTransform(scrollY, [0, 700], [0, -80]);
  const mannequinScale = useTransform(scrollY, [0, 700], [1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex items-center"
    >
      {/* Blurred background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px)",
          transform: "scale(1.08)",
        }}
      />
      {/* Dim overlay for text contrast */}
      <div className="absolute inset-0 z-[1] bg-background/40" />

      {/* Mannequin centered, full width-stretched, fades on scroll */}
      <motion.div
        style={{ opacity: mannequinOpacity, y: mannequinY, scale: mannequinScale }}
        className="absolute inset-0 z-10 flex items-end md:items-center justify-center pointer-events-none"
      >
        <img
          src={mannequinImg}
          alt="ЮВЕНТУС look"
          className="h-[88vh] md:h-[100vh] w-auto object-contain select-none drop-shadow-2xl"
          draggable={false}
        />
      </motion.div>

      {/* Top left text */}
      <div className="absolute top-24 left-6 md:left-12 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-foreground/70 text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed font-light"
        >
          <p>Добро пожаловать</p>
          <p>в мир стиля</p>
          <p>и качества</p>
        </motion.div>
      </div>

      {/* Big split typography — СТИЛЬ left, СМЕЛЫХ right */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center">
        <div className="w-full px-2 md:px-6 flex items-center justify-between gap-2">
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[11vw] md:text-[8.5vw] font-black uppercase leading-[0.85] tracking-tighter text-foreground -ml-1 md:-ml-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            СТИЛЬ
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[11vw] md:text-[8.5vw] font-black uppercase leading-[0.85] tracking-tighter text-gradient-gold text-right"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            СМЕЛЫХ
          </motion.h1>
        </div>
      </div>

      {/* "ДЛЯ" behind mannequin's head — larger, sits behind figure but readable */}
      <div className="absolute inset-x-0 top-[10%] md:top-[12%] z-[5] flex justify-center pointer-events-none">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-[18vw] md:text-[14vw] font-black uppercase leading-none tracking-tighter text-foreground/25"
          style={{ fontFamily: "'Outfit', sans-serif", WebkitTextStroke: "1px hsl(var(--foreground) / 0.5)" }}
        >
          ДЛЯ
        </motion.span>
      </div>

      {/* Bottom left description */}
      <div className="absolute bottom-12 left-6 md:left-12 z-20 max-w-[220px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-foreground/70 text-[10px] md:text-xs uppercase tracking-[0.15em] leading-relaxed font-light">
            Создан для тех, кто<br />
            выбирает качество<br />
            и индивидуальность
          </p>
        </motion.div>
      </div>

      {/* Bottom right CTA */}
      <div className="absolute bottom-12 right-6 md:right-12 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-end gap-3"
        >
          <p className="text-foreground/70 text-[10px] md:text-xs uppercase tracking-[0.15em] text-right font-light">
            Открой для себя<br />
            стиль нового<br />
            поколения
          </p>
          <Link
            to="/catalog"
            className="w-12 h-12 rounded-full border border-foreground/40 bg-background/40 backdrop-blur-sm flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-all group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
