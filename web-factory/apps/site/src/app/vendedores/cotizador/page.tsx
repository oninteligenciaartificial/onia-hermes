import { sellerScreens } from "../data";
import { SellerScreenHeader } from "../_components/screen-chrome";
import { QuoteBuilder } from "../_components/quote-builder";

export default function CotizadorPage() {
  return (
    <>
      <SellerScreenHeader screen={sellerScreens.cotizador} />
      <QuoteBuilder />
    </>
  );
}
