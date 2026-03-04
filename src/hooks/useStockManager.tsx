import { useState, createContext, useContext, ReactNode, useCallback, useEffect } from "react";
import { products } from "@/data/products";

interface StockEntry {
  size: string;
  count: number;
}

const STORAGE_KEY = "pashe_stock_map_v1";

const initStock = (): Map<string, StockEntry> => {
  const m = new Map<string, StockEntry>();

  products.forEach((p, i) => {
    if (i % 20 === 7) {
      const availableSizes = p.sizes.filter((s) => s.available);
      if (availableSizes.length > 0) {
        const size = availableSizes[i % availableSizes.length];
        m.set(p.id, { size: size.name, count: (i % 7) + 3 });
      }
    }
  });

  return m;
};

const loadStockFromStorage = (): Map<string, StockEntry> => {
  if (typeof window === "undefined") return initStock();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initStock();

    const parsed = JSON.parse(raw) as Record<string, StockEntry>;
    return new Map(Object.entries(parsed));
  } catch {
    return initStock();
  }
};

interface StockContextType {
  getStock: (productId: string) => StockEntry | undefined;
  decrementStock: (productId: string, qty: number) => void;
  allLowStock: () => { id: string; name: string; category: string; size: string; count: number }[];
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [stockMap, setStockMap] = useState<Map<string, StockEntry>>(() => loadStockFromStorage());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const asObject = Object.fromEntries(stockMap.entries());
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(asObject));
  }, [stockMap]);

  const getStock = useCallback((productId: string) => stockMap.get(productId), [stockMap]);

  const decrementStock = useCallback((productId: string, qty: number) => {
    setStockMap((prev) => {
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
      const p = products.find((pr) => pr.id === id);
      if (p) result.push({ id, name: p.name, category: p.category, size: entry.size, count: entry.count });
    });

    return result;
  }, [stockMap]);

  return <StockContext.Provider value={{ getStock, decrementStock, allLowStock }}>{children}</StockContext.Provider>;
};

export const useStockManager = () => {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("useStockManager must be used within StockProvider");
  return ctx;
};
