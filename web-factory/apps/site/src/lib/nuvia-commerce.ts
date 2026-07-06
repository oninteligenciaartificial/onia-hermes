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

type PaymentStatus =
  | "requires_configuration"
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "expired";

type PaymentCreationInput = {
  orderId: string | null;
  publicCode: string;
  amount: number;
  currency: string;
  lines: CheckoutLine[];
};

type PaymentCreationResult = {
  status: PaymentStatus;
  providerPaymentId?: string | null;
  providerReference?: string | null;
  qrImageUrl?: string | null;
  qrPayload?: string | null;
  checkoutUrl?: string | null;
  expiresAt?: string | null;
  raw?: Record<string, unknown>;
  requiredCredentials: string[];
};

const DEFAULT_CURRENCY = "BOB";
const STORE_SLUG = "nuvia";

function createPublicCode() {
  return `NV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.WEB_FACTORY_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const serviceRoleKey =
    process.env.WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";
  const schema = process.env.WEB_FACTORY_SUPABASE_SCHEMA || "web_factory";

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
    schema,
  };
}

function getMissingSupabaseConfig() {
  const missing: string[] = [];
  if (!(process.env.WEB_FACTORY_SUPABASE_URL || process.env.SUPABASE_URL)) {
    missing.push("WEB_FACTORY_SUPABASE_URL");
  }
  if (
    !(
      process.env.WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY
    )
  ) {
    missing.push("WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY");
  }
  return missing;
}

async function supabaseRequest<T>(
  config: SupabaseConfig,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("apikey", config.serviceRoleKey);
  headers.set("authorization", `Bearer ${config.serviceRoleKey}`);
  headers.set("accept-profile", config.schema);
  headers.set("content-profile", config.schema);
  headers.set("content-type", "application/json");

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body.slice(0, 500)}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

async function getStoreId(config: SupabaseConfig) {
  const stores = await supabaseRequest<Array<{ id: string }>>(
    config,
    `stores?slug=eq.${encodeURIComponent(STORE_SLUG)}&select=id&limit=1`,
  );
  return stores[0]?.id || null;
}

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

// Dormido: se reactiva cuando lleguen credenciales BNB (ver spec §6).
export function getMissingBnbConfig() {
  const required = ["BNB_ACCOUNT_ID", "BNB_AUTHORIZATION_ID", "BNB_AUTH_BASE_URL", "BNB_QR_BASE_URL"];
  return required.filter((key) => !process.env[key]);
}

// Dormido: se reactiva cuando lleguen credenciales BNB (ver spec §6).
export function getBnbBaseConfig() {
  const missing = getMissingBnbConfig();
  if (missing.length) {
    return { missing };
  }

  return {
    missing,
    accountId: process.env.BNB_ACCOUNT_ID || "",
    authorizationId: process.env.BNB_AUTHORIZATION_ID || "",
    authBaseUrl: (process.env.BNB_AUTH_BASE_URL || "").replace(/\/$/, ""),
    qrBaseUrl: (process.env.BNB_QR_BASE_URL || "").replace(/\/$/, ""),
  };
}

// Dormido: se reactiva cuando lleguen credenciales BNB (ver spec §6).
export async function createBnbQrPayment(input: PaymentCreationInput): Promise<PaymentCreationResult> {
  const config = getBnbBaseConfig();

  if (config.missing.length) {
    return {
      status: "requires_configuration",
      requiredCredentials: config.missing,
      raw: {
        reason: "BNB QR Simple credentials are not configured",
      },
    };
  }

  const authResponse = await fetch(`${config.authBaseUrl}/auth/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      accountId: config.accountId,
      authorizationId: config.authorizationId,
    }),
    cache: "no-store",
  });

  if (!authResponse.ok) {
    return {
      status: "failed",
      requiredCredentials: [],
      raw: {
        step: "auth",
        status: authResponse.status,
        body: (await authResponse.text()).slice(0, 500),
      },
    };
  }

  const authJson = (await authResponse.json()) as Record<string, unknown>;
  const token =
    String(authJson.token || authJson.access_token || authJson.accessToken || authJson.Token || "").trim();

  if (!token) {
    return {
      status: "failed",
      requiredCredentials: [],
      raw: {
        step: "auth",
        reason: "Token was not found in BNB response",
        responseKeys: Object.keys(authJson),
      },
    };
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const qrResponse = await fetch(`${config.qrBaseUrl}/main/getQRWithImageAsync`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      token,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      currency: input.currency,
      amount: input.amount,
      gloss: `Nuvia ${input.publicCode}`,
      expirationDate: expiresAt,
      singleUse: true,
      additionalData: {
        orderId: input.orderId,
        publicCode: input.publicCode,
        itemCount: input.lines.reduce((sum, line) => sum + line.quantity, 0),
      },
    }),
    cache: "no-store",
  });

  const qrText = await qrResponse.text();
  let qrJson: Record<string, unknown> = {};
  try {
    qrJson = JSON.parse(qrText) as Record<string, unknown>;
  } catch {
    qrJson = { rawText: qrText.slice(0, 500) };
  }

  if (!qrResponse.ok) {
    return {
      status: "failed",
      requiredCredentials: [],
      raw: {
        step: "create_qr",
        status: qrResponse.status,
        response: qrJson,
      },
    };
  }

  const qrImage =
    String(qrJson.qrImage || qrJson.qr_image || qrJson.image || qrJson.imagen || qrJson.qr || "").trim();
  const qrPayload = String(qrJson.qrPayload || qrJson.payload || qrJson.qrString || "").trim();
  const providerPaymentId = String(qrJson.id || qrJson.qrId || qrJson.qr_id || qrJson.transactionId || "").trim();
  const qrImageUrl = qrImage
    ? qrImage.startsWith("data:") || qrImage.startsWith("http")
      ? qrImage
      : `data:image/png;base64,${qrImage}`
    : null;

  return {
    status: "pending",
    providerPaymentId: providerPaymentId || null,
    providerReference: providerPaymentId || input.publicCode,
    qrImageUrl,
    qrPayload: qrPayload || null,
    expiresAt,
    requiredCredentials: [],
    raw: {
      step: "create_qr",
      response: qrJson,
    },
  };
}

