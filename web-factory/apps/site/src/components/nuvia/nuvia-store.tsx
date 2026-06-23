"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import {
  type CartProduct,
  type NuviaProduct,
  productHref,
  productSlug,
} from "@/lib/nuvia-data";

type CartLine = {
  id: string;
  qty: number;
};

type StoreProps = {
  name: string;
  tagline: string;
  description: string;
  logoIcon: string;
  logoWide: string;
  heroVideo: string;
  products: NuviaProduct[];
  cartProducts: CartProduct[];
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

type CheckoutResult = {
  ok: boolean;
  mode: "payment" | "quote" | "configuration_pending" | "invalid_request";
  message: string;
  order?: {
    id: string | null;
    publicCode: string;
    persisted: boolean;
    subtotal: number;
    discountTotal: number;
    total: number;
    currency: string;
  };
  payment?: {
    id: string | null;
    provider: string;
    status: string;
    qrImageUrl?: string | null;
    qrPayload?: string | null;
    expiresAt?: string | null;
    requiredCredentials?: string[];
    providerReference?: string | null;
  } | null;
  requiredConfiguration?: string[];
};

const STORAGE_KEY = "nuvia-next-cart-v1";

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
  const productMap = useMemo(() => new Map(cartProducts.map((product) => [product.id, product])), [cartProducts]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
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

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    document.documentElement.classList.toggle("nuvia-cart-open", open);
    return () => document.documentElement.classList.remove("nuvia-cart-open");
  }, [open]);

  const add = useCallback((id: string, qty = 1) => {
    const amount = Math.max(1, Math.floor(Number(qty) || 1));

    setCart((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) => (item.id === id ? { ...item, qty: item.qty + amount } : item));
      }

      return [...current, { id, qty: amount }];
    });
    setOpen(true);
  }, []);

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
  const total = cart.reduce((sum, item) => {
    const product = productMap.get(item.id);
    return sum + (typeof product?.priceValue === "number" ? product.priceValue * item.qty : 0);
  }, 0);

  return {
    add,
    cart,
    clear,
    decrease,
    increase,
    open,
    priced,
    productMap,
    remove,
    setOpen,
    total,
    totalCount,
  };
}

