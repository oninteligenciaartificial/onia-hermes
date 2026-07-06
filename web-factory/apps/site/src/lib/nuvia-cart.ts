"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CartProduct } from "@/lib/nuvia-data";

export const NUVIA_CART_STORAGE_KEY = "nuvia-next-cart-v1";

export type NuviaCartLine = {
  id: string;
  qty: number;
};

/**
 * Estado core del carrito Nuvia: líneas + persistencia en localStorage + totales.
 * NO incluye notices, drawer ni promo (eso lo agrega el storefront encima).
 */
export function useNuviaCart(cartProducts: CartProduct[]) {
  const productMap = useMemo(
    () => new Map(cartProducts.map((product) => [product.id, product])),
    [cartProducts],
  );
  const [cart, setCart] = useState<NuviaCartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(NUVIA_CART_STORAGE_KEY) || "[]");
      if (Array.isArray(parsed)) {
        setCart(
          parsed
            .filter((item) => productMap.has(item.id))
            .map((item) => ({ id: item.id, qty: Math.max(1, Number(item.qty) || 1) })),
        );
      }
    } catch {
      setCart([]);
    } finally {
      setReady(true);
    }
  }, [productMap]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    window.localStorage.setItem(NUVIA_CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  const add = useCallback((id: string, qty = 1) => {
    const amount = Math.max(1, Math.floor(Number(qty) || 1));
    setCart((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) => (item.id === id ? { ...item, qty: item.qty + amount } : item));
      }
      return [...current, { id, qty: amount }];
    });
  }, []);

  const addMany = useCallback(
    (items: Array<{ id: string; qty?: number }>): number => {
      const normalized = items
        .map((item) => ({ id: item.id, qty: Math.max(1, Math.floor(Number(item.qty) || 1)) }))
        .filter((item) => productMap.has(item.id));

      if (!normalized.length) {
        return 0;
      }

      setCart((current) => {
        const next = new Map(current.map((item) => [item.id, item.qty]));
        normalized.forEach((item) => {
          next.set(item.id, (next.get(item.id) || 0) + item.qty);
        });
        return Array.from(next.entries()).map(([id, qty]) => ({ id, qty }));
      });

      return normalized.length;
    },
    [productMap],
  );

  const increase = useCallback((id: string) => {
    setCart((current) => current.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)));
  }, []);

  const decrease = useCallback((id: string) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const priced = cart.length > 0 && cart.every((item) => typeof productMap.get(item.id)?.priceValue === "number");
  const subtotal = cart.reduce((sum, item) => {
    const product = productMap.get(item.id);
    return sum + (typeof product?.priceValue === "number" ? product.priceValue * item.qty : 0);
  }, 0);
  const discountTotal = cart.reduce((sum, item) => {
    const product = productMap.get(item.id);
    if (typeof product?.priceValue !== "number" || !product.discountPercent) {
      return sum;
    }
    return sum + product.priceValue * item.qty * (product.discountPercent / 100);
  }, 0);
  const total = Math.max(0, subtotal - discountTotal);

  return {
    cart,
    setCart,
    productMap,
    ready,
    add,
    addMany,
    increase,
    decrease,
    remove,
    clear,
    totalCount,
    priced,
    subtotal,
    discountTotal,
    total,
  };
}
