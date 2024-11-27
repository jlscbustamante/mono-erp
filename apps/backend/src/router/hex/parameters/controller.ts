import { type Request, type Response } from 'express'

import { Parameter } from '../../../entities/Parameter'
import parameterRepository from '../../../repositories/parameter.repository'

export class ParameterController {
  async getPublic(req: Request, res: Response) {
    const datadb: Parameter[] = await parameterRepository.find()
    const ciaIdMoturiderd = datadb.find(
      (item) => item.type == 'CIA_RAUL_MOTURIDER',
    )
    const data = {
      ciaIdMoturider: ciaIdMoturiderd ? ciaIdMoturiderd.value : null,
    }
    return res.json({ data, message: 'ok' })
  }
}
