export interface Account {
  id: number
  account: string
  is_father: number
  father: number
  type: string
  level: string
  visible: number
  status: number
  created_by: string
  created_at: Date
}
