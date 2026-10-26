# Nuvia Checkout + Envíos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Página `/nuvia/checkout` que captura cliente + entrega, calcula el total de productos en el servidor y entrega el pedido por WhatsApp (envío coordinado al despachar, sin monto en la web).

**Architecture:** Lógica pura y testeable en `nuvia-order.ts` (validación a mano, sin zod; sin imports de Next). El hook de carrito se extrae a `nuvia-cart.ts` y lo reusan el drawer y la página. `nuvia-commerce.ts` orquesta (valida → líneas → totales → persiste si hay Supabase → arma `whatsappUrl`). UI en `nuvia-checkout.tsx`. Primer arnés E2E de la app Next.

**Tech Stack:** Next 15.5.19 (App Router), React 19, TypeScript, Playwright, Vitest. Sin dependencias nuevas.

**Spec:** `docs/superpowers/specs/2026-07-05-nuvia-checkout-envios-design.md`

**Convenciones del repo:**
- Todos los comandos se corren desde `C:\dev\proyectos\onia-hermes\.claude\worktrees\distracted-knuth-92e62d\web-factory`.
- Commits conventional. No tocar `onia-center` ni otras landings.
- App real = `apps/site/src/app/nuvia/**` + `components/nuvia/**` + `lib/nuvia-*`.

---

## File Structure

| Archivo | Responsabilidad |
| --- | --- |
| `apps/site/src/lib/nuvia-order.ts` (NEW) | Puro: tipos, `validateCheckoutInput`, `buildOrderLines`, `computeOrderTotals`, `formatMoney`, `buildWhatsappOrderMessage`, `buildNuviaWhatsappUrl`, `NUVIA_CITIES`. Sin imports de Next. |
| `apps/site/src/lib/nuvia-order.test.ts` (NEW) | Unit tests (vitest) del módulo puro. |
| `apps/site/src/lib/nuvia-cart.ts` (NEW) | Hook `useNuviaCart` (core: estado carrito + localStorage + totales). |
| `apps/site/src/components/nuvia/nuvia-store.tsx` (MODIFY) | `useCart` pasa a componer `useNuviaCart`; el botón del drawer navega a `/nuvia/checkout`. |
| `apps/site/src/lib/nuvia-commerce.ts` (MODIFY) | `createNuviaCheckout` + `persistOrder` para flujo WhatsApp; BNB queda dormido. |
| `apps/site/src/app/api/nuvia/checkout/route.ts` (MODIFY) | Pasa el body crudo (la validación vive en commerce). |
| `apps/site/src/components/nuvia/nuvia-checkout.tsx` (NEW) | UI cliente: resumen + formulario + CTA WhatsApp. |
| `apps/site/src/app/nuvia/checkout/page.tsx` (NEW) | Ruta server. |
| `apps/site/src/app/globals.css` (MODIFY) | Estilos `.nuvia-checkout-*`. |
| `apps/site/data/clients/nuvia.json` → `web-factory/data/clients/nuvia.json` (MODIFY) | `contacto.whatsapp`. |
| `playwright.next.config.ts` (NEW) + `tests/e2e-next/nuvia-checkout.spec.ts` (NEW) | Primer E2E de la app Next. |

---

## Task 1: Módulo puro `nuvia-order.ts` (TDD)

**Files:**
- Create: `apps/site/src/lib/nuvia-order.ts`
- Test: `apps/site/src/lib/nuvia-order.test.ts`

- [ ] **Step 1: Escribir el test que falla**

Create `apps/site/src/lib/nuvia-order.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  buildNuviaWhatsappUrl,
  buildOrderLines,
  buildWhatsappOrderMessage,
  computeOrderTotals,
  formatMoney,
  validateCheckoutInput,
  type CheckoutProduct,
} from "./nuvia-order";

const CATALOG: CheckoutProduct[] = [
  {
    id: "isdin-fusion-water-magic-spf-50",
    title: "ISDIN Fusion Water Magic SPF 50",
    brand: "ISDIN",
    category: "Proteccion solar",
    size: "50 ml",
    priceLabel: "Bs. 201",
    priceValue: 200.75,
    currency: "BOB",
    discountPercent: 10,
  },
  {
    id: "svr-sebiaclear-gel-moussant",
    title: "SVR Sebiaclear Gel Moussant",
    brand: "SVR",
    category: "Limpieza facial",
    size: "200 ml",
    priceLabel: "Bs. 211",
    priceValue: 211.2,
    currency: "BOB",
    discountPercent: 0,
  },
];

const VALID_INPUT = {
  storeSlug: "nuvia",
  items: [{ id: "isdin-fusion-water-magic-spf-50", quantity: 2 }],
  customer: { name: "Ana Perez", phone: "+591 70000000", email: "" },
  delivery: { city: "Santa Cruz de la Sierra", zone: "Equipetrol", address: "Av. San Martin 123" },
};

describe("validateCheckoutInput", () => {
  it("accepts a valid payload and normalizes it", () => {
    const result = validateCheckoutInput(VALID_INPUT);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.items).toEqual([{ id: "isdin-fusion-water-magic-spf-50", quantity: 2 }]);
      expect(result.data.customer.name).toBe("Ana Perez");
      expect(result.data.customer.email).toBeUndefined();
    }
  });

  it("rejects a short name", () => {
    const result = validateCheckoutInput({ ...VALID_INPUT, customer: { ...VALID_INPUT.customer, name: "A" } });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeTruthy();
  });

  it("rejects an invalid phone", () => {
    const result = validateCheckoutInput({ ...VALID_INPUT, customer: { ...VALID_INPUT.customer, phone: "abc" } });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.phone).toBeTruthy();
  });

  it("requires cityOther when city is Otra", () => {
    const result = validateCheckoutInput({ ...VALID_INPUT, delivery: { ...VALID_INPUT.delivery, city: "Otra" } });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.cityOther).toBeTruthy();
  });

  it("rejects an empty cart", () => {
    const result = validateCheckoutInput({ ...VALID_INPUT, items: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.items).toBeTruthy();
  });
});

describe("buildOrderLines / computeOrderTotals", () => {
  it("resolves known ids, drops unknown, computes line totals", () => {
    const lines = buildOrderLines(
      [
        { id: "isdin-fusion-water-magic-spf-50", quantity: 2 },
        { id: "no-existe", quantity: 1 },
      ],
      CATALOG,
    );
    expect(lines).toHaveLength(1);
    expect(lines[0].lineTotal).toBeCloseTo(401.5, 2);
    expect(lines[0].discountTotal).toBeCloseTo(40.15, 2);
  });

  it("totals subtract the discount from the subtotal", () => {
    const lines = buildOrderLines([{ id: "isdin-fusion-water-magic-spf-50", quantity: 2 }], CATALOG);
    const totals = computeOrderTotals(lines);
    expect(totals.subtotal).toBeCloseTo(401.5, 2);
    expect(totals.discountTotal).toBeCloseTo(40.15, 2);
    expect(totals.total).toBeCloseTo(361.35, 2);
    expect(totals.allPriced).toBe(true);
  });
});

describe("buildNuviaWhatsappUrl", () => {
  it("builds a wa.me url from a raw number", () => {
    expect(buildNuviaWhatsappUrl("+591 75470140", "hola")).toBe("https://wa.me/59175470140?text=hola");
  });
  it("extracts digits from a wa.me url", () => {
    expect(buildNuviaWhatsappUrl("https://wa.me/59175470140", "hola")).toBe("https://wa.me/59175470140?text=hola");
  });
  it("returns null when the number is empty", () => {
    expect(buildNuviaWhatsappUrl("", "hola")).toBeNull();
  });
});

describe("buildWhatsappOrderMessage", () => {
  it("includes the routing marker, shipping note, and omits empty optional fields", () => {
    const lines = buildOrderLines([{ id: "svr-sebiaclear-gel-moussant", quantity: 1 }], CATALOG);
    const totals = computeOrderTotals(lines);
    const message = buildWhatsappOrderMessage({
      publicCode: "NV-TEST",
      lines,
      totals,
      customer: { name: "Ana Perez", phone: "70000000" },
      delivery: { city: "Santa Cruz de la Sierra", address: "Av. San Martin 123" },
    });
    expect(message.startsWith("#NuviaPedido NV-TEST")).toBe(true);
    expect(message).toContain("Envío: se coordina al despachar");
    expect(message).toContain("Total productos: Bs. 211");
    expect(message).not.toContain("Email:");
    expect(message).not.toContain("Zona:");
    expect(message).not.toContain("Descuento:");
  });
});

describe("formatMoney", () => {
  it("rounds BOB and prefixes Bs.", () => {
    expect(formatMoney(200.75)).toBe("Bs. 201");
  });
});
```

