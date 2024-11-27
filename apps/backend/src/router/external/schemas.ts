import Joi from 'joi'

export const idStockSchema = Joi.object({
  id: Joi.number().required(),
})

export const stockAtSchema = Joi.object({
  stock_at: Joi.string(),
})

export const updateStockSchema = Joi.object({
  update: Joi.array()
    .items(
      Joi.object({
        id: Joi.number(),
        stock_physical: Joi.number().required(),
        total_value: Joi.number().required(),
      }),
    )
    .required(),
})

export const saveNewStockSchema = Joi.object({
  inventario: Joi.array().required(),
})

export const getNewTemplateSchema = Joi.object({
  date: Joi.date().iso().required(),
  sucursalCode: Joi.string().required(),
  type: Joi.string().required(),
})

export const getNewWarehouseTemplateSchema = Joi.object({
  date: Joi.date().iso().required(),
  sucursalCode: Joi.string().required(),
})
