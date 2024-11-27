import type { Request, Response } from 'express'

import { catchError } from '../../../utils/decorators'
import { sendDispatchEfisUseCase } from '../dependencies'

export class EfisController {
  @catchError
  async sendDispatch(req: Request, res: Response) {
    const { dispatchId } = req.query as { dispatchId: string }
    const data = await sendDispatchEfisUseCase.run(Number(dispatchId))
    return res.json({
      success: true,
      data,
    })
  }
}
