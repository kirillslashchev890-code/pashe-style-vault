import { useState, createContext, useContext, ReactNode, useCallback, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  stockLoaded: boolean;
  refreshStock: () => Promise<void>;
}

const DEFAULT_VARIANT_QTY = 50;

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [stockRecord, setStockRecord] = useState<Record<string, number>>({});
  const [stockLoaded, setStockLoaded] = useState(false);

  const buildKey = (productId: string, size: string, color: string) => `${productId}::${size}::${color}`;

  // Load stock from DB
  const loadStock = useCallback(async () => {
    const { data, error } = await supabase
      .from("stock_levels")
      .select("product_id, size, color_name, quantity");

    if (error) {
      console.error("Error loading stock:", error);
      setStockLoaded(true);
      return;
    }

    if (data && data.length > 0) {
      const record: Record<string, number> = {};
      data.forEach((row: any) => {
        record[buildKey(row.product_id, row.size, row.color_name)] = row.quantity;
      });
      setStockRecord(record);
    } else {
      // Initialize stock in DB from product catalog
      await initializeStock();
    }
    setStockLoaded(true);
  }, []);

  const initializeStock = async () => {
    const products = getManagedProducts();
    const rows: { product_id: string; size: string; color_name: string; quantity: number }[] = [];

    products.forEach((product, idx) => {
      const availableSizes = product.sizes.filter(s => s.available).map(s => s.name);
      const colors = product.colors.map(c => c.name);
      if (availableSizes.length === 0 || colors.length === 0) return;

      colors.forEach(color => {
        availableSizes.forEach(size => {
          let qty = DEFAULT_VARIANT_QTY;
          // Some items start with low stock for demo
          if (idx % 20 === 7) {
            qty = (idx % 7) + 3;
          }
          rows.push({ product_id: product.id, size, color_name: color, quantity: qty });
        });
      });
    });

    // Insert in batches of 500
    const record: Record<string, number> = {};
    for (let i = 0; i < rows.length; i += 500) {
      const batch = rows.slice(i, i + 500);
      await supabase.from("stock_levels").upsert(batch, { onConflict: "product_id,size,color_name" });
      batch.forEach(r => {
        record[buildKey(r.product_id, r.size, r.color_name)] = r.quantity;
      });
    }
    setStockRecord(record);
  };

  useEffect(() => {
    loadStock();
  }, [loadStock]);

  const productsMap = useMemo(() => {
    const list = getManagedProducts();
    return new Map(list.map(p => [p.id, p]));
  }, []);

  const getVariantStock = useCallback(
    (productId: string, size: string, color: string) => {
      const key = buildKey(productId, size, color);
      return stockRecord[key] ?? DEFAULT_VARIANT_QTY;
    },
    [stockRecord]
  );

  const decrementStock = useCallback((productId: string, size: string, color: string, qty: number) => {
    const safeQty = Math.max(1, qty);
    const key = buildKey(productId, size, color);

    setStockRecord(prev => {
      const current = prev[key] ?? DEFAULT_VARIANT_QTY;
      const newQty = Math.max(0, current - safeQty);

      // Update DB asynchronously
      supabase
        .from("stock_levels")
        .upsert(
          { product_id: productId, size, color_name: color, quantity: newQty },
          { onConflict: "product_id,size,color_name" }
        )
        .then(({ error }) => {
          if (error) console.error("Error updating stock:", error);
        });

      return { ...prev, [key]: newQty };
    });
  }, []);

  const getLowStock = useCallback(
    (productId: string): LowStockVariant | undefined => {
      let minEntry: LowStockVariant | undefined;
      Object.entries(stockRecord).forEach(([key, count]) => {
        if (count > 10) return;
        const parts = key.split("::");
        if (parts[0] !== productId) return;
        if (!minEntry || count < minEntry.count) {
          minEntry = { size: parts[1], color: parts[2], count };
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
      const parts = key.split("::");
      const product = productsMap.get(parts[0]);
      if (!product) return;
      rows.push({
        id: parts[0],
        name: product.name,
        category: product.category,
        size: parts[1],
        color: parts[2],
        count,
      });
    });
    rows.sort((a, b) => a.count - b.count);
    return rows;
  }, [stockRecord, productsMap]);

  const refreshStock = useCallback(async () => {
    await loadStock();
  }, [loadStock]);

  return (
    <StockContext.Provider value={{ getVariantStock, getLowStock, decrementStock, allLowStock, stockLoaded, refreshStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStockManager = () => {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("useStockManager must be used within StockProvider");
  return ctx;
};
