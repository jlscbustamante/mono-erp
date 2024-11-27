import { baseUrl } from '@/data/api/baseUrl'
import { IFilteredRequest, IRequest } from '@/data/requests'
import { Filters } from '@/data/types/Filters'
import { safeAny } from '@/utils'

import { IAdmFile, IPaymentFile } from '../types'

export const upload = (admFile: Partial<IAdmFile>, file: File) => {
  const formData = new FormData()
  formData.append('fileD', file)
  formData.append('doc_description', admFile.doc_description ?? '')
  formData.append('doc_type', admFile.doc_type!)
  formData.append('doc_number', admFile.doc_number ?? '')
  formData.append('doc_date', admFile.doc_date!)
  formData.append('doc_request', admFile.doc_request as string)
  return baseUrl<IAdmFile>('digitization/create', {
    method: 'POST',
    body: formData,
    formData: true,
  })
}

export const filter = async (filters: Filters<IAdmFile>) => {
  return baseUrl<IAdmFile[]>('digitization', { query: filters })
}

export const update = async (admFile: Partial<IAdmFile>) => {
  const newObj: Partial<IAdmFile> = Object.assign({}, admFile)
  delete newObj.created_at
  delete newObj.created_by
  return baseUrl<IAdmFile>('digitization/update', {
    method: 'PUT',
    body: newObj,
  })
}

export const deleteDocument = async (id: number) => {
  return baseUrl(`digitization/delete/${id}`, {
    method: 'DELETE',
  })
}

// archivos de pago

export const filterPaymentFiles = async (filters: Filters<IPaymentFile>) => {
  return baseUrl<IPaymentFile[]>('digitization/payments/filter', {
    query: filters,
  })
}

export const uploadIzipay = (file: safeAny) => {
  const formData = new FormData()
  formData.append('fileD', file)
  return baseUrl(`fileUploadIzipay`, {
    method: 'POST',
    body: formData,
    formData: true,
  })
}

export const uploadBank = (file: safeAny) => {
  const formData = new FormData()
  formData.append('fileD', file)
  return baseUrl(`fileUploadBanco`, {
    method: 'POST',
    body: formData,
    formData: true,
  })
}

export const uploadCulquiOnline = (file: safeAny) => {
  const formData = new FormData()
  formData.append('fileD', file)
  return baseUrl(`fileUploadCulqiOnline`, {
    method: 'POST',
    body: formData,
    formData: true,
  })
}

export const uploadCulquiPos = (file: safeAny) => {
  const formData = new FormData()
  formData.append('fileD', file)
  return baseUrl(`fileUploadCulqiPos`, {
    method: 'POST',
    body: formData,
    formData: true,
  })
}
export const requests = async (filters: Filters<IRequest>) => {
  return baseUrl<IFilteredRequest[]>('digitization/request/filter', {
    body: { filters },
    method: 'POST',
  })
}

//

export const uploadIzipayAmex = (file: safeAny) => {
  const formData = new FormData()
  formData.append('fileD', file)
  return baseUrl(`fileUpload/izipayAmex`, {
    method: 'POST',
    body: formData,
    formData: true,
  })
}

export const uploadIzipayMc = (file: safeAny) => {
  const formData = new FormData()
  formData.append('fileD', file)
  return baseUrl(`fileUpload/izipayMc`, {
    method: 'POST',
    body: formData,
    formData: true,
  })
}

export const uploadIzipayDinner = (file: safeAny) => {
  const formData = new FormData()
  formData.append('fileD', file)
  return baseUrl(`fileUpload/izipayDinner`, {
    method: 'POST',
    body: formData,
    formData: true,
  })
}

export const uploadCulqiAbono = (file: safeAny) => {
  const formData = new FormData()
  formData.append('fileD', file)
  return baseUrl(`fileUpload/culqiAbono`, {
    method: 'POST',
    body: formData,
    formData: true,
  })
}

export const FoldersUpload = {
  izipay: [
    'izipay_pos_amex',
    'izipay_pos_mc',
    'izipay_pos_dc',
    'izipay_pos',
    'izipay_pos/',
  ],
  culqi: [
    'culqi_abonos',
    'culqi_pos',
    'culqi_pos/',
    'culqi_online/',
    'culqi_online',
  ],
  bank: ['movimientos_bcp'],
}
