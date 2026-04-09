import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, User, Menu, Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryDrawer from "./CategoryDrawer";
import SearchModal from "./SearchModal";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "next-themes";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left */}
            <div className="flex items-center gap-1">
              <button className="p-2 text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(true)} aria-label="Открыть меню">
                <Menu size={24} />
              </button>
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary" onClick={() => setIsSearchOpen(true)}>
                <Search size={20} />
              </Button>
            </div>

            {/* Center - Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="text-2xl md:text-3xl font-bold tracking-wider text-gradient-gold">PASHE</span>
            </Link>

            {/* Right */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground/80 hover:text-primary"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                title="Сменить тему"
              >
                {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Link to="/account">
                <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                  <User size={20} />
                </Button>
              </Link>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                  <ShoppingBag size={20} />
                </Button>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <CategoryDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
