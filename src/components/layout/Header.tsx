import { useState } from "react";
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
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(true)} aria-label="Открыть меню">
                <Menu size={30} />
              </button>
              <Button variant="ghost" size="icon" className="h-12 w-12 text-foreground/80 hover:text-primary" onClick={() => setIsSearchOpen(true)}>
                <Search size={26} />
              </Button>
            </div>

            {/* Center - Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="text-2xl md:text-3xl font-bold tracking-wider text-gradient-gold">ЮВЕНТУС</span>
            </Link>

            {/* Right */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 text-foreground/80 hover:text-primary"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                title="Сменить тему"
              >
                {resolvedTheme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
              </Button>
              <Link to="/account">
                <Button variant="ghost" size="icon" className="h-12 w-12 text-foreground/80 hover:text-primary">
                  <User size={26} />
                </Button>
              </Link>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="h-12 w-12 text-foreground/80 hover:text-primary">
                  <ShoppingBag size={26} />
                </Button>
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center">
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
