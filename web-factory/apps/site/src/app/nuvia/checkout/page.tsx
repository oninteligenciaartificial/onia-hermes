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
