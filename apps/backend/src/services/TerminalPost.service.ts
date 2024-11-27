import { TerminalPost } from '../entities/TerminalPost'
import { TerminalPostRepository } from '../repositories/terminalPost.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

type EditTerminalPost = {
  terminal: string
  sucursal_id: string
  supplier: string
  status: number
}

export class TerminalPostService {
  constructor(
    private readonly terminalPostRepository: TerminalPostRepository,
  ) {}

  async getFilteredSupplierNt(
    filters: EnvFilters<TerminalPost>,
  ): Promise<TerminalPost[]> {
    return this.terminalPostRepository.filterNt(filters)
  }

  async updateTerminalPost(
    existingTerminalPost: TerminalPost,
    args: EditTerminalPost,
  ): Promise<void> {
    try {
      existingTerminalPost.terminal = args.terminal
      existingTerminalPost.sucursal_id = args.sucursal_id
      existingTerminalPost.supplier = args.supplier
      existingTerminalPost.status = args.status
      existingTerminalPost.updated_at = dateNow()
      await this.terminalPostRepository.save(existingTerminalPost)
    } catch (error: any) {
      throw new Error(`Error al actualizar el terminal post: ${error}`)
    }
  }

  async createTerminalPost(args: EditTerminalPost): Promise<void> {
    try {
      const newTerminalPost = new TerminalPost()
      newTerminalPost.terminal = args.terminal
      newTerminalPost.sucursal_id = args.sucursal_id
      newTerminalPost.supplier = args.supplier
      newTerminalPost.status = args.status
      newTerminalPost.created_at = dateNow()
      newTerminalPost.updated_at = dateNow()
      await this.terminalPostRepository.save(newTerminalPost)
    } catch (err: any) {
      throw new Error(`Error al crear el terminal post: ${err}`)
    }
  }
}
