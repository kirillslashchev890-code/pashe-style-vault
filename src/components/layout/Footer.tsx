import { Link } from "react-router-dom";
import { Instagram, Facebook, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold tracking-wider text-gradient-gold">
                PASHE
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              Премиальная мужская одежда для тех, кто ценит стиль и качество.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Магазин</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=new" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Новинки
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=sale" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Распродажа
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=bestsellers" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Бестселлеры
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Помощь</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/delivery" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Доставка
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Возврат
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Таблица размеров
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>+7 (999) 123-45-67</li>
              <li>info@pashe.ru</li>
              <li>Москва, ул. Тверская, 1</li>
              <li className="text-xs pt-2">Пн-Вс: 10:00 - 22:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 PASHE. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;