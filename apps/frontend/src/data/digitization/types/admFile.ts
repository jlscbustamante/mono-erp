export interface IAdmFile {
  doc_type: 'BOLETA' | 'FACTURA'
  doc_date: string
  doc_number: string
  doc_description: string
  doc_request: number | string | null
  doc_url: string
  created_by: string
  created_at: string
  id: number
}
