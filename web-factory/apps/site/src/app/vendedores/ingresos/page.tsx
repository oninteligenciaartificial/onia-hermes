import { incomes, sellerScreens } from "../data";
import { IncomeSection } from "../_components/income-section";
import { OperatingBlock, SellerScreenGrid, SellerScreenHeader } from "../_components/screen-chrome";

export default function IngresosPage() {
  return (
    <>
      <SellerScreenHeader screen={sellerScreens.ingresos} />
      <SellerScreenGrid
        aside={
          <>
            <OperatingBlock
              title="Comision aprobable"
              description="La comision no se calcula por promesa, se calcula por dinero real."
              items={[
                "Primer pago cobrado y comprobado.",
                "Servicio y cliente correctamente identificados.",
                "Monto neto validado por ONIA.",
                "Datos completos y margen sin riesgo.",
              ]}
            />
            <OperatingBlock
              title="Estados financieros"
              description="Usar estados simples evita discusiones."
              items={[
                "Pendiente: falta comprobante o validacion.",
                "Aprobada: cobro real confirmado, falta pagar.",
                "Pagada: comision ya salio.",
                "Retenida: hay disputa, descuento o alcance dudoso.",
              ]}
            />
          </>
        }
      >
        <IncomeSection incomes={incomes} />
      </SellerScreenGrid>
    </>
  );
}
