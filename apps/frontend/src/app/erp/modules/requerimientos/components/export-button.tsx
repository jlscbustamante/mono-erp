import { viewClient } from '@/lib/rpc'
import { RequirementSelect, WhereOption } from '@pizzadb'
import { useMutation } from '@tanstack/react-query'
import { Button } from 'antd'
import { RiFileExcel2Line } from 'react-icons/ri'
import { toast } from 'react-toastify'

export function ExportRequirements({
  filters,
}: {
  filters?: WhereOption<RequirementSelect>[]
}) {
  const getDocumentMt = useMutation({
    mutationFn: async (filters: WhereOption<RequirementSelect>[]) => {
      const response = await fetch(
        viewClient.api.view.requirement.report.export.$url() +
          `?filters=${JSON.stringify(filters)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type':
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Error al descargar el archivo')
      }

      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'archivo.xlsx') // Nombre del archivo a descargar

      // Simular un clic en el enlace para iniciar la descarga
      link.click()

      // Liberar la URL del Blob
      window.URL.revokeObjectURL(url)
    },
    onError: (error) => {
      console.log('error : ', error)
    },
  })

  const handleExport = async () => {
    if (!filters) {
      toast.error('No se encontro las fecha para exportar')
      return
    }
    getDocumentMt.mutate(filters)
  }

  return (
    <Button type="primary" onClick={handleExport} className="px-2">
      <RiFileExcel2Line className="w-5 h-5 items-center" />
      {/* Expotar */}
    </Button>
  )
}
