import { DatePicker, Divider, Input, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import React from 'react'
import { useRecoilState } from 'recoil'

import { filterDateSt } from '@/data/stores/state'
import { safeAny } from '@/utils'

interface DataType {
  key: React.Key
  numero: string
  fecha: string
  concepto: string
  area: string
  cantidad: number
  unidad: string
  peso: number
  precio: number
  valor: number
}

const data: DataType[] = []
for (let i = 0; i < 1000; i++) {
  data.push({
    key: i,
    numero: `Num ${i}`,
    fecha: `Descripcion ${i}`,
    concepto: `Concepto ${i}`,
    area: `Área ${i}`,
    cantidad: i,
    unidad: `Unid. Med. ${i}`,
    peso: i,
    precio: i,
    valor: i,
  })
}

export const EntryGuide = () => {
  const [date, setDate] = useRecoilState(filterDateSt)
  const columns: ColumnsType<DataType> = [
    {
      title: 'Código',
      dataIndex: 'numero',
      width: 25,
    },
    {
      title: 'Descripción',
      dataIndex: 'fecha',
      width: 150,
    },
    {
      title: 'Cant.',
      dataIndex: 'cantidad',
      width: 40,
    },
    {
      title: 'Unid. Med.',
      dataIndex: 'unidad',
      width: 70,
    },
    {
      title: 'Peso/Lt.',
      dataIndex: 'peso',
      width: 40,
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      width: 40,
    },
    {
      title: 'Valor Total',
      dataIndex: 'valor',
      width: 40,
    },
  ]
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <p style={{ marginRight: '10px' }}>Número:</p>
          <Input style={{ width: '120px' }} />
          <p style={{ marginLeft: '30px' }}>Fecha de emisión:</p>
          <DatePicker
            allowClear={false}
            value={dayjs(date)}
            onChange={(e: safeAny) => setDate(e.format('YYYY-MM-DD'))}
          />
          <p style={{ marginLeft: '30px' }}>Observación:</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <p>Concepto:</p>
            <Input style={{ height: '30px', width: '400px' }} />
          </div>
          <div className="flex gap-2">
            <p>Área:</p>
            <Input
              style={{ height: '30px', width: '400px', marginLeft: '36px' }}
            />
          </div>
          <div className="flex gap-2" style={{ marginTop: '-86px' }}>
            <Input
              style={{ marginLeft: '572px', width: '400px', height: '100px' }}
            />
          </div>
        </div>
      </div>
      <Divider />
      <Table columns={columns} dataSource={data} scroll={{ y: 400 }} />
    </div>
  )
}
export default EntryGuide
