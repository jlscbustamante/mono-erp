import joi from 'joi'

import { AdmFile } from '../../../entities/AdmFile'
import { FileType } from '../../../types/admFile'

export const updateSchema = joi.object<AdmFile>({
  id: joi.number().integer().required(),
  doc_type: joi.string().valid(...Object.values(FileType)),
  doc_date: joi.date().iso(),
  doc_number: joi.string().allow('', null),
  doc_request: joi.number().integer(),
  doc_description: joi.string().allow(''),
  doc_ocr: joi.any(),
  doc_url: joi.string(),
})