function money(value: number, currency = "BOB") {
  if (currency === "BOB") {
    return `Bs. ${value.toFixed(0)}`;
  }

  return new Intl.NumberFormat("es", { currency, style: "currency" }).format(value);
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
          { href: "#guia", label: "guia" },
          { href: "#descuentos", label: "descuentos" },
        ]
      : [
          { href: "/nuvia", label: "inicio" },
          { href: "/nuvia/catalogo", label: "catalogo" },
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
  increase,
  open,
  priced,
  productMap,
  remove,
  setOpen,
  total,
  totalCount,
}: ReturnType<typeof useCart>) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const firstCurrency = cart.length ? productMap.get(cart[0].id)?.currency : "BOB";
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

  const startCheckout = async () => {
    if (!cart.length || checkoutLoading) {
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");
    setCheckoutResult(null);

    try {
      const response = await fetch("/api/nuvia/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          storeSlug: "nuvia",
          provider: "bnb_qr_simple",
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.qty,
          })),
        }),
      });
      const result = (await response.json()) as CheckoutResult;

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "No se pudo crear el checkout.");
      }

      setCheckoutResult(result);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "No se pudo crear el checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="nuvia-cart-shell" data-open={open ? "true" : "false"} aria-hidden={!open}>
      <button className="nuvia-cart-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Cerrar carrito" />
      <aside className="nuvia-cart-panel" role="dialog" aria-modal="true" aria-label="Carrito Nuvia" tabIndex={-1}>
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
            <strong>{priced && totalCount ? money(total, firstCurrency) : "cotizacion"}</strong>
          </div>
          <button className="nuvia-cart-checkout-button" type="button" onClick={startCheckout} disabled={!totalCount || checkoutLoading}>
            {checkoutLoading ? "creando orden..." : priced && totalCount ? "generar QR / orden" : "crear cotizacion"}
          </button>
          {checkoutResult ? (
            <div className="nuvia-checkout-result" data-mode={checkoutResult.mode}>
              <span>{checkoutResult.order?.publicCode ? `orden ${checkoutResult.order.publicCode}` : "checkout nuvia"}</span>
              <strong>{checkoutResult.mode === "configuration_pending" ? "faltan credenciales" : checkoutResult.mode}</strong>
              <p>{checkoutResult.message}</p>
              {checkoutResult.order?.total ? (
                <small>{money(checkoutResult.order.total, checkoutResult.order.currency)}</small>
              ) : null}
              {checkoutResult.payment?.qrImageUrl ? (
                <Image src={checkoutResult.payment.qrImageUrl} alt="QR de pago Nuvia" width={220} height={220} unoptimized />
              ) : null}
              {checkoutResult.requiredConfiguration?.length ? (
                <ul>
                  {checkoutResult.requiredConfiguration.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
          {checkoutError ? <p className="nuvia-checkout-error">{checkoutError}</p> : null}
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
        <Image src={product.imagen} alt="" width={58} height={58} />
        <span>{briefProductTitle(product)}</span>
      </Link>
      <div className="nuvia-pdp-bar-actions">
        <QuantityPicker label={`Cantidad para ${product.titulo}`} value={qty} onChange={setQty} />
        <strong>{product.precio}</strong>
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
  const [activeCategory, setActiveCategory] = useState("todos");
  const [query, setQuery] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(48);
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
  const visibleProducts = filteredProducts.slice(0, visibleLimit);

  useEffect(() => {
    setVisibleLimit(48);
  }, [activeCategory, normalizedQuery]);

  return (
    <section className="nuvia-next-section nuvia-catalog-portal" id="catalogo" data-nuvia-reveal>
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
          {filteredProducts.length} productos encontrados
        </p>
      </div>

      {visibleProducts.length ? (
        <div className="nuvia-product-grid">
        {visibleProducts.map((product, index) => {
          const slug = productSlug(product);
          return (
            <article className="nuvia-product-card" data-nuvia-reveal style={{ "--delay": `${index * 70}ms` } as CSSProperties} key={slug}>
              <figure>
                <span>{product.etiqueta}</span>
                <Image src={product.imagen} alt={product.imagenAlt} width={460} height={460} priority />
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
      ) : (
        <div className="nuvia-empty-results" role="status">
          <strong>no encontramos ese producto</strong>
          <p>Prueba con marca, tipo de piel, rutina o beneficio. El catalogo puede crecer sin duplicar secciones.</p>
          <button type="button" onClick={() => setQuery("")}>
            limpiar busqueda
          </button>
        </div>
      )}

      {visibleProducts.length < filteredProducts.length ? (
        <button className="nuvia-load-more" type="button" onClick={() => setVisibleLimit((current) => current + 48)}>
          mostrar mas productos
        </button>
      ) : null}
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
                  <Image src={product.imagen} alt={product.imagenAlt} width={520} height={520} />
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

  return (
    <main className="nuvia-next-page">
      <NuviaHeader cartCount={cart.totalCount} logoIcon={props.logoIcon} onCartOpen={() => cart.setOpen(true)} tagline={props.tagline} />

      <section className="nuvia-next-hero" id="top">
        <video src={props.heroVideo} autoPlay loop muted playsInline aria-hidden="true" />
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

      <section className="nuvia-routine-section" id="guia" data-nuvia-reveal>
        <div>
          <span>guia rapida</span>
          <h2>rutina perfecta en 4 pasos</h2>
          <p>Limpia, trata, hidrata y protege. La landing muestra solo la ruta; el catalogo queda para explorar todos los productos.</p>
        </div>
        <div className="nuvia-routine-rail" aria-label="Rutina skincare Nuvia en 4 pasos">
          {routineSteps.map((step) => (
            <Link href={productHref(step.product)} key={step.id}>
              <b>{step.number}</b>
              <Image src={step.product.imagen} alt={step.product.imagenAlt} width={160} height={180} />
              <small>{step.action}</small>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
              <em>{briefProductTitle(step.product)}</em>
            </Link>
          ))}
        </div>
      </section>

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
            <p>Porque todavia no cargamos precios finales ni pasarela. El sistema evita inventar datos comerciales.</p>
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
            Elige crema, ajusta cantidad y abre carrito. El pago queda preparado como checkout/cotizacion hasta conectar precios,
            entrega y canal de cobro.
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

      <ProductShelf products={props.products} onAdd={cart.add} />

      <section className="nuvia-catalog-buying-guide" id="como-comprar" data-nuvia-reveal>
        <div>
          <span>como comprar</span>
          <h2>el flujo queda claro antes de pagar</h2>
          <p>
            Nuvia usa una compra asistida: el carrito prepara el pedido y evita mostrar precios, stock o pago real sin configuracion.
          </p>
        </div>
        <div className="nuvia-buying-steps">
          {[
            ["01", "elige producto", "Filtra por categoria o marca y abre la ficha si necesitas indicaciones."],
            ["02", "agrega cantidad", "Cada crema tiene su selector y se guarda en el carrito del navegador."],
            ["03", "confirma checkout", "Cuando existan precio y canal de cobro, este mismo carrito enviara el pedido final."],
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
          <h2>pago real pendiente de configuracion</h2>
          <p>
            El carrito ya funciona. Para cobrar de verdad falta definir precios finales, stock, envio y conectar WhatsApp, email o
            pasarela de pago.
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
            <Image src={props.product.imagen} alt={props.product.imagenAlt} width={680} height={760} priority />
          </figure>
          <div className="nuvia-pdp-gallery" aria-label="Imagenes y espacios multimedia del producto">
            {props.product.detalleImagenes.slice(0, 3).map((image) => (
              <figure key={`${image.src}-${image.label}`}>
                <Image src={image.src} alt={image.alt} width={180} height={180} />
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
    </main>
  );
}
