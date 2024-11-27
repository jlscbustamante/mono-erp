import { OpFilter } from '@/data/types/Filters'

import { IPaymentFile } from '../types'

export const fieldsFilterPaymentFile = (): {
  key: keyof IPaymentFile
  label: string
}[] => {
  return [
    {
      key: 'id',
      label: 'Id',
    },
    {
      key: 'file_name',
      label: 'Nombre del archivo',
    },
    // {
    //   key: 'folder',
    //   label: 'Folder',
    // },
    {
      key: 'file_type',
      label: 'Tipo de archivo',
    },
    {
      key: 'upload_by',
      label: 'Subido por',
    },
  ]
}

export const optionsFilterPaymentFile = (
  key: keyof IPaymentFile,
): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'file_name':
    case 'file_type':
    case 'upload_by':
      // case 'folder':
      return [OpFilter.Contain, OpFilter.Equal, OpFilter.NotEqual]
    default:
      return [OpFilter.Equal]
  }
}
