import { useState, createContext, useContext, ReactNode, useCallback } from "react";
import { products } from "@/data/products";

// Generate deterministic low stock items — every 20th product offset by 7
interface StockEntry { size: string; count: number }

const initStock = (): Map<string, StockEntry> => {
  const m = new Map<string, StockEntry>();
  products.forEach((p, i) => {
    if (i % 20 === 7) {
      const availableSizes = p.sizes.filter(s => s.available);
      if (availableSizes.length > 0) {
        const size = availableSizes[i % availableSizes.length];
        m.set(p.id, { size: size.name, count: (i % 7) + 3 });
      }
    }
  });
  return m;
};

interface StockContextType {
  getStock: (productId: string) => StockEntry | undefined;
  decrementStock: (productId: string, qty: number) => void;
  allLowStock: () => { id: string; name: string; category: string; size: string; count: number }[];
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [stockMap, setStockMap] = useState<Map<string, StockEntry>>(() => initStock());

  const getStock = useCallback((productId: string) => stockMap.get(productId), [stockMap]);

  const decrementStock = useCallback((productId: string, qty: number) => {
    setStockMap(prev => {
      const next = new Map(prev);
      const entry = next.get(productId);
      if (entry) {
        const newCount = Math.max(0, entry.count - qty);
        next.set(productId, { ...entry, count: newCount });
      }
      return next;
    });
  }, []);

  const allLowStock = useCallback(() => {
    const result: { id: string; name: string; category: string; size: string; count: number }[] = [];
    stockMap.forEach((entry, id) => {
      const p = products.find(pr => pr.id === id);
      if (p) result.push({ id, name: p.name, category: p.category, size: entry.size, count: entry.count });
    });
    return result;
  }, [stockMap]);

  return (
    <StockContext.Provider value={{ getStock, decrementStock, allLowStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStockManager = () => {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("useStockManager must be used within StockProvider");
  return ctx;
};
