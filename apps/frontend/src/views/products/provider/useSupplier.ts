/* eslint-disable @typescript-eslint/no-unused-vars */
import { useReducer, useState } from 'react'
import { toast } from 'react-toastify'
import { atom, RecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/maintenance/Supplier/sdk'
import { ISupplier } from '@/data/maintenance/Supplier/type/Supplier'
import { Filters3 } from '@/data/types/Filters'

export const filtersSupplierAtom: RecoilState<Filters3<ISupplier>> = atom({
  key: 'filtersSupplier',
  default: {},
})

export const useSupplier = () => {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([])
  const [filterName, setFilterName] = useState('')
  const [, onReload] = useReducer((state) => state + 1, 0)
  const [, setControler] = useReducer((state) => state + 1, 0)
  const [loading, setLoading] = useState(false)
  const filters = useRecoilValue(filtersSupplierAtom)
  const setFilters = useSetRecoilState(filtersSupplierAtom)

  const cleanAll = () => {
    setFilterName('')
    setFilters({})
  }

  // const filtered = useMemo(() => {
  //   console.log('prueba : ', suppliers)
  //   const filtersList: { key: string; value: string | number }[] = Object.keys(
  //     filters,
  //   )
  //     .map((key) => {
  //       return {
  //         key: key,
  //         value: ((filters[key as keyof ISupplier] ?? []) as any)[1],
  //       }
  //     })
  //     .filter((el) => el.value != undefined || el.value != null)

  //   if (filterName == '' && filtersList.length == 0) {
  //     return suppliers
  //   }

  //   const filtered = suppliers.filter((supplier) => {
  //     if (filterName != '') {
  //       if (
  //         !supplier.legal_name
  //           ?.toLowerCase()
  //           .includes(filterName.toLowerCase()) ||
  //         !supplier.supplier?.toLowerCase().includes(filterName.toLowerCase())
  //       ) {
  //         return false
  //       }
  //     }
  //     if (filtersList.length > 0) {
  //       for (let i = 0; i < filtersList.length; i++) {
  //         if (
  //           !supplier[filtersList[i].key as keyof ISupplier] ||
  //           !supplier[filtersList[i].key as keyof ISupplier]
  //             .toString()
  //             .toLowerCase()
  //             .includes(filtersList[i].value.toString().toLowerCase())
  //         ) {
  //           return false
  //         }
  //       }
  //     }

  //     return true
  //   })
  //   return filtered
  // }, [suppliers, controle])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const response: ISupplier[] = await sdk.getSupplier()
      setSuppliers(response)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }

  // useEffect(() => {
  //   loadSuppliers()
  // }, [reload])
  return {
    suppliers,
    cleanAll,
    setControler,
    filterName,
    setFilterName,
    onReload,
    filters,
    setFilters,
    loading,
    loadSuppliers,
  }
}
