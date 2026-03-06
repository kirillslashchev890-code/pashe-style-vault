import { useState, createContext, useContext, ReactNode, useCallback, useEffect, useMemo } from "react";
import { getManagedProducts } from "@/data/products";

interface LowStockVariant {
  size: string;
  color: string;
  count: number;
}

interface LowStockTableRow extends LowStockVariant {
  id: string;
  name: string;
  category: string;
}

interface StockContextType {
  getVariantStock: (productId: string, size: string, color: string) => number;
  getLowStock: (productId: string) => LowStockVariant | undefined;
  decrementStock: (productId: string, size: string, color: string, qty: number) => void;
  allLowStock: () => LowStockTableRow[];
}

const STOCK_STORAGE_KEY = "pashe_stock_map_v2";
const DEFAULT_VARIANT_QTY = 50;

const buildKey = (productId: string, size: string, color: string) => `${productId}::${size}::${color}`;

const parseKey = (key: string) => {
  const [productId, size, color] = key.split("::");
  return { productId, size, color };
};

const buildInitialStockRecord = (): Record<string, number> => {
  const baseProducts = getManagedProducts();
  const stock: Record<string, number> = {};

  baseProducts.forEach((product, productIndex) => {
    const availableSizes = product.sizes.filter((s) => s.available).map((s) => s.name);
    const colors = product.colors.map((c) => c.name);

    if (availableSizes.length === 0 || colors.length === 0) return;

    colors.forEach((color) => {
      availableSizes.forEach((size) => {
        stock[buildKey(product.id, size, color)] = DEFAULT_VARIANT_QTY;
      });
    });

    // Для части товаров делаем один low-stock SKU (размер+цвет)
    if (productIndex % 20 === 7) {
      const randomSize = availableSizes[productIndex % availableSizes.length];
      const randomColor = colors[productIndex % colors.length];
      stock[buildKey(product.id, randomSize, randomColor)] = (productIndex % 7) + 3;
    }
  });

  return stock;
};

const sanitizeRecord = (value: unknown): Record<string, number> => {
  if (!value || typeof value !== "object") return {};

  const raw = value as Record<string, unknown>;
  const clean: Record<string, number> = {};

  Object.entries(raw).forEach(([k, v]) => {
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
      clean[k] = Math.round(v);
    }
  });

  return clean;
};

const loadStockFromStorage = (): Record<string, number> => {
  if (typeof window === "undefined") return buildInitialStockRecord();

  try {
    const raw = window.localStorage.getItem(STOCK_STORAGE_KEY);
    const initial = buildInitialStockRecord();

    if (!raw) return initial;

    const parsed = sanitizeRecord(JSON.parse(raw));

    // Добавляем новые SKU, если каталог расширился
    return { ...initial, ...parsed };
  } catch {
    return buildInitialStockRecord();
  }
};

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [stockRecord, setStockRecord] = useState<Record<string, number>>(() => loadStockFromStorage());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(stockRecord));
  }, [stockRecord]);

  const productsMap = useMemo(() => {
    const list = getManagedProducts();
    return new Map(list.map((p) => [p.id, p]));
  }, [stockRecord]);

  const getVariantStock = useCallback(
    (productId: string, size: string, color: string) => {
      return stockRecord[buildKey(productId, size, color)] ?? DEFAULT_VARIANT_QTY;
    },
    [stockRecord]
  );

  const decrementStock = useCallback((productId: string, size: string, color: string, qty: number) => {
    const safeQty = Math.max(1, qty);

    setStockRecord((prev) => {
      const key = buildKey(productId, size, color);
      const current = prev[key] ?? DEFAULT_VARIANT_QTY;
      const next = {
        ...prev,
        [key]: Math.max(0, current - safeQty),
      };
      // Save synchronously to prevent data loss on navigation
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const getLowStock = useCallback(
    (productId: string): LowStockVariant | undefined => {
      let minEntry: LowStockVariant | undefined;

      Object.entries(stockRecord).forEach(([key, count]) => {
        if (count > 10) return;
        const parsed = parseKey(key);
        if (parsed.productId !== productId) return;

        if (!minEntry || count < minEntry.count) {
          minEntry = { size: parsed.size, color: parsed.color, count };
        }
      });

      return minEntry;
    },
    [stockRecord]
  );

  const allLowStock = useCallback((): LowStockTableRow[] => {
    const rows: LowStockTableRow[] = [];

    Object.entries(stockRecord).forEach(([key, count]) => {
      if (count > 10) return;
      const parsed = parseKey(key);
      const product = productsMap.get(parsed.productId);
      if (!product) return;

      rows.push({
        id: parsed.productId,
        name: product.name,
        category: product.category,
        size: parsed.size,
        color: parsed.color,
        count,
      });
    });

    rows.sort((a, b) => a.count - b.count);
    return rows;
  }, [stockRecord, productsMap]);

  return (
    <StockContext.Provider value={{ getVariantStock, getLowStock, decrementStock, allLowStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStockManager = () => {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("useStockManager must be used within StockProvider");
  return ctx;
};
