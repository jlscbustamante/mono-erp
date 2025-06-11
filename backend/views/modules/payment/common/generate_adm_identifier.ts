/*
Esta funcion crea el identificador para contratos, o requerimientos siguiendo las especficaciones dadas: 

- 11 digitos
- comienza con una key : F -> factura, A -> anticipo, C -> contrato, R -> requerimiento, T -> transferencia
- seguido de YY-MM
- seguido de 4 digitos correlativos
- ejem: F25-05-0001, A25-05-0001, C25-05-0001, R25-05-0001, T25-05-0001
 */

import { redis } from "#app/config/redis.ts";
import { format } from "date-fns";

export enum AdmTypeIdentifier {
  INVOICE = "R",
  CONTRACT = "C",
  TRANSFER = "T",
  PREPAYMENT = "A",
  ORDER = "O",
}

export const generate_adm_identifier = async (adm_type: AdmTypeIdentifier) => {
  const date_format = format(new Date(), "yyMM");
  const correlative_stored = (await redis.get(
    `erp:adm_correlative:${adm_type}`
  )) as string;
  const correlative = correlative_stored ? +correlative_stored + 1 : 1;
  const correlative_str = correlative.toString().padStart(4, "0");

  await redis.set(`erp:adm_correlative:${adm_type}`, correlative.toString());

  return `${adm_type}${date_format}/${correlative_str}`;
};