- [ ] **Step 2: Correr el test para verificar que falla**

Run: `pnpm vitest run apps/site/src/lib/nuvia-order.test.ts`
Expected: FAIL — `Cannot find module './nuvia-order'`.

- [ ] **Step 3: Implementar `nuvia-order.ts`**

Create `apps/site/src/lib/nuvia-order.ts`:

```ts
// Módulo puro de checkout de Nuvia. SIN imports de Next ni de JSON:
// se testea desde vitest en la raíz y lo comparten cliente y servidor.

export const NUVIA_CITIES = [
  "Santa Cruz de la Sierra",
  "Cochabamba",
  "La Paz",
  "El Alto",
  "Sucre",
  "Tarija",
  "Oruro",
  "Potosí",
  "Montero",
  "Warnes",
  "La Guardia",
  "Cotoca",
  "Otra",
] as const;

export interface CheckoutProduct {
  id: string;
  title: string;
  brand: string;
  category: string;
  size: string;
  priceLabel: string;
  priceValue: number | null;
  currency: string;
  discountPercent: number;
}

export interface CheckoutLine {
  id: string;
  title: string;
  brand: string;
  category: string;
  quantity: number;
  unitPrice: number | null;
  lineTotal: number | null;
  discountPercent: number;
  discountTotal: number;
  priceLabel: string;
}

export interface OrderTotals {
  subtotal: number;
  discountTotal: number;
  total: number;
  allPriced: boolean;
}

export interface CheckoutCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface CheckoutDelivery {
  city: string;
  cityOther?: string;
  zone?: string;
  address: string;
  reference?: string;
  notes?: string;
}

export interface NuviaCheckoutInput {
  storeSlug?: "nuvia";
  items: Array<{ id: string; quantity: number }>;
  customer: CheckoutCustomer;
  delivery: CheckoutDelivery;
}

export type NuviaCheckoutMode = "whatsapp" | "configuration_pending" | "invalid_request";

export interface NuviaCheckoutResponse {
  ok: boolean;
  mode: NuviaCheckoutMode;
  message: string;
  order: {
    publicCode: string;
    persisted: boolean;
    subtotal: number;
    discountTotal: number;
    total: number;
    currency: string;
    items: CheckoutLine[];
  };
  whatsappUrl: string | null;
  requiredConfiguration: string[];
}

export interface CheckoutFieldErrors {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  cityOther?: string;
  address?: string;
  items?: string;
}

export type CheckoutValidation =
  | { ok: true; data: NuviaCheckoutInput }
  | { ok: false; errors: CheckoutFieldErrors };

const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateCheckoutInput(raw: unknown): CheckoutValidation {
  const errors: CheckoutFieldErrors = {};
  const input = (raw ?? {}) as Record<string, unknown>;
  const customer = (input.customer ?? {}) as Record<string, unknown>;
  const delivery = (input.delivery ?? {}) as Record<string, unknown>;
  const rawItems = Array.isArray(input.items) ? input.items : [];

  const items = rawItems
    .map((entry) => {
      const obj = (entry ?? {}) as Record<string, unknown>;
      const id = str(obj.id);
      const quantityRaw = Number((obj.quantity ?? obj.qty) ?? 1);
      const quantity = Number.isFinite(quantityRaw) ? Math.floor(quantityRaw) : 1;
      return { id, quantity };
    })
    .filter((entry) => entry.id.length > 0 && entry.quantity > 0)
    .map((entry) => ({ id: entry.id, quantity: Math.min(99, Math.max(1, entry.quantity)) }));

  if (!items.length) {
    errors.items = "Agrega al menos un producto.";
  }

  const name = str(customer.name);
  if (name.length < 2) {
    errors.name = "Ingresa tu nombre.";
  }

  const phone = str(customer.phone);
  if (!PHONE_RE.test(phone)) {
    errors.phone = "Ingresa un teléfono válido.";
  }

  const email = str(customer.email);
  if (email.length > 0 && !EMAIL_RE.test(email)) {
    errors.email = "Email inválido.";
  }

  const city = str(delivery.city);
  if (city.length < 1) {
    errors.city = "Elige tu ciudad.";
  }

  const cityOther = str(delivery.cityOther);
  if (city === "Otra" && cityOther.length < 2) {
    errors.cityOther = "Especifica la ciudad.";
  }

  const address = str(delivery.address);
  if (address.length < 5) {
    errors.address = "Ingresa tu dirección.";
  }

  const zone = str(delivery.zone);
  const reference = str(delivery.reference);
  const notes = str(delivery.notes);

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      storeSlug: "nuvia",
      items,
      customer: { name, phone, ...(email ? { email } : {}) },
      delivery: {
        city,
        ...(cityOther ? { cityOther } : {}),
        ...(zone ? { zone } : {}),
        address,
        ...(reference ? { reference } : {}),
        ...(notes ? { notes } : {}),
      },
    },
  };
}

export function formatMoney(value: number, currency = "BOB"): string {
  if (currency === "BOB") {
    return `Bs. ${Math.round(value)}`;
  }
  return `${value.toFixed(2)} ${currency}`;
}

export function buildOrderLines(
  items: Array<{ id: string; quantity: number }>,
  products: CheckoutProduct[],
): CheckoutLine[] {
  const map = new Map(products.map((product) => [product.id, product]));

  return items
    .map((item): CheckoutLine | null => {
      const product = map.get(item.id);
      if (!product) {
        return null;
      }

      const quantity = Math.min(99, Math.max(1, Math.floor(Number(item.quantity) || 1)));
      const unitPrice = typeof product.priceValue === "number" ? product.priceValue : null;
      const lineTotal = unitPrice === null ? null : Number((unitPrice * quantity).toFixed(2));
      const discountPercent = product.discountPercent || 0;
      const discountTotal = lineTotal === null ? 0 : Number((lineTotal * (discountPercent / 100)).toFixed(2));

      return {
        id: product.id,
        title: product.title,
        brand: product.brand,
        category: product.category,
        quantity,
        unitPrice,
        lineTotal,
        discountPercent,
        discountTotal,
        priceLabel: product.priceLabel,
      };
    })
    .filter((line): line is CheckoutLine => line !== null);
}

export function computeOrderTotals(lines: CheckoutLine[]): OrderTotals {
  const subtotal = Number(lines.reduce((sum, line) => sum + (line.lineTotal || 0), 0).toFixed(2));
  const discountTotal = Number(lines.reduce((sum, line) => sum + line.discountTotal, 0).toFixed(2));
  const total = Number(Math.max(0, subtotal - discountTotal).toFixed(2));
  const allPriced = lines.length > 0 && lines.every((line) => typeof line.unitPrice === "number");
  return { subtotal, discountTotal, total, allPriced };
}

function normalizeWhatsappDigits(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) {
    return "";
  }
  const waMatch = trimmed.match(/wa\.me\/(\d+)/i);
  if (waMatch) {
    return waMatch[1];
  }
  return trimmed.replace(/\D/g, "");
}

export function buildNuviaWhatsappUrl(rawNumber: string, message: string): string | null {
  const digits = normalizeWhatsappDigits(rawNumber);
  if (!digits) {
    return null;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsappOrderMessage(args: {
  publicCode: string;
  lines: CheckoutLine[];
  totals: OrderTotals;
  customer: CheckoutCustomer;
  delivery: CheckoutDelivery;
  currency?: string;
}): string {
  const { publicCode, lines, totals, customer, delivery } = args;
  const currency = args.currency || "BOB";

  const itemLines = lines
    .map((line) => {
      const label = line.lineTotal !== null ? formatMoney(line.lineTotal, currency) : line.priceLabel;
      return `• ${line.quantity}× ${line.title} — ${label}`;
    })
    .join("\n");

  const city = delivery.city === "Otra" && delivery.cityOther ? delivery.cityOther : delivery.city;

  const parts: string[] = [
    `#NuviaPedido ${publicCode}`,
    "Hola Nuvia 👋 Confirmo mi pedido:",
    "",
    `🛒 PEDIDO ${publicCode}`,
    itemLines,
    "",
    `Subtotal: ${formatMoney(totals.subtotal, currency)}`,
  ];

  if (totals.discountTotal > 0) {
    parts.push(`Descuento: -${formatMoney(totals.discountTotal, currency)}`);
  }

  parts.push(
    `Total productos: ${formatMoney(totals.total, currency)}`,
    "Envío: se coordina al despachar según mi zona",
    "",
    "👤 CLIENTE",
    `Nombre: ${customer.name}`,
    `Teléfono: ${customer.phone}`,
  );

  if (customer.email) {
    parts.push(`Email: ${customer.email}`);
  }

  parts.push("", "📍 ENTREGA", `Ciudad: ${city}`);
  if (delivery.zone) {
    parts.push(`Zona: ${delivery.zone}`);
  }
  parts.push(`Dirección: ${delivery.address}`);
  if (delivery.reference) {
    parts.push(`Referencia: ${delivery.reference}`);
  }
  if (delivery.notes) {
    parts.push(`Notas: ${delivery.notes}`);
  }

  return parts.join("\n");
}
```

- [ ] **Step 4: Correr el test para verificar que pasa**

Run: `pnpm vitest run apps/site/src/lib/nuvia-order.test.ts`
Expected: PASS (todos los casos).

- [ ] **Step 5: Commit**

```bash
git add apps/site/src/lib/nuvia-order.ts apps/site/src/lib/nuvia-order.test.ts
git commit -m "feat(nuvia): modulo puro de checkout (validacion + totales + mensaje WhatsApp)"
```

---

## Task 2: Hook de carrito extraído `nuvia-cart.ts`

**Files:**
- Create: `apps/site/src/lib/nuvia-cart.ts`

Extrae el core del hook `useCart` (hoy dentro de `nuvia-store.tsx:379-550`), sin notices/drawer/promo, para reusarlo en la página de checkout.

- [ ] **Step 1: Crear `nuvia-cart.ts`**

```ts
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
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter site exec tsc --noEmit`
Expected: PASS (sin errores nuevos).

- [ ] **Step 3: Commit**

```bash
git add apps/site/src/lib/nuvia-cart.ts
git commit -m "feat(nuvia): extrae useNuviaCart (hook core reutilizable de carrito)"
```

---

## Task 3: `nuvia-store.tsx` compone `useNuviaCart`

**Files:**
- Modify: `apps/site/src/components/nuvia/nuvia-store.tsx:379-550` (cuerpo de `useCart`)

Reemplaza el core del `useCart` por una composición de `useNuviaCart`, preservando el mismo shape de retorno (para no tocar `CartDrawer` ni el resto del storefront).

- [ ] **Step 1: Agregar el import**

En el bloque de imports (arriba, junto a los `@/lib`), agregar:

```ts
import { useNuviaCart } from "@/lib/nuvia-cart";
```

- [ ] **Step 2: Reemplazar el cuerpo de `useCart`**

Sustituir toda la función `useCart` (`nuvia-store.tsx:379-550`) por:

```ts
function useCart(cartProducts: CartProduct[]) {
  const core = useNuviaCart(cartProducts);
  const { productMap, ready } = core;
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState<NuviaNotice[]>([]);

  const pushNotice = useCallback((notice: Omit<NuviaNotice, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setNotices((current) => [...current.slice(-2), { ...notice, id }]);
  }, []);

  const dismissNotice = useCallback((id: string) => {
    setNotices((current) => current.filter((notice) => notice.id !== id));
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (window.sessionStorage.getItem(PROMO_NOTICE_KEY)) {
      return;
    }
    const timer = window.setTimeout(() => {
      pushNotice({
        tone: "promo",
        title: "destacados del mes",
        body: "10% de descuento en productos seleccionados. El carrito lo calcula automaticamente.",
      });
      window.sessionStorage.setItem(PROMO_NOTICE_KEY, "shown");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [pushNotice, ready]);

  useEffect(() => {
    document.documentElement.classList.toggle("nuvia-cart-open", open);
    return () => document.documentElement.classList.remove("nuvia-cart-open");
  }, [open]);

  const add = useCallback(
    (id: string, qty = 1) => {
      const amount = Math.max(1, Math.floor(Number(qty) || 1));
      const product = productMap.get(id);
      core.add(id, amount);
      pushNotice({
        tone: "success",
        title: "agregado al carrito",
        body: product ? `${briefProductTitle({ titulo: product.title })} x ${amount}` : "Producto agregado.",
      });
      setOpen(true);
    },
    [core, productMap, pushNotice],
  );

  const addMany = useCallback(
    (items: Array<{ id: string; qty?: number }>, label = "pack") => {
      const added = core.addMany(items);
      if (!added) {
        pushNotice({
          tone: "error",
          title: "pack no disponible",
          body: "No encontramos productos activos para este pack.",
        });
        return;
      }
      pushNotice({
        tone: "success",
        title: `${label} agregado`,
        body: `${added} productos agregados al carrito.`,
      });
      setOpen(true);
    },
    [core, pushNotice],
  );

  return {
    add,
    addMany,
    cart: core.cart,
    clear: core.clear,
    decrease: core.decrease,
    dismissNotice,
    discountTotal: core.discountTotal,
    increase: core.increase,
    notices,
    open,
    priced: core.priced,
    productMap,
    pushNotice,
    remove: core.remove,
    setOpen,
    subtotal: core.subtotal,
    total: core.total,
    totalCount: core.totalCount,
  };
}
```

- [ ] **Step 3: Eliminar el `STORAGE_KEY` y `CartLine` locales (ahora viven en `nuvia-cart.ts`)**

- Borrar `type CartLine = { id: string; qty: number };` (`nuvia-store.tsx:17-20`) si no queda ningún otro uso. Si `CartLine` se usa en otro lado del archivo, importar `type NuviaCartLine as CartLine` desde `@/lib/nuvia-cart`.
- Borrar `const STORAGE_KEY = "nuvia-next-cart-v1";` (`nuvia-store.tsx:82`).

Verificar que no queden referencias:

Run: `pnpm exec grep -rn "STORAGE_KEY\|CartLine" apps/site/src/components/nuvia/nuvia-store.tsx`
Expected: sin resultados (o solo el import de `NuviaCartLine` si se necesitó).

- [ ] **Step 4: Typecheck + build**

Run: `pnpm --filter site exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Verificar el storefront en el navegador**

Run: `pnpm preview:nuvia`
Verificar en `http://127.0.0.1:4174/nuvia`: agregar un producto al carrito incrementa el contador, abre el drawer, muestra el toast "agregado al carrito", y el subtotal se calcula. Recargar mantiene el carrito (localStorage).

- [ ] **Step 6: Commit**

```bash
git add apps/site/src/components/nuvia/nuvia-store.tsx
git commit -m "refactor(nuvia): useCart compone useNuviaCart (mismo comportamiento, menos monolito)"
```

---

## Task 4: `nuvia-commerce.ts` — flujo WhatsApp

**Files:**
- Modify: `apps/site/src/lib/nuvia-commerce.ts`

- [ ] **Step 1: Reemplazar el bloque de tipos de request/response (líneas 1-100)**

Sustituir desde el `import` inicial hasta justo antes de `const DEFAULT_CURRENCY` por:

```ts
import { nuvia, nuviaCartProducts } from "@/lib/nuvia-data";
import {
  buildNuviaWhatsappUrl,
  buildOrderLines,
  buildWhatsappOrderMessage,
  computeOrderTotals,
  validateCheckoutInput,
  type CheckoutCustomer,
  type CheckoutDelivery,
  type CheckoutLine,
  type NuviaCheckoutResponse,
  type OrderTotals,
} from "@/lib/nuvia-order";

type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
  schema: string;
};

type PersistedOrder = {
  id: string | null;
  publicCode: string;
  persisted: boolean;
  requiredConfiguration: string[];
};
```

> Nota: se eliminan los tipos viejos `NuviaCheckoutLineInput`, `NuviaCheckoutCustomerInput`, `NuviaCheckoutRequest`, `NuviaCheckoutLine`, `NuviaCheckoutResponse`, `PaymentStatus`, `PaymentCreationInput`, `PaymentCreationResult` de este bloque. Los tipos `PaymentCreationInput`/`PaymentCreationResult`/`PaymentStatus` que usan las funciones BNB (dormidas) se conservan: moverlos junto a `createBnbQrPayment` (paso 4) o dejarlos donde están si no colisionan. Confirmar con el typecheck del paso 6.

- [ ] **Step 2: Eliminar `getPositiveQuantity` (muerto)**

Borrar la función `getPositiveQuantity` (ya no se usa; `buildOrderLines` maneja la cantidad).

- [ ] **Step 3: Reemplazar `persistOrder` por la versión con `delivery`**

Sustituir la función `persistOrder` completa por:

```ts
async function persistOrder({
  customer,
  delivery,
  lines,
  totals,
  publicCode,
}: {
  customer: CheckoutCustomer;
  delivery: CheckoutDelivery;
  lines: CheckoutLine[];
  totals: OrderTotals;
  publicCode: string;
}): Promise<PersistedOrder> {
  const config = getSupabaseConfig();
  if (!config) {
    return { id: null, publicCode, persisted: false, requiredConfiguration: getMissingSupabaseConfig() };
  }

  const storeId = await getStoreId(config);
  if (!storeId) {
    return { id: null, publicCode, persisted: false, requiredConfiguration: ["web_factory.stores row for slug=nuvia"] };
  }

  const deliveryCity = delivery.city === "Otra" && delivery.cityOther ? delivery.cityOther : delivery.city;
  const deliveryAddress = [
    delivery.address,
    delivery.zone ? `Zona: ${delivery.zone}` : "",
    delivery.reference ? `Ref: ${delivery.reference}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  const createdOrders = await supabaseRequest<Array<{ id: string; public_code: string }>>(config, "orders", {
    method: "POST",
    headers: { prefer: "return=representation" },
    body: JSON.stringify({
      store_id: storeId,
      public_code: publicCode,
      customer_name: customer.name || null,
      customer_email: customer.email || null,
      customer_phone: customer.phone || null,
      customer_tax_id: null,
      delivery_city: deliveryCity || null,
      delivery_address: deliveryAddress || null,
      customer_notes: delivery.notes || null,
      status: totals.total > 0 ? "pending_payment" : "draft",
      payment_status: "unpaid",
      subtotal: totals.subtotal,
      discount_total: totals.discountTotal,
      total: totals.total,
      currency: DEFAULT_CURRENCY,
      raw: {
        source: "nuvia-next-api",
        channel: "whatsapp",
        product_source: "web-factory/data/clients/nuvia.json",
        contact_configured: Boolean(nuvia.contacto.whatsapp),
      },
    }),
  });

  const order = createdOrders[0];
  if (!order?.id) {
    throw new Error("Supabase did not return created order");
  }

  await supabaseRequest(config, "order_items", {
    method: "POST",
    body: JSON.stringify(
      lines.map((line) => ({
        order_id: order.id,
        product_slug: line.id,
        title: line.title,
        brand: line.brand || null,
        category: line.category || null,
        quantity: line.quantity,
        unit_price: line.unitPrice,
        line_total: line.lineTotal,
        price_label: line.priceLabel,
        raw: {
          frontend_id: line.id,
          discount_percent: line.discountPercent,
          discount_total: line.discountTotal,
        },
      })),
    ),
  });

  return { id: order.id, publicCode: order.public_code, persisted: true, requiredConfiguration: [] };
}
```

- [ ] **Step 4: Marcar las funciones BNB como dormidas (exportadas)**

Para evitar warnings de "unused" y dejarlas listas para el futuro pago online, anteponer `export` a las funciones BNB que dejan de invocarse: `getMissingBnbConfig`, `getBnbBaseConfig`, `createBnbQrPayment`, `persistPayment`. Ejemplo:

```ts
// Dormido: se reactiva cuando lleguen credenciales BNB (ver spec §6).
export async function createBnbQrPayment(input: PaymentCreationInput): Promise<PaymentCreationResult> {
```

`getNuviaPaymentStatus` se mantiene sin cambios (la usa la ruta de status).

- [ ] **Step 5: Reemplazar `createNuviaCheckout` por el flujo WhatsApp**

Sustituir la función `createNuviaCheckout` completa por:

```ts
function invalidResponse(message: string): NuviaCheckoutResponse {
  return {
    ok: false,
    mode: "invalid_request",
    message,
    order: {
      publicCode: createPublicCode(),
      persisted: false,
      subtotal: 0,
      discountTotal: 0,
      total: 0,
      currency: DEFAULT_CURRENCY,
      items: [],
    },
    whatsappUrl: null,
    requiredConfiguration: [],
  };
}

export async function createNuviaCheckout(input: unknown): Promise<NuviaCheckoutResponse> {
  const validation = validateCheckoutInput(input);
  if (!validation.ok) {
    const firstError = Object.values(validation.errors)[0] || "Datos de checkout inválidos.";
    return invalidResponse(firstError);
  }

  const { items, customer, delivery } = validation.data;
  const lines = buildOrderLines(items, nuviaCartProducts);
  if (!lines.length) {
    return invalidResponse("No encontramos productos válidos en el carrito.");
  }

  const totals = computeOrderTotals(lines);
  const fallbackCode = createPublicCode();
  const persisted = await persistOrder({ customer, delivery, lines, totals, publicCode: fallbackCode });
  const publicCode = persisted.publicCode || fallbackCode;

  const message = buildWhatsappOrderMessage({ publicCode, lines, totals, customer, delivery });
  const whatsappUrl = buildNuviaWhatsappUrl(nuvia.contacto.whatsapp || "", message);

  const requiredConfiguration = [...persisted.requiredConfiguration];
  if (!whatsappUrl) {
    requiredConfiguration.push("contacto.whatsapp");
  }

  return {
    ok: true,
    mode: whatsappUrl ? "whatsapp" : "configuration_pending",
    message: whatsappUrl
      ? "Pedido listo. Te abrimos WhatsApp para enviarlo a Nuvia."
      : "Pedido calculado. Falta configurar el WhatsApp de Nuvia para enviar el pedido.",
    order: {
      publicCode,
      persisted: persisted.persisted,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      total: totals.total,
      currency: DEFAULT_CURRENCY,
      items: lines,
    },
    whatsappUrl,
    requiredConfiguration,
  };
}
```

- [ ] **Step 6: Typecheck**

Run: `pnpm --filter site exec tsc --noEmit`
Expected: PASS. Si `tsc` marca `PaymentCreationInput`/`PaymentStatus` sin usar, confirmá que quedaron junto a las funciones BNB exportadas (paso 4).

- [ ] **Step 7: Commit**

```bash
git add apps/site/src/lib/nuvia-commerce.ts
git commit -m "feat(nuvia): checkout server = flujo WhatsApp (total productos, sin envio); BNB dormido"
```

---

## Task 5: Ruta API pasa el body crudo

**Files:**
- Modify: `apps/site/src/app/api/nuvia/checkout/route.ts`

- [ ] **Step 1: Reemplazar el handler**

`createNuviaCheckout` ahora valida internamente, así que la ruta pasa el body sin castear:

```ts
import { NextResponse } from "next/server";
import { createNuviaCheckout } from "@/lib/nuvia-commerce";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, mode: "invalid_request", message: "El cuerpo del checkout debe ser JSON valido." },
      { status: 400 },
    );
  }

  try {
    const checkout = await createNuviaCheckout(payload);
    return NextResponse.json(checkout, { status: checkout.ok ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido creando checkout.";
    return NextResponse.json({ ok: false, mode: "invalid_request", message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `pnpm --filter site exec tsc --noEmit`
Expected: PASS.

```bash
git add apps/site/src/app/api/nuvia/checkout/route.ts
git commit -m "refactor(nuvia): la ruta de checkout delega la validacion al servicio"
```

---

## Task 6: Componente `nuvia-checkout.tsx`

**Files:**
- Create: `apps/site/src/components/nuvia/nuvia-checkout.tsx`

- [ ] **Step 1: Crear el componente**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { CartProduct } from "@/lib/nuvia-data";
import { useNuviaCart } from "@/lib/nuvia-cart";
import {
  NUVIA_CITIES,
  buildNuviaWhatsappUrl,
  buildOrderLines,
  buildWhatsappOrderMessage,
  computeOrderTotals,
  formatMoney,
  validateCheckoutInput,
  type CheckoutFieldErrors,
  type NuviaCheckoutResponse,
} from "@/lib/nuvia-order";

type NuviaCheckoutProps = {
  name: string;
  logoWide: string;
  whatsappNumber: string;
  cartProducts: CartProduct[];
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  cityOther: string;
  zone: string;
  address: string;
  reference: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  city: "Santa Cruz de la Sierra",
  cityOther: "",
  zone: "",
  address: "",
  reference: "",
  notes: "",
};

export function NuviaCheckout({ name, logoWide, whatsappNumber, cartProducts }: NuviaCheckoutProps) {
  const cart = useNuviaCart(cartProducts);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<CheckoutFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NuviaCheckoutResponse | null>(null);
  const [submitError, setSubmitError] = useState("");

  const currency = cart.cart.length ? cart.productMap.get(cart.cart[0].id)?.currency || "BOB" : "BOB";
  const lines = useMemo(
    () => cart.cart.map((item) => ({ item, product: cart.productMap.get(item.id) })).filter((entry) => entry.product),
    [cart.cart, cart.productMap],
  );

  const update = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const buildPayload = () => ({
    storeSlug: "nuvia" as const,
    items: cart.cart.map((item) => ({ id: item.id, quantity: item.qty })),
    customer: { name: form.name, phone: form.phone, email: form.email },
    delivery: {
      city: form.city,
      cityOther: form.cityOther,
      zone: form.zone,
      address: form.address,
      reference: form.reference,
      notes: form.notes,
    },
  });

  const localWhatsappFallback = (): NuviaCheckoutResponse => {
    const orderLines = buildOrderLines(
      cart.cart.map((item) => ({ id: item.id, quantity: item.qty })),
      cartProducts.map((product) => ({
        id: product.id,
        title: product.title,
        brand: product.brand,
        category: product.category,
        size: product.size,
        priceLabel: product.priceLabel,
        priceValue: product.priceValue,
        currency: product.currency,
        discountPercent: product.discountPercent,
      })),
    );
    const totals = computeOrderTotals(orderLines);
    const publicCode = `NV-LOCAL-${Date.now().toString(36).toUpperCase()}`;
    const message = buildWhatsappOrderMessage({
      publicCode,
      lines: orderLines,
      totals,
      customer: { name: form.name, phone: form.phone, ...(form.email ? { email: form.email } : {}) },
      delivery: {
        city: form.city,
        ...(form.cityOther ? { cityOther: form.cityOther } : {}),
        ...(form.zone ? { zone: form.zone } : {}),
        address: form.address,
        ...(form.reference ? { reference: form.reference } : {}),
        ...(form.notes ? { notes: form.notes } : {}),
      },
    });
    return {
      ok: true,
      mode: "whatsapp",
      message: "Pedido listo (modo local). Abrí WhatsApp para enviarlo.",
      order: {
        publicCode,
        persisted: false,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        total: totals.total,
        currency,
        items: orderLines,
      },
      whatsappUrl: buildNuviaWhatsappUrl(whatsappNumber || "", message),
      requiredConfiguration: whatsappNumber ? [] : ["contacto.whatsapp"],
    };
  };

  const finalize = (response: NuviaCheckoutResponse) => {
    setResult(response);
    if (response.whatsappUrl) {
      cart.clear();
      window.open(response.whatsappUrl, "_blank", "noopener");
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError("");

    const validation = validateCheckoutInput(buildPayload());
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/nuvia/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = (await response.json()) as NuviaCheckoutResponse;
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "No se pudo crear el pedido.");
      }
      finalize(data);
    } catch (error) {
      // Resiliencia: si el servidor falla, armamos el pedido localmente.
      const fallback = localWhatsappFallback();
      if (fallback.whatsappUrl) {
        finalize(fallback);
      } else {
        setSubmitError(error instanceof Error ? error.message : "No se pudo crear el pedido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nuvia-checkout-page">
      <header className="nuvia-checkout-header">
        <Link href="/nuvia/catalogo" className="nuvia-checkout-back">
          <ArrowLeft size={18} aria-hidden />
          <span>Volver al catálogo</span>
        </Link>
        <Image src={logoWide} alt={name} width={132} height={36} priority />
      </header>

      {result?.whatsappUrl ? (
        <section className="nuvia-checkout-confirm" aria-live="polite">
          <h1>¡Pedido listo!</h1>
          <p>
            Tu pedido <strong>{result.order.publicCode}</strong> está armado. Te abrimos WhatsApp para enviarlo a Nuvia;
            si no se abrió, tocá el botón.
          </p>
          <a className="nuvia-checkout-wa" href={result.whatsappUrl} target="_blank" rel="noopener noreferrer" data-testid="nuvia-wa-link">
            Abrir WhatsApp y enviar pedido
          </a>
          <p className="nuvia-checkout-shipnote">El costo de envío se coordina al despachar según tu zona.</p>
        </section>
      ) : cart.ready && cart.cart.length === 0 ? (
        <section className="nuvia-checkout-empty">
          <h1>Tu carrito está vacío</h1>
          <p>Agregá productos para completar tu pedido.</p>
          <Link href="/nuvia/catalogo" className="nuvia-checkout-wa">
            Ir al catálogo
          </Link>
        </section>
      ) : (
        <div className="nuvia-checkout-grid">
          <form className="nuvia-checkout-form" onSubmit={submit} noValidate>
            <fieldset>
              <legend>Tus datos</legend>
              <label>
                Nombre completo
                <input value={form.name} onChange={update("name")} autoComplete="name" required />
                {errors.name ? <em>{errors.name}</em> : null}
              </label>
              <label>
                Teléfono / WhatsApp
                <input value={form.phone} onChange={update("phone")} inputMode="tel" autoComplete="tel" required />
                {errors.phone ? <em>{errors.phone}</em> : null}
              </label>
              <label>
                Email (opcional)
                <input value={form.email} onChange={update("email")} inputMode="email" autoComplete="email" />
                {errors.email ? <em>{errors.email}</em> : null}
              </label>
            </fieldset>

            <fieldset>
              <legend>Entrega</legend>
              <label>
                Ciudad
                <select value={form.city} onChange={update("city")}>
                  {NUVIA_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city ? <em>{errors.city}</em> : null}
              </label>
              {form.city === "Otra" ? (
                <label>
                  ¿Qué ciudad?
                  <input value={form.cityOther} onChange={update("cityOther")} />
                  {errors.cityOther ? <em>{errors.cityOther}</em> : null}
                </label>
              ) : null}
              <label>
                Zona / barrio
                <input
                  value={form.zone}
                  onChange={update("zone")}
                  placeholder={form.city === "Santa Cruz de la Sierra" ? "Ej: Equipetrol, Plan 3000, Norte…" : "Zona o barrio"}
                />
              </label>
              <label>
                Dirección exacta
                <input value={form.address} onChange={update("address")} autoComplete="street-address" required />
                {errors.address ? <em>{errors.address}</em> : null}
              </label>
              <label>
                Referencia (cómo llegar)
                <input value={form.reference} onChange={update("reference")} />
              </label>
              <label>
                Notas del pedido
                <textarea value={form.notes} onChange={update("notes")} rows={2} />
              </label>
            </fieldset>

            {submitError ? <p className="nuvia-checkout-error">{submitError}</p> : null}
            {result && !result.whatsappUrl ? (
              <p className="nuvia-checkout-error">
                Pedido {result.order.publicCode} calculado, pero el canal de WhatsApp está en configuración. Contactá a Nuvia con ese código.
              </p>
            ) : null}

            <button type="submit" className="nuvia-checkout-submit" disabled={loading || cart.cart.length === 0}>
              {loading ? "Preparando pedido…" : "Enviar pedido por WhatsApp"}
            </button>
            <p className="nuvia-checkout-trust">
              <ShieldCheck size={15} aria-hidden /> El envío se coordina y cobra al despachar según tu zona.
            </p>
          </form>

          <aside className="nuvia-checkout-summary" aria-label="Resumen del pedido">
            <h2>Tu pedido</h2>
            <ul>
              {lines.map(({ item, product }) => (
                <li key={item.id}>
                  <Image src={product!.image} alt={product!.imageAlt} width={56} height={64} />
                  <div>
                    <span>{product!.brand}</span>
                    <strong>{product!.title}</strong>
                    <small>
                      {item.qty} ×{" "}
                      {typeof product!.priceValue === "number"
                        ? formatMoney(product!.priceValue, product!.currency)
                        : product!.priceLabel}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{cart.priced ? formatMoney(cart.subtotal, currency) : "a cotizar"}</dd>
              </div>
              {cart.discountTotal > 0 ? (
                <div>
                  <dt>Descuento</dt>
                  <dd>-{formatMoney(cart.discountTotal, currency)}</dd>
                </div>
              ) : null}
              <div className="nuvia-checkout-total">
                <dt>Total productos</dt>
                <dd>{cart.priced ? formatMoney(cart.total, currency) : "a cotizar"}</dd>
              </div>
              <div className="nuvia-checkout-ship">
                <dt>Envío</dt>
                <dd>se coordina al despachar</dd>
              </div>
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `pnpm --filter site exec tsc --noEmit`
Expected: PASS.

```bash
git add apps/site/src/components/nuvia/nuvia-checkout.tsx
git commit -m "feat(nuvia): componente de checkout (resumen + formulario + CTA WhatsApp)"
```

---

## Task 7: Ruta `app/nuvia/checkout/page.tsx`

**Files:**
- Create: `apps/site/src/app/nuvia/checkout/page.tsx`

- [ ] **Step 1: Crear la ruta**

```tsx
import type { Metadata } from "next";
import { NuviaCheckout } from "@/components/nuvia/nuvia-checkout";
import { nuvia, nuviaCartProducts, publicAsset } from "@/lib/nuvia-data";

export const metadata: Metadata = {
  title: `Finalizar compra | ${nuvia.nombre}`,
  description: "Completá tus datos y enviá tu pedido a Nuvia por WhatsApp. El envío se coordina al despachar.",
};

export default function CheckoutPage() {
  return (
    <NuviaCheckout
      name={nuvia.nombre}
      logoWide={publicAsset(nuvia.logoWide)}
      whatsappNumber={nuvia.contacto.whatsapp}
      cartProducts={nuviaCartProducts}
    />
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `pnpm --filter site exec tsc --noEmit`
Expected: PASS.

```bash
git add apps/site/src/app/nuvia/checkout/page.tsx
git commit -m "feat(nuvia): ruta /nuvia/checkout"
```

---

## Task 8: Estilos `.nuvia-checkout-*`

**Files:**
- Modify: `apps/site/src/app/globals.css` (agregar al final)

- [ ] **Step 1: Agregar el bloque de estilos**

```css
/* ===== Nuvia checkout ===== */
.nuvia-checkout-page {
  max-width: 1040px;
  margin: 0 auto;
  padding: 16px 16px 64px;
  color: #0f2d52;
}
.nuvia-checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 20px;
}
.nuvia-checkout-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #0f2d52;
  text-decoration: none;
}
.nuvia-checkout-back:hover { color: #00a7a0; }
.nuvia-checkout-grid { display: grid; gap: 20px; }
.nuvia-checkout-form { display: grid; gap: 18px; }
.nuvia-checkout-form fieldset {
  border: 1px solid rgba(15, 45, 82, 0.12);
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 12px;
}
.nuvia-checkout-form legend { font-weight: 600; padding: 0 6px; }
.nuvia-checkout-form label { display: grid; gap: 6px; font-size: 0.85rem; font-weight: 500; }
.nuvia-checkout-form input,
.nuvia-checkout-form select,
.nuvia-checkout-form textarea {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid rgba(15, 45, 82, 0.2);
  border-radius: 10px;
  font: inherit;
  background: #fff;
}
.nuvia-checkout-form input:focus,
.nuvia-checkout-form select:focus,
.nuvia-checkout-form textarea:focus {
  outline: 2px solid #00a7a0;
  outline-offset: 1px;
  border-color: #00a7a0;
}
.nuvia-checkout-form label em {
  color: #d33;
  font-style: normal;
  font-size: 0.78rem;
}
.nuvia-checkout-submit {
  width: 100%;
  padding: 15px;
  border: 0;
  border-radius: 12px;
  background: #ff6b6b;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 150ms ease, transform 150ms ease;
}
.nuvia-checkout-submit:hover:not(:disabled) { background: #f2564f; transform: translateY(-1px); }
.nuvia-checkout-submit:disabled { opacity: 0.55; cursor: not-allowed; }
.nuvia-checkout-trust {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: rgba(15, 45, 82, 0.7);
}
.nuvia-checkout-error { color: #d33; font-size: 0.85rem; }
.nuvia-checkout-summary {
  border: 1px solid rgba(15, 45, 82, 0.12);
  border-radius: 16px;
  padding: 16px;
  background: #fffbf4;
  align-self: start;
}
.nuvia-checkout-summary h2 { margin: 0 0 12px; font-size: 1.05rem; }
.nuvia-checkout-summary ul { list-style: none; margin: 0 0 14px; padding: 0; display: grid; gap: 12px; }
.nuvia-checkout-summary li { display: grid; grid-template-columns: 56px 1fr; gap: 10px; align-items: center; }
.nuvia-checkout-summary li img { border-radius: 8px; object-fit: contain; background: #fff; }
.nuvia-checkout-summary li div { display: grid; gap: 1px; }
.nuvia-checkout-summary li span { font-size: 0.72rem; color: rgba(15, 45, 82, 0.6); }
.nuvia-checkout-summary li strong { font-size: 0.85rem; line-height: 1.2; }
.nuvia-checkout-summary li small { font-size: 0.8rem; color: #00a7a0; }
.nuvia-checkout-summary dl { display: grid; gap: 8px; margin: 0; border-top: 1px solid rgba(15, 45, 82, 0.12); padding-top: 12px; }
.nuvia-checkout-summary dl div { display: flex; justify-content: space-between; font-size: 0.9rem; }
.nuvia-checkout-summary dl dt, .nuvia-checkout-summary dl dd { margin: 0; }
.nuvia-checkout-total { font-weight: 700; font-size: 1rem !important; }
.nuvia-checkout-ship { color: rgba(15, 45, 82, 0.65); font-size: 0.82rem !important; }
.nuvia-checkout-confirm, .nuvia-checkout-empty { text-align: center; padding: 48px 16px; display: grid; gap: 14px; justify-items: center; }
.nuvia-checkout-confirm h1, .nuvia-checkout-empty h1 { font-size: 1.6rem; margin: 0; }
.nuvia-checkout-wa {
  display: inline-block;
  padding: 14px 22px;
  border-radius: 12px;
  background: #25d366;
  color: #05331b;
  font-weight: 600;
  text-decoration: none;
}
.nuvia-checkout-wa:hover { background: #1fbf5b; }
.nuvia-checkout-shipnote { font-size: 0.85rem; color: rgba(15, 45, 82, 0.7); }

@media (min-width: 860px) {
  .nuvia-checkout-grid { grid-template-columns: 1.4fr 1fr; align-items: start; }
  .nuvia-checkout-summary { position: sticky; top: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .nuvia-checkout-submit { transition: none; }
}
```

- [ ] **Step 2: Verificar en el navegador**

Run: `pnpm preview:nuvia`
Abrir `http://127.0.0.1:4174/nuvia/checkout` (con un producto en el carrito). Verificar: en mobile una columna, en desktop dos columnas con resumen sticky, foco visible en inputs, botón coral. La nota de envío aparece.

- [ ] **Step 3: Commit**

```bash
git add apps/site/src/app/globals.css
git commit -m "feat(nuvia): estilos del checkout (mobile-first, resumen sticky)"
```

---

## Task 9: Recablear el CTA del drawer → `/nuvia/checkout`

**Files:**
- Modify: `apps/site/src/components/nuvia/nuvia-store.tsx` (`CartDrawer`, ~657-870)

- [ ] **Step 1: Quitar la lógica de checkout POST del drawer**

Dentro de `CartDrawer`, eliminar: los estados `checkoutLoading`, `checkoutResult`, `checkoutError`, la función `startCheckout`, y el bloque JSX que renderiza `checkoutResult`/`checkoutError`. Eliminar también el `type CheckoutResult` (`nuvia-store.tsx:56-80`) si no queda otro uso.

- [ ] **Step 2: Reemplazar el botón del footer por un Link**

En el `<footer>` del drawer, reemplazar el `<button className="nuvia-cart-checkout-button" ...>` (y su contenido) por:

```tsx
<Link
  className="nuvia-cart-checkout-button"
  href="/nuvia/checkout"
  onClick={() => setOpen(false)}
  aria-disabled={!totalCount}
  data-disabled={!totalCount ? "true" : undefined}
>
  {totalCount ? "finalizar compra" : "tu carrito está vacío"}
</Link>
```

Agregar en `globals.css` (junto a los estilos del carrito) el estado disabled del link:

```css
.nuvia-cart-checkout-button[data-disabled="true"] { pointer-events: none; opacity: 0.5; }
```

- [ ] **Step 3: Typecheck + verificar el flujo**

Run: `pnpm --filter site exec tsc --noEmit`
Expected: PASS.

Run: `pnpm preview:nuvia`
Verificar: agregar producto → abrir drawer → "finalizar compra" navega a `/nuvia/checkout` con el carrito cargado.

- [ ] **Step 4: Commit**

```bash
git add apps/site/src/components/nuvia/nuvia-store.tsx apps/site/src/app/globals.css
git commit -m "feat(nuvia): el drawer navega a /nuvia/checkout (retira el POST directo)"
```

---

## Task 10: Cargar el número de WhatsApp en los datos

**Files:**
- Modify: `web-factory/data/clients/nuvia.json` → objeto `contacto`

- [ ] **Step 1: Setear `contacto.whatsapp`**

En `nuvia.json`, en el objeto `contacto`, cambiar `"whatsapp": ""` por:

```json
"whatsapp": "59175470140",
```

(Número ONIA provisional; swappable por uno dedicado de Nuvia con esta misma línea.)

- [ ] **Step 2: Verificar que el catálogo público no filtra datos privados**

Run: `pnpm nuvia:sanitize-public`
Expected: corre sin borrar el número (el sanitizador limpia metadata de proveedor, no `contacto`). Si el sanitizador tocara `contacto`, revertir y setear el número después de sanitizar.

- [ ] **Step 3: Commit**

```bash
git add web-factory/data/clients/nuvia.json
git commit -m "chore(nuvia): configura WhatsApp de checkout (numero ONIA provisional)"
```

---

## Task 11: Arnés E2E de la app Next

**Files:**
- Create: `playwright.next.config.ts`
- Create: `tests/e2e-next/nuvia-checkout.spec.ts`
- Modify: `package.json` (script `e2e:next`)

- [ ] **Step 1: Config de Playwright para la app Next**

Create `playwright.next.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 4174;

/**
 * E2E de la app Next real (apps/site), separado del sitio estático (playwright.config.ts).
 * El build se hace en el script `e2e:next`; aquí solo levantamos `next start`.
 */
export default defineConfig({
  testDir: "./tests/e2e-next",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm --filter site exec next start -p ${PORT} -H 127.0.0.1`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

- [ ] **Step 2: Script `e2e:next`**

En `package.json` (root), agregar a `scripts`:

```json
"e2e:next": "pnpm --filter site build && playwright test --config=playwright.next.config.ts"
```

- [ ] **Step 3: Escribir el spec E2E**

Create `tests/e2e-next/nuvia-checkout.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const PRODUCT_ID = "isdin-fusion-water-magic-spf-50";

test.describe("Nuvia checkout", () => {
  test.beforeEach(async ({ page }) => {
    // Evita que el popup de WhatsApp navegue fuera durante el test.
    await page.addInitScript(() => {
      window.open = () => null;
    });
  });

  test("captura datos y arma el link de WhatsApp con el marcador Nuvia", async ({ page }) => {
    // Sembrar el carrito directamente en localStorage (determinista).
    await page.goto("/nuvia");
    await page.evaluate((id) => {
      window.localStorage.setItem("nuvia-next-cart-v1", JSON.stringify([{ id, qty: 2 }]));
    }, PRODUCT_ID);

    await page.goto("/nuvia/checkout");

    // El resumen muestra un total de productos.
    await expect(page.getByText("Total productos")).toBeVisible();

    // Completar el formulario.
    await page.getByLabel("Nombre completo").fill("Ana Perez");
    await page.getByLabel("Teléfono / WhatsApp").fill("70000000");
    await page.getByLabel("Dirección exacta").fill("Av. San Martin 123, Equipetrol");

    await page.getByRole("button", { name: /enviar pedido por whatsapp/i }).click();

    // Confirmación con link de WhatsApp al número configurado y el marcador.
    const waLink = page.getByTestId("nuvia-wa-link");
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute("href");
    expect(href).toContain("wa.me/59175470140");
    expect(href).toContain("%23NuviaPedido");
  });

  test("muestra estado vacío sin carrito", async ({ page }) => {
    await page.goto("/nuvia");
    await page.evaluate(() => window.localStorage.removeItem("nuvia-next-cart-v1"));
    await page.goto("/nuvia/checkout");
    await expect(page.getByText("Tu carrito está vacío")).toBeVisible();
  });
});
```

- [ ] **Step 4: Instalar el navegador de Playwright (si hace falta) y correr**

Run: `pnpm e2e:install` (una vez, si no está chromium)
Run: `pnpm e2e:next`
Expected: PASS ambos tests en chromium y mobile. (El build corre primero; luego `next start` sirve en :4174.)

- [ ] **Step 5: Commit**

```bash
git add playwright.next.config.ts tests/e2e-next/nuvia-checkout.spec.ts package.json
git commit -m "test(nuvia): primer E2E de la app Next (flujo de checkout WhatsApp)"
```

---

## Task 12: Gates finales + QA + cierre

- [ ] **Step 1: Gates completos**

```bash
pnpm --filter site exec tsc --noEmit
pnpm lint
pnpm vitest run apps/site/src/lib/nuvia-order.test.ts
pnpm e2e:next
```
Expected: todo verde. Corregir lo que falle antes de seguir.

- [ ] **Step 2: QA de navegador (mobile-first)**

Run: `pnpm preview:nuvia`
Verificar en `http://127.0.0.1:4174`:
- `/nuvia` → agregar producto → drawer → "finalizar compra" → `/nuvia/checkout`.
- Checkout: llenar datos, "enviar pedido por WhatsApp" abre `wa.me/59175470140` con el pedido (mensaje empieza con `#NuviaPedido`), carrito se limpia, aparece confirmación.
- Ciudad "Otra" muestra el campo extra y lo exige.
- Mobile (DevTools 375px): una columna, botón alcanzable, sin overflow.
- `prefers-reduced-motion`: sin transición en el botón.

- [ ] **Step 3: Code review**

Usar el subagente `code-reviewer` sobre el diff de la rama. Resolver CRITICAL/HIGH.

- [ ] **Step 4: Rebase + merge a main**

```bash
git fetch origin
git rebase origin/main
# resolver conflictos si los hay, re-correr gates
```
Abrir PR (o merge según flujo del carril). Un ítem cierra cuando su código está en `main`.

---

## Self-Review (completado al escribir el plan)

- **Cobertura del spec:** superficie `/nuvia/checkout` (T6/T7), envío coordinado sin monto (T1 mensaje + T6 UI + T8 nota), total en servidor (T4), captura ciudad/zona/dirección (T1 schema + T6 form), handoff WhatsApp + marcador `#NuviaPedido` (T1/T4), número ONIA provisional (T10), refactor `useNuviaCart` (T2/T3), BNB dormido (T4), tests unit + E2E Next (T1/T11). Todo mapeado.
- **Placeholders:** ninguno; código completo en cada paso.
- **Consistencia de tipos:** `CheckoutProduct/CheckoutLine/OrderTotals/CheckoutCustomer/CheckoutDelivery/NuviaCheckoutResponse` definidos en T1 y usados igual en T4/T6/T7. `useNuviaCart` (T2) devuelve el shape que consumen T3 y T6. `validateCheckoutInput` (T1) usado en T4 y T6. `NUVIA_CART_STORAGE_KEY = "nuvia-next-cart-v1"` coincide con el sembrado del E2E (T11) y el `STORAGE_KEY` original.
