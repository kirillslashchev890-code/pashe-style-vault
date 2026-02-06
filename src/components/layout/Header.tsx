import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryDrawer from "./CategoryDrawer";
import SearchModal from "./SearchModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left - Burger Menu */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Открыть меню"
              >
                <Menu size={24} />
              </button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-foreground/80 hover:text-primary"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={20} />
              </Button>
            </div>

            {/* Center - Logo */}
            {/* 🏷️ ЗАМЕНИТЕ НАЗВАНИЕ МАГАЗИНА НА СВОЁ */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="text-2xl md:text-3xl font-bold tracking-wider text-gradient-gold">
                PASHE
              </span>
            </Link>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              <Link to="/account">
                <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                  <User size={20} />
                </Button>
              </Link>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                  <ShoppingBag size={20} />
                </Button>
                {/* Счётчик корзины - обновляется динамически */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Category Drawer */}
      <CategoryDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
