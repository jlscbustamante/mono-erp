import joi from 'joi'

import { AdmFile } from '../../../entities/AdmFile'
import { FileType } from '../../../types/admFile'

export const createSchema = joi.object<AdmFile>({
  doc_type: joi
    .string()
    .valid(...Object.values(FileType))
    .required(),
  doc_date: joi.date().iso().required(),
  doc_number: joi.string().allow(''),
  doc_request: joi.number().integer(),
  doc_description: joi.string().allow(''),
})
