import { TerminalPostStatus } from '../status/status'

export interface ITerminalPost {
  id: number
  terminal: string
  sucursal_id: string
  supplier: string
  show_in: number
  status: TerminalPostStatus
  created_at: string
}

export interface IFilterTerminalPost {
  id?: number
  terminal?: string
  sucursal_id?: string
  show_in?: number
  supplier?: string
  status?: TerminalPostStatus
}

export interface ICreateTerminalPost extends Omit<ITerminalPost, 'id'> {
  id: any
}
