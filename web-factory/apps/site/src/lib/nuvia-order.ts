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
  if (!PHONE_RE.test(phone) || phone.replace(/\D/g, "").length < 7) {
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
  // BOB se muestra redondeado a bolivianos enteros (convención local; el catálogo
  // ya usa etiquetas "Bs. N"). Los totales internos conservan 2 decimales.
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
      const discountPercent = Math.min(100, Math.max(0, product.discountPercent || 0));
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
