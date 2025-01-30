import {
  PAYMENT_METHOD,
  REQUIREMENT_TYPE_DOCUMENT,
} from "#app/modules/requirement/entities/requirement.entity.ts";
import { z } from "zod";

export const createRequirementValidator = z.object({
  companyId: z.number(),
  supplierId: z.number(),
  supplierName: z.string(),
  supplierRuc: z.string(),
  description: z.string(),
  typeDocument: z.enum([
    REQUIREMENT_TYPE_DOCUMENT.BOLETA,
    REQUIREMENT_TYPE_DOCUMENT.FACTURA,
    REQUIREMENT_TYPE_DOCUMENT.GUIA_REMISION,
    REQUIREMENT_TYPE_DOCUMENT.GUIA_TRANSPORTISTA,
    REQUIREMENT_TYPE_DOCUMENT.NOTA_CREDITO,
    REQUIREMENT_TYPE_DOCUMENT.NOTA_DEBITO,
    REQUIREMENT_TYPE_DOCUMENT.TICKET_SALIDA,
  ]),
  numDocument: z.string(),
  amount: z.number(),
  cashId: z.number(),
  cashName: z.string(),
  paymentMethod: z.enum([PAYMENT_METHOD.CASH, PAYMENT_METHOD.CREDIT]),
  expiresAt: z.string().date(),
  retention: z.boolean(),
  amountRetation: z.number(),
  hasRetation: z.boolean(),
});

export type CreateRequirementDto = z.infer<typeof createRequirementValidator>;
