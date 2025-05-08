import { invoice_and_generate_guide } from "#app/modules/inventory/invoice/case/invoice_and_generate_guide.ts";
import { loadGlobalEnv } from "@scope/shared/env";

await loadGlobalEnv();

// AQUI VA CODIGO QUE SE QUIERA PROBAR SIN TENER QUE LEVANTAR EL SERVIDOR HONO

const dispatch_id = 29147;

const schemas = await invoice_and_generate_guide(dispatch_id, {
  transport_company_name: "Compania transporte",
  lincense_plate_number: "PE0123",
  driver_document_type: "DNI",
  driver_document_number: "12345678",
  driver_first_name: "Jian",
  driver_last_name: "Zhang",
  driver_license_number: "12344",
});
console.log(schemas.guide);

// export {};
