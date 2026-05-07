import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

// ============================================
// 🎬 ВИДЕО: CDN asset
// 🖼️ ПОСТЕР: Положите файл в public/videos/video-poster.jpg
// ============================================
const videoSrc = "/videos/video-main.mp4";
const videoPoster = "/videos/video-poster.jpg";
const bgVideoSrc = "/videos/video-bg.mp4";

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Фоновое видео секции */}
      <video
        src={bgVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-background/60 -z-10" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Овальный контейнер с видео */}
          <div className="video-rounded-container aspect-[16/9] bg-card border-4 border-border/30">
            {/* Видео элемент */}
            <video
              ref={videoRef}
              src={videoSrc}
              poster={videoPoster}
              loop
              muted
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Затемнение поверх видео (исчезает при воспроизведении) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-charcoal-light/80 to-charcoal/80 flex items-center justify-center transition-opacity duration-500 ${
                isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              {/* Фоновый паттерн */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
              </div>

              {/* Контент поверх видео */}
              <div className="relative z-10 text-center px-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-6">
                    Новое поступление
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
                  style={{
                    fontFamily: "'Playfair Display', 'Outfit', serif",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  <span className="text-gradient-gold italic">Весна / Лето</span>
                  <br />
                  <span className="text-foreground" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300, letterSpacing: "0.15em" }}>
                    2025
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mb-8"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 300,
                    letterSpacing: "0.05em",
                  }}
                >
                  Современная классика для городского стиля
                </motion.p>
              </div>
            </div>

            {/* Play/Pause button — всегда видна */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="absolute bottom-6 right-6 z-20 w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </motion.button>

            {/* Decorative border glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[2.5rem] blur-xl opacity-50 -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
