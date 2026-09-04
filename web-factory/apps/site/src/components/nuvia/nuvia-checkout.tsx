"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
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

  const update = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const submit = async (event: FormEvent) => {
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
