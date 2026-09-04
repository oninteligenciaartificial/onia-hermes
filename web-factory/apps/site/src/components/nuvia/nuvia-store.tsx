"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import {
  type CartProduct,
  type NuviaContenido,
  type NuviaMerchandising,
  type NuviaPack,
  type NuviaProduct,
  productHref,
  productSlug,
} from "@/lib/nuvia-data";
import { useNuviaCart } from "@/lib/nuvia-cart";

type NuviaNotice = {
  id: string;
  tone: "promo" | "success" | "error";
  title: string;
  body: string;
};

type StoreProps = {
  name: string;
  tagline: string;
  description: string;
  logoIcon: string;
  logoWide: string;
  heroVideo: string;
  heroPoster: string;
  products: NuviaProduct[];
  cartProducts: CartProduct[];
  merchandising: NuviaMerchandising;
};

type ProductPageProps = StoreProps & {
  product: NuviaProduct;
};

type RoutineStepDefinition = {
  id: string;
  number: string;
  action: string;
  title: string;
  body: string;
  keywords: string[];
  categories: string[];
};

const PROMO_NOTICE_KEY = "nuvia-promo-notice-20260623";
const CATALOG_PAGE_SIZE = 48;

const ROUTINE_STEPS: RoutineStepDefinition[] = [
  {
    id: "limpiar",
    number: "01",
    action: "limpiar",
    title: "piel limpia sin resecar",
    body: "Empieza retirando grasa, protector y suciedad para que el resto de la rutina trabaje mejor.",
    keywords: ["sebiaclear gel moussant", "limpiador matificante", "gel moussant"],
    categories: ["limpieza facial"],
  },
  {
    id: "tratar",
    number: "02",
    action: "tratar",
    title: "corrige una necesidad",
    body: "Elige serum, ampolla o tratamiento segun piel grasa, manchas, textura o signos de edad.",
    keywords: ["sebiaclear serum", "[c20] biotic", "serum", "ampoule"],
    categories: ["piel grasa", "antiedad", "manchas"],
  },
  {
    id: "hidratar",
    number: "03",
    action: "hidratar",
    title: "repara la barrera",
    body: "Sella la rutina con hidratacion o reparacion para mantener la piel comoda durante el dia.",
    keywords: ["crema de agua ligera", "bariéderm cica", "b3 masque hydra", "hydrac"],
    categories: ["hidratacion"],
  },
  {
    id: "proteger",
    number: "04",
    action: "proteger",
    title: "proteccion diaria",
    body: "Cierra la rutina de manana con SPF. Es el paso que protege la inversion de los anteriores.",
    keywords: ["fusion water magic spf 50", "fusion water magic spf50", "barièsun 100"],
    categories: ["proteccion solar"],
  },
];

