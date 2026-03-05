import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product } from "@/data/products";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductCardProps {
  product: Product;
  showLowStock?: boolean;
  lowStockSize?: string;
  lowStockColor?: string;
  lowStockCount?: number;
}

const ProductCard = ({ product, showLowStock, lowStockSize, lowStockColor, lowStockCount }: ProductCardProps) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

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
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              NEW
            </span>
          )}
          {discount && (
            <span className="bg-destructive text-destructive-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {showLowStock && lowStockCount != null && lowStockCount <= 10 && (
            <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              Осталось {lowStockCount} шт ({lowStockSize}, {lowStockColor})
            </span>
          )}
        </div>
        
        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!user) {
              setAuthModalOpen(true);
              return;
            }
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground ${
            isInWishlist(product.id) ? "!opacity-100 text-destructive" : ""
          }`}
        >
          <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
        </button>
        
        {/* Quick sizes */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {product.sizes.slice(0, 5).map((size) => (
            <span
              key={size.name}
              className={`flex-1 text-center py-1.5 text-xs font-medium rounded-md transition-colors ${
                size.available
                  ? "bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground line-through cursor-not-allowed"
              }`}
            >
              {size.name}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-muted-foreground text-sm mb-1">{product.brand}</p>
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground text-sm line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </Link>
  );
};

export default ProductCard;
