import { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa6'

import { viewClient } from '@/lib/rpc'
import { cn } from '@/utils'

export const ProcessMultipleDispatch = ({
  origin,
  ids,
  onFinish,
  clear,
  date,
}: {
  date: string
  origin: string | undefined
  ids: number[]
  onFinish?: () => void
  clear?: () => void
}) => {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)

  const loadBucleCallApi = async () => {
    try {
      setError('')
      setLoading(true)
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index]
        // await dispatchOne(id, date, origin)
        const request =
          await viewClient.api.view.inventory.dispatch_order_id.$post({
            json: {
              dispatch_id: id,
              date: date,
              warehouse_origin: origin,
            },
          })
        if (!request.ok) {
          const error = await request.json()
          throw new Error(error.message ?? 'Error al procesar el despacho')
        }
        setStep(index + 1)
      }
      onFinish?.()
    } catch (err: any) {
      const message = err.message ?? 'Error al procesar el despacho'
      setError(message)
      // toast.error(message, { autoClose: false })
    } finally {
      setLoading(false)
      setStep(1)
      onFinish?.()
    }
  }

  // const dispatchOne = async (id: number, date: string, origin?: string) => {
  //   try {
  //     await simpleDispatch(id, date, origin)
  //   } catch (err: any) {
  //     const message = err.message ?? 'Error al procesar el despacho'
  //     throw new Error(id + ' : ' + message)
  //   }
  // }

  const closeAll = () => {
    if (loading) return
    clear?.()
  }

  useEffect(() => {
    if (!ids.length) return
    loadBucleCallApi()
  }, [ids])

  return (
    <div
      className={cn(
        'bg-slate-100 py-4 rounded-md mb-2 px-4 flex justify-between items-center',
        {
          hidden: !ids.length,
        },
      )}
    >
      <div
        className={cn('flex gap-1 items-center', {
          hidden: !loading,
        })}
      >
        <FaSpinner className="w-4 h-auto text-slate-600 animate-spin" />
        <span>
          Despachando {step} de {ids.length}.
        </span>
        <span className="text-sm text-slate-500">
          Evite cerrar esta ventana o cambiar de vista, espere a que se
          complete.
        </span>
      </div>
      <div
        className={cn('flex gap-1 items-center', {
          hidden: loading || error,
        })}
      >
        <span>{ids.length} Completados.</span>
      </div>
      <div
        className={cn({
          hidden: !error,
        })}
      >
        <p>Se cancelo el proceso.</p>
        {error && <p className="text-red-600">{error}</p>}
      </div>
      {!loading && (
        <p
          className={'text-blue-600 hover:underline cursor-pointer'}
          onClick={closeAll}
        >
          Cerrar
        </p>
      )}
    </div>
  )
}