function briefProductTitle(product: Pick<NuviaProduct, "titulo">) {
  return product.titulo
    .replace(/\bMagic\b/gi, "")
    .replace(/\s+Gel\s+Moussant\b/gi, " Gel")
    .replace(/\s+Moussant\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function searchableProductText(product: NuviaProduct) {
  return [
    product.titulo,
    product.marca,
    product.categoria,
    product.uso,
    product.beneficios.join(" "),
    product.idealPara.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function findRoutineProduct(products: NuviaProduct[], step: RoutineStepDefinition) {
  const byKeyword = step.keywords
    .map((keyword) => products.find((product) => searchableProductText(product).includes(keyword.toLowerCase())))
    .find(Boolean);

  if (byKeyword) {
    return byKeyword;
  }

  return products.find((product) =>
    step.categories.some((category) => searchableProductText(product).includes(category.toLowerCase())),
  );
}

function buildRoutineSteps(products: NuviaProduct[]) {
  return ROUTINE_STEPS.map((step) => ({
    ...step,
    product: findRoutineProduct(products, step),
  })).filter((step): step is RoutineStepDefinition & { product: NuviaProduct } => Boolean(step.product));
}

function packItems(pack: NuviaPack) {
  return pack.productSlugs.map((id) => ({ id, qty: 1 }));
}

function packPriceLabel(pack: NuviaPack) {
  if (!pack.precioPromocional) {
    return "precio a confirmar";
  }
  return pack.ahorroVisible > 0
    ? `${money(pack.precioPromocional)} con ahorro visible`
    : `${money(pack.precioPromocional)} estimado`;
}

function NuviaUseCases({ merchandising }: { merchandising: NuviaMerchandising }) {
  const useCases = merchandising.casosUso.slice(0, 4);

  if (!useCases.length) {
    return null;
  }

  return (
    <section className="nuvia-usecase-section" data-nuvia-reveal>
      <div className="nuvia-section-heading">
        <span>casos de uso</span>
        <h2>compra por necesidad, no por lista infinita</h2>
        <p>La tienda recomienda rutas simples para que el cliente agregue productos con criterio y llegue al carrito mas rapido.</p>
      </div>
      <div className="nuvia-usecase-grid">
        {useCases.map((item) => (
          <Link href={`/nuvia/catalogo#${item.packId}`} key={item.id}>
            <small>{item.productSlugs.length} productos sugeridos</small>
            <strong>{item.titulo}</strong>
            <p>{item.problema}</p>
            <span>{item.recomendacion}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PackShowcase({
  description,
  limit = 3,
  merchandising,
  onAddMany,
  title,
  variant = "landing",
}: {
  description: string;
  limit?: number;
  merchandising: NuviaMerchandising;
  onAddMany: (items: Array<{ id: string; qty?: number }>, label?: string) => void;
  title: string;
  variant?: "landing" | "catalog";
}) {
  const packs = merchandising.packs.slice(0, limit);

  if (!packs.length) {
    return null;
  }

  return (
    <section className={`nuvia-pack-section is-${variant}`} id="packs" data-nuvia-reveal>
      <div className="nuvia-section-heading">
        <span>packs y combos</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="nuvia-pack-grid">
        {packs.map((pack) => (
          <article className="nuvia-pack-card" id={pack.id} key={pack.id}>
            <div className="nuvia-pack-media" aria-hidden="true">
              {pack.productos.slice(0, 3).map((product) => (
                <Image src={product.imagen} alt="" width={180} height={180} sizes="110px" key={product.slug} />
              ))}
            </div>
            <div className="nuvia-pack-copy">
              <small>{pack.etiqueta}</small>
              <h3>{pack.titulo}</h3>
              <p>{pack.descripcion}</p>
              <ul>
                {pack.productos.slice(0, 3).map((product) => (
                  <li key={product.slug}>
                    <span>{product.marca}</span>
                    <strong>{briefProductTitle({ titulo: product.titulo })}</strong>
                  </li>
                ))}
              </ul>
              <footer>
                <span>{packPriceLabel(pack)}</span>
                <button type="button" onClick={() => onAddMany(packItems(pack), pack.titulo)}>
                  {pack.cta}
                </button>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductRelatedPacks({
  merchandising,
  onAddMany,
  product,
}: {
  merchandising: NuviaMerchandising;
  onAddMany: (items: Array<{ id: string; qty?: number }>, label?: string) => void;
  product: NuviaProduct;
}) {
  const currentSlug = productSlug(product);
  const packs = merchandising.packs.filter((pack) => pack.productSlugs.includes(currentSlug)).slice(0, 2);

  if (!packs.length) {
    return null;
  }

  return (
    <div className="nuvia-pdp-related-packs">
      <span>tambien se compra en pack</span>
      {packs.map((pack) => (
        <article key={pack.id}>
          <div>
            <strong>{pack.titulo}</strong>
            <p>{pack.subtitulo}</p>
          </div>
          <button type="button" onClick={() => onAddMany(packItems(pack), pack.titulo)}>
            agregar pack
          </button>
        </article>
      ))}
    </div>
  );
}

function useDeferredHeroVideo() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // El hero video es un clip mudo/ambiental (sin parpadeos ni audio): se muestra
    // igual bajo prefers-reduced-motion. Solo se respeta el ahorro de datos real.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    if (connection?.saveData) {
      return;
    }

    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let idleId: number | null = null;

    const timerId = window.setTimeout(() => {
      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(() => setShouldLoad(true), { timeout: 1800 });
        return;
      }

      setShouldLoad(true);
    }, 1200);

    return () => {
      window.clearTimeout(timerId);
      if (idleId !== null) {
        idleWindow.cancelIdleCallback?.(idleId);
      }
    };
  }, []);

  return shouldLoad;
}

function useRevealMotion() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-nuvia-reveal]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!items.length || reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("nuvia-motion-ready");
    const reveal = (item: Element) => item.classList.add("is-visible");
    const timer = window.setTimeout(() => items.forEach(reveal), 1600);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px 14% 0px" },
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}

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

function money(value: number, currency = "BOB") {
  if (currency === "BOB") {
    return `Bs. ${value.toFixed(0)}`;
  }

  return new Intl.NumberFormat("es", { currency, style: "currency" }).format(value);
}

function NuviaToastStack({
  notices,
  onDismiss,
}: {
  notices: NuviaNotice[];
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    if (!notices.length) {
      return;
    }

    const timers = notices.map((notice) => window.setTimeout(() => onDismiss(notice.id), notice.tone === "error" ? 6500 : 4300));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [notices, onDismiss]);

  return (
    <div className="nuvia-toast-stack" aria-live="polite" aria-label="Notificaciones Nuvia">
      {notices.map((notice) => (
        <article className={`nuvia-toast is-${notice.tone}`} key={notice.id}>
          <div>
            <span>{notice.title}</span>
            <p>{notice.body}</p>
          </div>
          <button type="button" onClick={() => onDismiss(notice.id)} aria-label="Cerrar notificacion">
            <X size={14} />
          </button>
        </article>
      ))}
    </div>
  );
}

function NuviaHeader({
  cartCount,
  logoIcon,
  onCartOpen,
  tagline,
  variant = "landing",
}: {
  cartCount: number;
  logoIcon: string;
  onCartOpen: () => void;
  tagline: string;
  variant?: "landing" | "catalog" | "product";
}) {
  const isSurfacePage = variant !== "landing";
  const nav =
    variant === "landing"
      ? [
          { href: "/nuvia/catalogo", label: "catalogo" },
          { href: "/nuvia/rutinas", label: "rutinas" },
          { href: "#guia", label: "guia" },
          { href: "#descuentos", label: "descuentos" },
        ]
      : [
          { href: "/nuvia", label: "inicio" },
          { href: "/nuvia/catalogo", label: "catalogo" },
          { href: "/nuvia/rutinas", label: "rutinas" },
          { href: "/nuvia/catalogo#como-comprar", label: "como comprar" },
        ];

  return (
    <header className={`nuvia-next-header ${isSurfacePage ? "is-product" : ""}`}>
      <Link className="nuvia-next-wordmark" href="/nuvia" aria-label="Nuvia">
        <span>
          <Image src={logoIcon} alt="" width={64} height={64} priority />
        </span>
        <strong>
          NUVIA
          <small>{tagline.toUpperCase()}</small>
        </strong>
      </Link>

      <nav aria-label="Secciones Nuvia">
        {nav.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        className="nuvia-next-cart-trigger"
        type="button"
        onClick={onCartOpen}
        aria-label={cartCount ? `Abrir carrito con ${cartCount} productos` : "Abrir carrito de compra"}
        title={cartCount ? `Carrito: ${cartCount} productos` : "Abrir carrito"}
      >
        <ShoppingBag size={17} />
        <span>comprar</span>
        {cartCount > 0 ? <strong>{cartCount}</strong> : null}
      </button>
    </header>
  );
}

function CartDrawer({
  add,
  cart,
  clear,
  decrease,
  discountTotal,
  increase,
  open,
  priced,
  productMap,
  remove,
  setOpen,
  subtotal,
  total,
  totalCount,
}: ReturnType<typeof useCart>) {
  const panelRef = useRef<HTMLElement>(null);
  const firstCurrency = cart.length ? productMap.get(cart[0].id)?.currency : "BOB";

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    }
  }, [open]);
  const productSections = useMemo(() => {
    const groups = new Map<string, CartProduct[]>();

    Array.from(productMap.values()).forEach((product) => {
      const key = product.category || "productos";
      groups.set(key, [...(groups.get(key) || []), product]);
    });

    return Array.from(groups.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 6)
      .map(([label, products]) => ({ label, products: products.slice(0, 4) }));
  }, [productMap]);

  return (
    <div className="nuvia-cart-shell" data-open={open ? "true" : "false"} aria-hidden={!open}>
      <button className="nuvia-cart-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Cerrar carrito" />
      <aside className="nuvia-cart-panel" role="dialog" aria-modal="true" aria-label="Carrito Nuvia" tabIndex={-1} ref={panelRef}>
        <header>
          <div>
            <span>nuvia checkout</span>
            <h2>tu carrito</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar carrito">
            <X size={18} />
          </button>
        </header>

        <div className="nuvia-cart-body">
          {cart.length === 0 ? (
            <div className="nuvia-cart-empty">
              <strong>todavia no agregaste productos</strong>
              <p>Agrega productos por categoria para cotizar tu pedido.</p>
            </div>
          ) : (
            <div className="nuvia-cart-list">
              {cart.map((item) => {
                const product = productMap.get(item.id);
                if (!product) {
                  return null;
                }

                const itemTotal =
                  typeof product.priceValue === "number" ? money(product.priceValue * item.qty, product.currency) : product.priceLabel;

                return (
                  <article className="nuvia-cart-item" key={item.id}>
                    <Image src={product.image} alt={product.imageAlt} width={148} height={172} />
                    <div>
                      <span>{[product.brand, product.size].filter(Boolean).join(" - ")}</span>
                      <strong>{product.title}</strong>
                      <small>{itemTotal}</small>
                      {product.discountPercent ? <em>{product.discountPercent}% descuento destacado</em> : null}
                      <div className="nuvia-cart-qty">
                        <button type="button" onClick={() => decrease(item.id)} aria-label={`Restar ${product.title}`}>
                          <Minus size={14} />
                        </button>
                        <output>{item.qty}</output>
                        <button type="button" onClick={() => increase(item.id)} aria-label={`Sumar ${product.title}`}>
                          <Plus size={14} />
                        </button>
                        <button type="button" onClick={() => remove(item.id)}>
                          <Trash2 size={13} />
                          quitar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="nuvia-cart-sections" aria-label="Secciones de productos">
            <div className="nuvia-cart-sections-head">
              <span>seguir comprando</span>
              <Link href="/nuvia/catalogo" onClick={() => setOpen(false)}>
                ver catalogo
              </Link>
            </div>
            {productSections.map((section) => (
              <section className="nuvia-cart-section" key={section.label}>
                <h3>{section.label}</h3>
                <div>
                  {section.products.map((product) => (
                    <article className="nuvia-cart-suggestion" key={product.id}>
                      <Link href={product.href} onClick={() => setOpen(false)}>
                        <Image src={product.image} alt={product.imageAlt} width={92} height={104} />
                        <span>{product.brand}</span>
                        <strong>{product.title}</strong>
                      </Link>
                      <button type="button" onClick={() => add(product.id)} aria-label={`Agregar ${product.title}`}>
                        <Plus size={14} />
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer>
          <div className="nuvia-cart-total">
            <span>{priced ? "subtotal" : "subtotal pendiente"}</span>
            <strong>{priced && totalCount ? money(subtotal, firstCurrency) : "cotizacion"}</strong>
          </div>
          {priced && discountTotal > 0 ? (
            <div className="nuvia-cart-discount">
              <span>descuento destacados</span>
              <strong>-{money(discountTotal, firstCurrency)}</strong>
            </div>
          ) : null}
          <div className="nuvia-cart-total is-final">
            <span>{priced ? "total" : "total pendiente"}</span>
            <strong>{priced && totalCount ? money(total, firstCurrency) : "cotizacion"}</strong>
          </div>
          <Link
            className="nuvia-cart-checkout-button"
            href="/nuvia/checkout"
            onClick={() => setOpen(false)}
            aria-disabled={!totalCount}
            data-disabled={!totalCount ? "true" : undefined}
          >
            {totalCount ? "finalizar compra" : "tu carrito está vacío"}
          </Link>
          <button type="button" onClick={clear} hidden={!cart.length}>
            vaciar carrito
          </button>
          <p>
            {totalCount
              ? "Nuvia confirma precio final, disponibilidad y entrega antes de cobrar."
              : "El checkout se activa cuando agregues productos."}
          </p>
        </footer>
      </aside>
    </div>
  );
}

function QuantityPicker({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  const decrease = () => onChange(Math.max(1, value - 1));
  const increase = () => onChange(value + 1);

  return (
    <div className="nuvia-qty-picker" aria-label={label}>
      <button type="button" onClick={decrease} aria-label="Restar unidad">
        <Minus size={14} />
      </button>
      <output>{value}</output>
      <button type="button" onClick={increase} aria-label="Sumar unidad">
        <Plus size={14} />
      </button>
    </div>
  );
}

function ProductMiniCheckout({
  mode = "card",
  onAdd,
  product,
}: {
  mode?: "card" | "buybox";
  onAdd: (id: string, qty?: number) => void;
  product: NuviaProduct;
}) {
  const [qty, setQty] = useState(1);
  const slug = productSlug(product);

  return (
    <div className={`nuvia-product-checkout is-${mode}`}>
      <div>
        <span>{mode === "buybox" ? "checkout" : "precio"}</span>
        <strong>{product.precio}</strong>
        {product.descuentoPorcentaje ? (
          <em>
            {product.descuentoPorcentaje}% off
            {typeof product.precioPromocional === "number" ? ` - ${money(product.precioPromocional, product.moneda)}` : ""}
          </em>
        ) : null}
      </div>
      <QuantityPicker label={`Cantidad para ${product.titulo}`} value={qty} onChange={setQty} />
      <button type="button" onClick={() => onAdd(slug, qty)}>
        agregar al carrito
      </button>
    </div>
  );
}

function ProductCheckoutBar({
  onAdd,
  onCartOpen,
  product,
}: {
  onAdd: (id: string, qty?: number) => void;
  onCartOpen: () => void;
  product: NuviaProduct;
}) {
  const [qty, setQty] = useState(1);
  const slug = productSlug(product);

  return (
    <aside className="nuvia-pdp-checkout-bar" aria-label={`Checkout rapido de ${product.titulo}`}>
      <Link href="/nuvia/catalogo" className="nuvia-pdp-bar-product">
        <Image src={product.imagen} alt="" width={58} height={58} sizes="50px" />
        <span>{briefProductTitle(product)}</span>
      </Link>
      <div className="nuvia-pdp-bar-actions">
        <QuantityPicker label={`Cantidad para ${product.titulo}`} value={qty} onChange={setQty} />
        <strong>
          {typeof product.precioPromocional === "number" ? money(product.precioPromocional, product.moneda) : product.precio}
        </strong>
        <button type="button" onClick={() => onAdd(slug, qty)}>
          agregar al carrito
        </button>
        <button type="button" onClick={onCartOpen}>
          ver carrito
        </button>
      </div>
    </aside>
  );
}

function ProductShelf({
  onAdd,
  products,
}: {
  onAdd: (id: string, qty?: number) => void;
  products: NuviaProduct[];
}) {
  const categories = Array.from(new Set(products.map((product) => product.categoria).filter(Boolean)));
  const categoryStats = categories.map((category) => {
    const items = products.filter((product) => product.categoria === category);
    return {
      category,
      count: items.length,
      brands: new Set(items.map((product) => product.marca).filter(Boolean)).size,
      hero: items[0],
    };
  });
  const [activeCategory, setActiveCategory] = useState("todos");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(CATALOG_PAGE_SIZE);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = activeCategory === "todos" || product.categoria === activeCategory;
        if (!matchesCategory) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        return [
          product.titulo,
          product.marca,
          product.categoria,
          product.uso,
          product.desc,
          ...product.beneficios,
          ...product.idealPara,
          ...product.ingredientesClave,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      }),
    [activeCategory, normalizedQuery, products],
  );
  const visibleProducts = useMemo(() => filteredProducts.slice(0, visibleCount), [filteredProducts, visibleCount]);
  const remainingProducts = filteredProducts.length - visibleProducts.length;

  useEffect(() => {
    setVisibleCount(CATALOG_PAGE_SIZE);
  }, [activeCategory, normalizedQuery]);

  return (
    <section className="nuvia-next-section nuvia-catalog-portal" id="catalogo" data-nuvia-reveal>
      <div className="nuvia-category-overview" aria-label="Secciones del catalogo">
        <button
          className={activeCategory === "todos" ? "is-active" : undefined}
          type="button"
          onClick={() => setActiveCategory("todos")}
        >
          <span>{products.length}</span>
          <strong>todos los productos</strong>
          <small>catalogo completo</small>
        </button>
        {categoryStats.map((section) => (
          <button
            className={activeCategory === section.category ? "is-active" : undefined}
            type="button"
            onClick={() => setActiveCategory(section.category)}
            key={section.category}
          >
            {section.hero ? <Image src={section.hero.imagen} alt="" width={96} height={96} sizes="76px" /> : null}
            <span>{section.count}</span>
            <strong>{section.category}</strong>
            <small>{section.brands} marcas</small>
          </button>
        ))}
      </div>

      <div className="nuvia-portal-controls">
        <div className="nuvia-portal-tabs" aria-label="Categorias del catalogo">
          <button className={activeCategory === "todos" ? "is-active" : undefined} type="button" onClick={() => setActiveCategory("todos")}>
            todos
          </button>
          {categories.map((category) => (
            <button className={activeCategory === category ? "is-active" : undefined} type="button" onClick={() => setActiveCategory(category)} key={category}>
              {category}
            </button>
          ))}
        </div>

        <div className="nuvia-catalog-search" role="search">
          <label htmlFor="nuvia-product-search">
            <Search size={17} strokeWidth={2.4} aria-hidden="true" />
            <span>buscar y comprar</span>
          </label>
          <input
            id="nuvia-product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="lupa: marca, producto, rutina o beneficio"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Limpiar busqueda">
              <X size={14} strokeWidth={2.4} />
            </button>
          ) : null}
        </div>

        <p className="nuvia-catalog-count" aria-live="polite">
          {filteredProducts.length ? `${visibleProducts.length} de ${filteredProducts.length} productos visibles` : "0 productos encontrados"}
        </p>
      </div>

      {filteredProducts.length ? (
        <>
          <div className="nuvia-product-grid">
            {visibleProducts.map((product, index) => {
              const slug = productSlug(product);
              const revealDelay = `${(index % 12) * 45}ms`;

              return (
                <article className="nuvia-product-card" data-nuvia-reveal style={{ "--delay": revealDelay } as CSSProperties} key={slug}>
                  <figure>
                    <span>{product.etiqueta}</span>
                    {product.descuentoPorcentaje ? <b>{product.descuentoPorcentaje}% off</b> : null}
                    <Image
                      src={product.imagen}
                      alt={product.imagenAlt}
                      width={460}
                      height={460}
                      sizes="(max-width: 680px) 44vw, (max-width: 1100px) 30vw, 220px"
                      priority={index < 4}
                    />
                  </figure>
                  <div>
                    <small>{[product.marca, product.tamano].filter(Boolean).join(" - ")}</small>
                    <h3>{briefProductTitle(product)}</h3>
                    <p>{product.desc}</p>
                    <ul>
                      {[...product.idealPara, ...product.beneficios].slice(0, 3).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <footer>
                      <Link href={productHref(product)}>ver ficha completa</Link>
                      <ProductMiniCheckout product={product} onAdd={onAdd} />
                    </footer>
                  </div>
                </article>
              );
            })}
          </div>
          {remainingProducts > 0 ? (
            <button
              className="nuvia-load-more"
              type="button"
              onClick={() => setVisibleCount((current) => Math.min(current + CATALOG_PAGE_SIZE, filteredProducts.length))}
            >
              mostrar {Math.min(CATALOG_PAGE_SIZE, remainingProducts)} productos mas
            </button>
          ) : null}
        </>
      ) : (
        <div className="nuvia-empty-results" role="status">
          <strong>no encontramos ese producto</strong>
          <p>Prueba con marca, tipo de piel, rutina o beneficio. El catalogo puede crecer sin duplicar secciones.</p>
          <button type="button" onClick={() => setQuery("")}>
            limpiar busqueda
          </button>
        </div>
      )}

    </section>
  );
}

function HeroStage({
  onAdd,
  products,
}: {
  onAdd: (id: string) => void;
  products: NuviaProduct[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--tilt-x", `${y * -5}deg`);
    stage.style.setProperty("--tilt-y", `${x * 7}deg`);
  }

  function resetMove() {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    stage.style.setProperty("--tilt-x", "0deg");
    stage.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div className="nuvia-hero-stage" ref={stageRef} onMouseMove={handleMove} onMouseLeave={resetMove} data-nuvia-reveal>
      <div className="nuvia-stage-toolbar">
        <i />
        <i />
        <i />
        <strong>productos destacados del mes</strong>
        <span>10% de descuento</span>
      </div>
      <div className="nuvia-stage-grid">
        {products.slice(0, 2).map((product) => {
          const slug = productSlug(product);
          return (
            <article className="nuvia-stage-card" key={slug}>
              <Link href={productHref(product)}>
                <figure>
                  <Image src={product.imagen} alt={product.imagenAlt} width={520} height={520} sizes="(max-width: 680px) 42vw, 260px" priority />
                </figure>
                <span>{product.marca}</span>
                <strong>{briefProductTitle(product)}</strong>
              </Link>
              <button type="button" onClick={() => onAdd(slug)}>
                agregar
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function NuviaStorefront(props: StoreProps) {
  useRevealMotion();
  const cart = useCart(props.cartProducts);
  const routineSteps = useMemo(() => buildRoutineSteps(props.products), [props.products]);
  const shouldLoadHeroVideo = useDeferredHeroVideo();
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  return (
    <main className="nuvia-next-page">
      <NuviaHeader cartCount={cart.totalCount} logoIcon={props.logoIcon} onCartOpen={() => cart.setOpen(true)} tagline={props.tagline} />

      <section className="nuvia-next-hero" id="top">
        <video
          className={heroVideoReady ? "is-ready" : "is-poster"}
          src={shouldLoadHeroVideo ? props.heroVideo : undefined}
          poster={props.heroPoster}
          preload={shouldLoadHeroVideo ? "metadata" : "none"}
          autoPlay={shouldLoadHeroVideo}
          loop
          muted
          playsInline
          aria-hidden="true"
          onCanPlay={() => setHeroVideoReady(true)}
        />
        <div className="nuvia-hero-shade" />
        <div className="nuvia-hero-layout">
          <div className="nuvia-hero-copy" data-nuvia-reveal>
            <span>NUVIA | {props.tagline.toUpperCase()}</span>
            <h1>skincare simple para comprar mejor</h1>
            <p>{props.description}</p>
            <div className="nuvia-proof-row">
              <i />
              <span>ISDIN + SVR</span>
              <i />
              <span>carrito real</span>
              <i />
              <span>cotizacion segura</span>
            </div>
            <div className="nuvia-actions">
              <Link href="/nuvia/catalogo">ver catalogo</Link>
              <button type="button" onClick={() => cart.setOpen(true)}>
                abrir carrito
              </button>
            </div>
          </div>

          <HeroStage products={props.products} onAdd={cart.add} />
        </div>
      </section>

      <NuviaUseCases merchandising={props.merchandising} />

      <section className="nuvia-routine-section" id="guia" data-nuvia-reveal>
        <div>
          <span>guia rapida</span>
          <h2>rutina perfecta en 4 pasos</h2>
          <p>Limpia, trata, hidrata y protege. La landing muestra solo la ruta; el catalogo queda para explorar todos los productos.</p>
          <Link className="nuvia-routine-more" href="/nuvia/rutinas">
            ver rutinas por necesidad
          </Link>
        </div>
        <div className="nuvia-routine-rail" aria-label="Rutina skincare Nuvia en 4 pasos">
          {routineSteps.map((step) => (
            <Link href={productHref(step.product)} key={step.id}>
              <b>{step.number}</b>
              <Image src={step.product.imagen} alt={step.product.imagenAlt} width={160} height={180} sizes="(max-width: 680px) 45vw, 160px" />
              <small>{step.action}</small>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
              <em>{briefProductTitle(step.product)}</em>
            </Link>
          ))}
        </div>
      </section>

      <PackShowcase
        merchandising={props.merchandising}
        onAddMany={cart.addMany}
        title="packs listos para agregar"
        description="Agrupa productos complementarios en un clic. La tienda mantiene compra individual, pero acelera decisiones repetidas."
      />

      <section className="nuvia-discount-section" id="descuentos" data-nuvia-reveal>
        <div>
          <span>descuentos</span>
          <h2>10% en destacados del mes</h2>
          <p>El descuento se comunica en la vitrina. El cobro real queda pendiente hasta configurar precios y canal de compra.</p>
        </div>
        <form onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="nuvia-email">correo</label>
          <input id="nuvia-email" type="email" placeholder="tu@email.com" />
          <button type="submit">suscribirme</button>
        </form>
      </section>

      <section className="nuvia-faq-section" data-nuvia-reveal>
        <h2>compra simple, informacion clara</h2>
        <div>
          <details open>
            <summary>como funciona el carrito?</summary>
            <p>Agregas productos, ajustas cantidades y Nuvia recibe una cotizacion preparada cuando el canal este conectado.</p>
          </details>
          <details>
            <summary>por que dice cotizacion?</summary>
            <p>Porque la compra sigue asistida hasta conectar la pasarela final y validar disponibilidad antes del cobro.</p>
          </details>
          <details>
            <summary>esto reemplaza una consulta dermatologica?</summary>
            <p>No. Nuvia vende dermocosmetica y productos de uso diario. Si tienes una condicion activa, consulta a un profesional.</p>
          </details>
        </div>
      </section>

      <footer className="nuvia-next-footer" id="contacto">
        <strong>NUVIA</strong>
        <p>{props.description}</p>
        <Link className="nuvia-footer-link" href="/nuvia/catalogo">
          abrir catalogo
        </Link>
      </footer>

      <CartDrawer {...cart} />
      <NuviaToastStack notices={cart.notices} onDismiss={cart.dismissNotice} />
    </main>
  );
}

export function NuviaRoutinesPage(props: StoreProps & { contenido: NuviaContenido }) {
  useRevealMotion();
  const cart = useCart(props.cartProducts);

  const rutinas = useMemo(() => {
    const bySlug = new Map(props.products.map((product) => [productSlug(product), product]));
    return props.contenido.rutinas
      .map((rutina) => ({
        ...rutina,
        pasos: rutina.pasos
          .map((paso) => ({
            ...paso,
            productos: paso.productSlugs
              .map((slug) => bySlug.get(slug))
              .filter((product): product is NuviaProduct => Boolean(product)),
          }))
          .filter((paso) => paso.productos.length > 0),
      }))
      .filter((rutina) => rutina.pasos.length > 0);
  }, [props.contenido.rutinas, props.products]);

  const consejos = props.contenido.consejos;

  return (
    <main className="nuvia-next-page is-routines">
      <NuviaHeader
        cartCount={cart.totalCount}
        logoIcon={props.logoIcon}
        onCartOpen={() => cart.setOpen(true)}
        tagline={props.tagline}
        variant="catalog"
      />

      <section className="nuvia-routines-hero" data-nuvia-reveal>
        <span>rutinas y consejos</span>
        <h1>rutinas de skincare por necesidad</h1>
        <p>
          Elegimos productos reales del catalogo para cada tipo de piel. Empeza por tu necesidad,
          arma la rutina en un clic y confirma con un asesor antes de cerrar la compra.
        </p>
        {rutinas.length > 0 ? (
          <nav className="nuvia-routines-index" aria-label="Rutinas por necesidad">
            {rutinas.map((rutina) => (
              <a href={`#${rutina.id}`} key={rutina.id}>
                {rutina.necesidad}
              </a>
            ))}
          </nav>
        ) : null}
      </section>

      <div className="nuvia-routines-list">
        {rutinas.map((rutina) => {
          const rutinaItems = rutina.pasos.flatMap((paso) =>
            paso.productos.map((product) => ({ id: productSlug(product), qty: 1 })),
          );

          return (
            <article className="nuvia-routine-block" id={rutina.id} key={rutina.id} data-nuvia-reveal>
              <header>
                <span>{rutina.necesidad}</span>
                <h2>{rutina.titulo}</h2>
                <p>{rutina.resumen}</p>
                <div className="nuvia-routine-block-meta">
                  <small>{rutina.momento}</small>
                  {rutina.borrador ? <em>guia inicial, sujeta a ajuste</em> : null}
                </div>
                <button type="button" onClick={() => cart.addMany(rutinaItems)}>
                  armar esta rutina
                </button>
              </header>

              <ol className="nuvia-routine-steps">
                {rutina.pasos.map((paso) => (
                  <li key={paso.orden}>
                    <div className="nuvia-routine-step-head">
                      <b>{String(paso.orden).padStart(2, "0")}</b>
                      <span>{paso.accion}</span>
                    </div>
                    <div className="nuvia-routine-step-body">
                      <strong>{paso.titulo}</strong>
                      <p>{paso.nota}</p>
                      {paso.productos.map((product) => (
                        <div className="nuvia-routine-product" key={productSlug(product)}>
                          <Link href={productHref(product)}>
                            <Image
                              src={product.imagen}
                              alt={product.imagenAlt}
                              width={72}
                              height={84}
                              sizes="72px"
                            />
                            <em>{briefProductTitle(product)}</em>
                          </Link>
                          <button type="button" onClick={() => cart.add(productSlug(product))}>
                            agregar
                          </button>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>

      {consejos.length > 0 ? (
        <section className="nuvia-advice-section" data-nuvia-reveal>
          <h2>consejos para comprar mejor</h2>
          <div className="nuvia-advice-grid">
            {consejos.map((consejo) => (
              <article className="nuvia-advice-card" key={consejo.id}>
                <span>{consejo.tipo}</span>
                <h3>{consejo.titulo}</h3>
                <p>{consejo.cuerpo}</p>
                {consejo.disclaimer ? <small>{consejo.disclaimer}</small> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="nuvia-next-footer" id="contacto">
        <strong>NUVIA</strong>
        <p>{props.description}</p>
        <Link className="nuvia-footer-link" href="/nuvia/catalogo">
          abrir catalogo
        </Link>
      </footer>

      <CartDrawer {...cart} />
      <NuviaToastStack notices={cart.notices} onDismiss={cart.dismissNotice} />
    </main>
  );
}

export function NuviaCatalogPage(props: StoreProps) {
  useRevealMotion();
  const cart = useCart(props.cartProducts);

  return (
    <main className="nuvia-next-page is-catalog">
      <NuviaHeader
        cartCount={cart.totalCount}
        logoIcon={props.logoIcon}
        onCartOpen={() => cart.setOpen(true)}
        tagline={props.tagline}
        variant="catalog"
      />

      <section className="nuvia-catalog-hero" data-nuvia-reveal>
        <div>
          <span>NUVIA | {props.tagline.toUpperCase()}</span>
          <h1>catalogo de skincare con compra guiada</h1>
          <p>
            Elige crema, ajusta cantidad y abre carrito. El sistema calcula descuento, total y deja la orden lista para pago
            asistido.
          </p>
          <div className="nuvia-actions">
            <button type="button" onClick={() => cart.setOpen(true)}>
              abrir carrito
            </button>
            <Link href="#como-comprar">como comprar</Link>
          </div>
        </div>
        <aside aria-label="Resumen del catalogo">
          <div>
            <strong>{props.products.length}</strong>
            <span>productos activos</span>
          </div>
          <div>
            <strong>{new Set(props.products.map((product) => product.marca).filter(Boolean)).size}</strong>
            <span>marcas disponibles</span>
          </div>
          <div>
            <strong>1</strong>
            <span>carrito unico</span>
          </div>
        </aside>
      </section>

      <PackShowcase
        merchandising={props.merchandising}
        onAddMany={cart.addMany}
        title="elige por pack o compra producto suelto"
        description="Los packs son rutas rapidas para casos frecuentes. La grilla completa queda debajo para comprar cualquier producto individual."
        variant="catalog"
      />

      <ProductShelf products={props.products} onAdd={cart.add} />

      <section className="nuvia-catalog-buying-guide" id="como-comprar" data-nuvia-reveal>
        <div>
          <span>como comprar</span>
          <h2>el flujo queda claro antes de pagar</h2>
          <p>
            Nuvia usa compra asistida: eliges productos, revisas total y confirmas la orden. La pasarela real queda lista para
            activar con credenciales.
          </p>
        </div>
        <div className="nuvia-buying-steps">
          {[
            ["01", "elige producto", "Filtra por categoria o marca y abre la ficha si necesitas indicaciones."],
            ["02", "agrega cantidad", "Cada crema tiene su selector y se guarda en el carrito del navegador."],
            ["03", "confirma checkout", "El carrito crea orden con subtotal, descuento y total para completar el pago."],
          ].map(([number, title, body]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="nuvia-checkout-note" id="checkout-pendiente" data-nuvia-reveal>
        <div>
          <span>checkout</span>
          <h2>orden lista, pago real por activar</h2>
          <p>
            El carrito ya funciona con precios y descuentos. Para cobrar en automatico falta cargar credenciales BNB QR Simple
            y reglas finales de entrega.
          </p>
        </div>
        <button type="button" onClick={() => cart.setOpen(true)}>
          revisar carrito
        </button>
      </section>

      <footer className="nuvia-next-footer" id="contacto">
        <strong>NUVIA</strong>
        <p>{props.description}</p>
        <button type="button" onClick={() => cart.setOpen(true)}>
          abrir carrito
        </button>
      </footer>

      <CartDrawer {...cart} />
      <NuviaToastStack notices={cart.notices} onDismiss={cart.dismissNotice} />
    </main>
  );
}

export function NuviaProductPage(props: ProductPageProps) {
  useRevealMotion();
  const cart = useCart(props.cartProducts);

  return (
    <main className="nuvia-next-page is-pdp">
      <NuviaHeader
        cartCount={cart.totalCount}
        logoIcon={props.logoIcon}
        onCartOpen={() => cart.setOpen(true)}
        tagline={props.tagline}
        variant="product"
      />
      <ProductCheckoutBar product={props.product} onAdd={cart.add} onCartOpen={() => cart.setOpen(true)} />

      <section className="nuvia-pdp-hero" data-nuvia-reveal>
        <div className="nuvia-pdp-media">
          <Link href="/nuvia/catalogo">
            <ArrowLeft size={16} />
            volver al catalogo
          </Link>
          <figure>
            <Image
              src={props.product.imagen}
              alt={props.product.imagenAlt}
              width={680}
              height={760}
              sizes="(max-width: 980px) 92vw, 54vw"
              priority
            />
          </figure>
          <div className="nuvia-pdp-gallery" aria-label="Imagenes y espacios multimedia del producto">
            {props.product.detalleImagenes.slice(0, 3).map((image) => (
              <figure key={`${image.src}-${image.label}`}>
                <Image src={image.src} alt={image.alt} width={180} height={180} sizes="(max-width: 680px) 30vw, 180px" />
                <figcaption>{image.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="nuvia-pdp-copy">
          <span>{[props.product.marca, props.product.tamano].filter(Boolean).join(" - ")}</span>
          <h1>{props.product.titulo}</h1>
          <p>{props.product.desc}</p>
          <ul>
            {[props.product.tamano, props.product.uso, ...props.product.ingredientesClave.slice(0, 2)].filter(Boolean).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="nuvia-pdp-buybox">
            <ProductMiniCheckout product={props.product} onAdd={cart.add} mode="buybox" />
            <button type="button" onClick={() => cart.setOpen(true)}>
              ver carrito
            </button>
            <p>El carrito guarda tu seleccion. Si no hay precio final, Nuvia lo toma como cotizacion.</p>
          </div>

          <ProductRelatedPacks product={props.product} merchandising={props.merchandising} onAddMany={cart.addMany} />

          <div className="nuvia-pdp-accordions">
            <details open>
              <summary>detalles</summary>
              <p>{props.product.detalleNota}</p>
            </details>
            <details>
              <summary>caracteristicas</summary>
              <ul>
                {[...props.product.beneficios, ...props.product.idealPara].slice(0, 6).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
            <details>
              <summary>indicaciones</summary>
              <p>{props.product.modoUso}</p>
            </details>
            <details>
              <summary>ingredientes</summary>
              <ul>
                {props.product.ingredientesClave.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </section>

      <CartDrawer {...cart} />
      <NuviaToastStack notices={cart.notices} onDismiss={cart.dismissNotice} />
    </main>
  );
}
