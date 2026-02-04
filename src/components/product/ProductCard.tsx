import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group">
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary mb-4">
        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              NEW
            </span>
          )}
          {discount && (
            <span className="inline-block bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm text-foreground/60 hover:text-primary hover:bg-background flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
          <Heart size={18} />
        </button>

        {/* Quick add button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button className="w-full btn-gold py-5">
            <ShoppingBag size={16} className="mr-2" />
            В корзину
          </Button>
        </div>
      </Link>

      {/* Info */}
      <div>
        <p className="text-muted-foreground text-sm mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-muted-foreground line-through text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;