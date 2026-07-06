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

  it("rejects a phone with too few digits", () => {
    const result = validateCheckoutInput({ ...VALID_INPUT, customer: { ...VALID_INPUT.customer, phone: "()-.-()" } });
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
