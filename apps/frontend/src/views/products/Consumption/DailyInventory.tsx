import { Button, DatePicker, Divider, Select, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useRecoilState } from 'recoil'

import { filterDateSt } from '@/data/stores/state'
import { safeAny } from '@/utils'

const DailyInventory = () => {
  const [date, setDate] = useRecoilState(filterDateSt)
  interface DataType {
    familia: string
    producto: string
    present: string
    inicial: number
    despacho: string
    compras: number
    entrada: string
    salida: string
    venta: string
    teorico: string
    fisico: string
    diferencial: string
    costo: number
    total: number
    consumo: number
    ratio: string
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Familia',
      dataIndex: 'familia',
      rowScope: 'row',
      render: (text, record, index) => {
        const isFirstInGroup =
          index === 0 || record.familia !== data[index - 1].familia
        return {
          children: <a style={{ color: 'white' }}>{text}</a>,
          props: {
            rowSpan: isFirstInGroup
              ? data.filter((item) => item.familia === text).length
              : 0,
            style: { background: isFirstInGroup ? 'green' : 'transparent' },
          },
        }
      },
    },
    {
      title: 'Producto',
      dataIndex: 'producto',
    },
    {
      title: 'Present.',
      dataIndex: 'present',
    },
    {
      title: 'Inicial',
      dataIndex: 'inicial',
    },
    {
      title: 'Despacho',

      dataIndex: 'despacho',
    },
    {
      title: 'Compras',
      dataIndex: 'compras',
    },
    {
      title: 'Entrada',
      dataIndex: 'entrada',
    },
    {
      title: 'Salida',
      dataIndex: 'salida',
    },
    {
      title: 'Venta',
      dataIndex: 'venta',
    },
    {
      title: 'Teorico',
      dataIndex: 'teorico',
    },
    {
      title: 'Fisico',
      dataIndex: 'fisico',
    },
    {
      title: 'Diferencial',
      dataIndex: 'diferencial',
    },
    {
      title: 'Costo',
      dataIndex: 'costo',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (text) => <p>s/.{text}</p>,
    },
    {
      title: 'Consumo',
      dataIndex: 'consumo',
    },
    {
      title: 'Ratio',
      dataIndex: 'ratio',
    },
  ]

  const data: DataType[] = [
    {
      familia: 'Abarrotes',
      producto: 'Valor0',
      present: 'Valor1',
      inicial: 10,
      despacho: 'Valor2',
      compras: 20,
      entrada: 'Valor3',
      salida: 'Valor4',
      venta: 'Valor5',
      teorico: 'Valor6',
      fisico: 'Valor7',
      diferencial: 'Valor8',
      costo: 30,
      total: 40,
      consumo: 50,
      ratio: 'Valor9',
    },
    {
      familia: 'Abarrotes',
      producto: 'OtroValor0',
      present: 'OtroValor1',
      inicial: 15,
      despacho: 'OtroValor2',
      compras: 25,
      entrada: 'OtroValor3',
      salida: 'OtroValor4',
      venta: 'OtroValor5',
      teorico: 'OtroValor6',
      fisico: 'OtroValor7',
      diferencial: 'OtroValor8',
      costo: 35,
      total: 45,
      consumo: 55,
      ratio: 'OtroValor9',
    },
    {
      familia: 'C5_ABAR',
      producto: 'OtroValor0',
      present: 'OtroValor1',
      inicial: 15,
      despacho: 'OtroValor2',
      compras: 25,
      entrada: 'OtroValor3',
      salida: 'OtroValor4',
      venta: 'OtroValor5',
      teorico: 'OtroValor6',
      fisico: 'OtroValor7',
      diferencial: 'OtroValor8',
      costo: 35,
      total: 45,
      consumo: 55,
      ratio: 'OtroValor9',
    },
    {
      familia: 'CAJAS',
      producto: 'OtroValor0',
      present: 'OtroValor1',
      inicial: 15,
      despacho: 'OtroValor2',
      compras: 25,
      entrada: 'OtroValor3',
      salida: 'OtroValor4',
      venta: 'OtroValor5',
      teorico: 'OtroValor6',
      fisico: 'OtroValor7',
      diferencial: 'OtroValor8',
      costo: 35,
      total: 45,
      consumo: 55,
      ratio: 'OtroValor9',
    },
    {
      familia: 'CAJAS',
      producto: 'OtroValor0',
      present: 'OtroValor1',
      inicial: 15,
      despacho: 'OtroValor2',
      compras: 25,
      entrada: 'OtroValor3',
      salida: 'OtroValor4',
      venta: 'OtroValor5',
      teorico: 'OtroValor6',
      fisico: 'OtroValor7',
      diferencial: 'OtroValor8',
      costo: 35,
      total: 45,
      consumo: 55,
      ratio: 'OtroValor9',
    },
    {
      familia: 'CAJAS',
      producto: 'OtroValor0',
      present: 'OtroValor1',
      inicial: 15,
      despacho: 'OtroValor2',
      compras: 25,
      entrada: 'OtroValor3',
      salida: 'OtroValor4',
      venta: 'OtroValor5',
      teorico: 'OtroValor6',
      fisico: 'OtroValor7',
      diferencial: 'OtroValor8',
      costo: 35,
      total: 45,
      consumo: 55,
      ratio: 'OtroValor9',
    },
    {
      familia: 'CAJAS',
      producto: 'OtroValor0',
      present: 'OtroValor1',
      inicial: 15,
      despacho: 'OtroValor2',
      compras: 25,
      entrada: 'OtroValor3',
      salida: 'OtroValor4',
      venta: 'OtroValor5',
      teorico: 'OtroValor6',
      fisico: 'OtroValor7',
      diferencial: 'OtroValor8',
      costo: 35,
      total: 45,
      consumo: 55,
      ratio: 'OtroValor9',
    },
    {
      familia: 'CAJAS',
      producto: 'OtroValor0',
      present: 'OtroValor1',
      inicial: 15,
      despacho: 'OtroValor2',
      compras: 25,
      entrada: 'OtroValor3',
      salida: 'OtroValor4',
      venta: 'OtroValor5',
      teorico: 'OtroValor6',
      fisico: 'OtroValor7',
      diferencial: 'OtroValor8',
      costo: 35,
      total: 45,
      consumo: 55,
      ratio: 'OtroValor9',
    },
    {
      familia: 'CAJAS1',
      producto: 'OtroValor0',
      present: 'OtroValor1',
      inicial: 15,
      despacho: 'OtroValor2',
      compras: 25,
      entrada: 'OtroValor3',
      salida: 'OtroValor4',
      venta: 'OtroValor5',
      teorico: 'OtroValor6',
      fisico: 'OtroValor7',
      diferencial: 'OtroValor8',
      costo: 35,
      total: 45,
      consumo: 55,
      ratio: 'OtroValor9',
    },
    {
      familia: 'CAJAS2',
      producto: 'OtroValor0',
      present: 'OtroValor1',
      inicial: 15,
      despacho: 'OtroValor2',
      compras: 25,
      entrada: 'OtroValor3',
      salida: 'OtroValor4',
      venta: 'OtroValor5',
      teorico: 'OtroValor6',
      fisico: 'OtroValor7',
      diferencial: 'OtroValor8',
      costo: 35,
      total: 45,
      consumo: 55,
      ratio: 'OtroValor9',
    },
    {
      familia: 'CAJAS5',
      producto: 'OtroValor0',
      present: 'OtroValor1',
      inicial: 15,
      despacho: 'OtroValor2',
      compras: 25,
      entrada: 'OtroValor3',
      salida: 'OtroValor4',
      venta: 'OtroValor5',
      teorico: 'OtroValor6',
      fisico: 'OtroValor7',
      diferencial: 'OtroValor8',
      costo: 35,
      total: 45,
      consumo: 55,
      ratio: 'OtroValor9',
    },
  ]
  const total_table = data.reduce((sum, item) => sum + item.total, 0)
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <p style={{ marginLeft: '30px' }}>Fecha:</p>
          <DatePicker
            allowClear={false}
            value={dayjs(date)}
            onChange={(e: safeAny) => setDate(e.format('YYYY-MM-DD'))}
          />
          <p style={{ marginLeft: '20px' }}>Almacén:</p>
          <Select style={{ width: '220px' }}></Select>
          <p style={{ marginLeft: '20px' }}>Familia:</p>
          <Select style={{ width: '220px' }}></Select>
          <Button type="primary">Mostrar</Button>
        </div>
      </div>
      <Divider />
      <Table columns={columns} dataSource={data} bordered />

      <div style={{ textAlign: 'right' }}>
        <p
          style={{ marginRight: '-8px', fontSize: '20px', fontWeight: 'bold' }}
        >
          Total: s/.{total_table}{' '}
        </p>
      </div>
    </div>
  )
}

export default DailyInventory
