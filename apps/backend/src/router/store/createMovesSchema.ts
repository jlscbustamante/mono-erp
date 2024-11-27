import Joi from 'joi'

import { IPosMove } from '../../controllers/pos/pos.controller'

/*
{
	"0": {
		"idCatDep": 1,
		"nombreCat": "VENTA TOTAL",
		"idTienda": 1,
		"idDia": 1136,
		"idUsuario": 0,
		"tipo": "V",
		"descripcion": "FORMA DE PAGO",
		"valor": 13761.2,
		"estado": "A"
	}
}
*/
export const createMovesPosSchema = Joi.object<IPosMove>({
  code: Joi.string().required(),
  username: Joi.string().required(),
  date: Joi.date().iso().required(),
  categories: Joi.array()
    .items(
      Joi.object({
        categoryId: Joi.number().integer().required(),
        description: Joi.string().required(),
        amount: Joi.number().required(),
      }).allow(null, ''),
    )
    .min(1)
    .required(),
})
