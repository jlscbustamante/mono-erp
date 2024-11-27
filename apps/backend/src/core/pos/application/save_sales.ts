import { PosRepository } from '../infrastructure/pos.repository'

export class SaveSales {
  private readonly posRepository: PosRepository = new PosRepository()

  async run() {}
}
