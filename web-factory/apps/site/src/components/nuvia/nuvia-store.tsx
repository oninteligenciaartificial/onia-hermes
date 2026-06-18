"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  buildNuviaCheckoutHref,
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

const STORAGE_KEY = "nuvia-next-cart-v1";

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
  productPage = false,
  tagline,
}: {
  cartCount: number;
  logoIcon: string;
  onCartOpen: () => void;
  productPage?: boolean;
  tagline: string;
}) {
  const nav = productPage
    ? [
        { href: "/nuvia", label: "inicio" },
        { href: "/nuvia#catalogo", label: "productos" },
      ]
    : [
        { href: "#catalogo", label: "productos" },
        { href: "#guia", label: "guia" },
        { href: "#descuentos", label: "descuentos" },
      ];

  return (
    <header className={`nuvia-next-header ${productPage ? "is-product" : ""}`}>
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

      <button className="nuvia-next-cart-trigger" type="button" onClick={onCartOpen}>
        <ShoppingBag size={17} />
        <span>comprar</span>
        {cartCount > 0 ? <strong>{cartCount}</strong> : null}
      </button>
    </header>
  );
}

function CartDrawer({
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
  const checkoutHref = buildNuviaCheckoutHref(cart);
  const firstCurrency = cart.length ? productMap.get(cart[0].id)?.currency : "BOB";

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

        {cart.length === 0 ? (
          <div className="nuvia-cart-empty">
            <strong>todavia no agregaste productos</strong>
            <p>Agrega productos del catalogo para cotizar tu pedido.</p>
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

        <footer>
          <div className="nuvia-cart-total">
            <span>{priced ? "subtotal" : "subtotal pendiente"}</span>
            <strong>{priced && totalCount ? money(total, firstCurrency) : "cotizacion"}</strong>
          </div>
          <a className={totalCount ? "" : "is-disabled"} href={checkoutHref}>
            {priced && totalCount ? "continuar compra" : "cotizar pedido"}
          </a>
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
      <Link href="/nuvia#catalogo" className="nuvia-pdp-bar-product">
        <Image src={product.imagen} alt="" width={58} height={58} />
        <span>{product.titulo}</span>
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

  return (
    <section className="nuvia-next-section nuvia-catalog-portal" id="catalogo" data-nuvia-reveal>
      <div className="nuvia-portal-top">
        <div className="nuvia-section-heading">
          <span>portal de productos</span>
          <h2>todo el catalogo, listo para pedir</h2>
          <p>Cada producto tiene ficha, cantidad y checkout propio. El portal escala cuando entren mas marcas y categorias.</p>
        </div>
        <div className="nuvia-portal-status">
          <strong>{products.length}</strong>
          <span>productos activos</span>
          <strong>{categories.length}</strong>
          <span>categorias</span>
          <strong>1</strong>
          <span>carrito compartido</span>
        </div>
      </div>

      <div className="nuvia-portal-tabs" aria-label="Categorias del catalogo">
        <a href="#catalogo">todos</a>
        {categories.map((category) => (
          <a href="#catalogo" key={category}>
            {category}
          </a>
        ))}
      </div>

      <div className="nuvia-product-grid">
        {products.map((product, index) => {
          const slug = productSlug(product);
          return (
            <article className="nuvia-product-card" data-nuvia-reveal style={{ "--delay": `${index * 70}ms` } as CSSProperties} key={slug}>
              <figure>
                <span>{product.etiqueta}</span>
                <Image src={product.imagen} alt={product.imagenAlt} width={460} height={460} priority />
              </figure>
              <div>
                <small>{[product.marca, product.tamano].filter(Boolean).join(" - ")}</small>
                <h3>{product.titulo}</h3>
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
                <strong>{product.titulo}</strong>
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
  const routineProducts = useMemo(
    () => [...props.products].filter((product) => product.ordenRutina).sort((a, b) => (a.ordenRutina ?? 99) - (b.ordenRutina ?? 99)),
    [props.products],
  );

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
              <Link href="#catalogo">ver productos</Link>
              <button type="button" onClick={() => cart.setOpen(true)}>
                abrir carrito
              </button>
            </div>
          </div>

          <HeroStage products={props.products} onAdd={cart.add} />
        </div>
      </section>

      <ProductShelf products={props.products} onAdd={cart.add} />

      <section className="nuvia-routine-section" id="guia" data-nuvia-reveal>
        <div>
          <span>guia rapida</span>
          <h2>dos pasos claros, sin ruido</h2>
          <p>La compra se ordena por rutina. Primero limpieza, luego proteccion. Los proximos productos entran al mismo sistema.</p>
        </div>
        <div className="nuvia-routine-rail">
          {routineProducts.map((product) => (
            <Link href={productHref(product)} key={productSlug(product)}>
              <small>{product.uso}</small>
              <Image src={product.imagen} alt={product.imagenAlt} width={160} height={180} />
              <strong>{product.titulo}</strong>
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
        productPage
        tagline={props.tagline}
      />
      <ProductCheckoutBar product={props.product} onAdd={cart.add} onCartOpen={() => cart.setOpen(true)} />

      <section className="nuvia-pdp-hero" data-nuvia-reveal>
        <div className="nuvia-pdp-media">
          <Link href="/nuvia#catalogo">
            <ArrowLeft size={16} />
            volver al catalogo
          </Link>
          <figure>
            <Image src={props.product.imagen} alt={props.product.imagenAlt} width={680} height={760} priority />
          </figure>
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