// Dormido: se reactiva cuando lleguen credenciales BNB (ver spec §6).
export async function persistPayment({
  orderId,
  payment,
  publicCode,
  total,
}: {
  orderId: string | null;
  payment: PaymentCreationResult;
  publicCode: string;
  total: number;
}) {
  if (!orderId) {
    return null;
  }

  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  const providers = await supabaseRequest<Array<{ id: string }>>(
    config,
    "payment_providers?code=eq.bnb_qr_simple&select=id&limit=1",
  );
  const providerId = providers[0]?.id || null;

  const created = await supabaseRequest<Array<{ id: string }>>(config, "payments", {
    method: "POST",
    headers: {
      prefer: "return=representation",
    },
    body: JSON.stringify({
      order_id: orderId,
      provider_id: providerId,
      provider_code: "bnb_qr_simple",
      provider_payment_id: payment.providerPaymentId || null,
      provider_reference: payment.providerReference || publicCode,
      status: payment.status,
      amount: total,
      currency: DEFAULT_CURRENCY,
      qr_payload: payment.qrPayload || null,
      qr_image_url: payment.qrImageUrl || null,
      checkout_url: payment.checkoutUrl || null,
      expires_at: payment.expiresAt || null,
      raw: payment.raw || {},
    }),
  });

  const paymentId = created[0]?.id || null;
  await supabaseRequest(config, "payment_events", {
    method: "POST",
    body: JSON.stringify({
      payment_id: paymentId,
      order_id: orderId,
      provider_code: "bnb_qr_simple",
      event_type: payment.status === "requires_configuration" ? "configuration_missing" : "payment_created",
      event_status: payment.status,
      payload: {
        public_code: publicCode,
        required_credentials: payment.requiredCredentials,
      },
    }),
  });

  return paymentId;
}

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

export async function getNuviaPaymentStatus(paymentId: string) {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      ok: false,
      status: "configuration_pending",
      requiredConfiguration: getMissingSupabaseConfig(),
    };
  }

  const payments = await supabaseRequest<
    Array<{
      id: string;
      provider_code: string;
      provider_payment_id: string | null;
      provider_reference: string | null;
      status: string;
      order_id: string;
    }>
  >(config, `payments?id=eq.${encodeURIComponent(paymentId)}&select=*`);

  const payment = payments[0];
  if (!payment) {
    return {
      ok: false,
      status: "not_found",
      requiredConfiguration: [],
    };
  }

  return {
    ok: true,
    status: payment.status,
    provider: payment.provider_code,
    providerPaymentId: payment.provider_payment_id,
    providerReference: payment.provider_reference,
  };
}
