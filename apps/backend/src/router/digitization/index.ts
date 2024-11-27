/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Application, NextFunction, Request, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'

import { URL_SHOW_DOC } from '../../const'
import { DigitizationController } from '../../controllers/digitization.controller'
import { RequestController } from '../../controllers/request.controller'
import { validateToken } from '../../middleware/jwt/validateToken'
import { validatePermission } from '../../middleware/validatePermission/validatePermission'
import { createSchema } from '../../middleware/validators/digitization/createSchema'
import { updateSchema } from '../../middleware/validators/digitization/updateSchema'
import validateSchema from '../../middleware/validators/validateSchema'
import { safeAny } from '../../utils/someAny'

const digitizationController = new DigitizationController()
const requestController = new RequestController()

export const loadDigitizationEndpoints = (app: Application): void => {
  // cargar multer
  const upload = multer({
    fileFilter: (req: safeAny, file: safeAny, cb: FileFilterCallback) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (file.mimetype === 'application/pdf') {
        cb(null, true)
      } else {
        // cb(null, false)
        cb(new Error('El archivo no es de tipo pdf'))
      }
    },
  })

  app.post(
    '/api/digitization/create',
    upload.single('fileD'),
    validateToken,
    validateSchema(createSchema),
    digitizationController.createDocument,
  )

  app.get(
    `/${URL_SHOW_DOC}/:filename*`,
    (req: Request, res: Response, next: NextFunction) => {
      if (req.params['0']) {
        req.params.filename = req.params.filename + req.params['0']
      }
      next()
    },
    digitizationController.showDocument,
  )

  app.delete(
    '/api/digitization/delete/:id',
    validateToken,
    digitizationController.deleteDocument,
  )

  app.put(
    '/api/digitization/update',
    validateToken,
    validateSchema(updateSchema),
    digitizationController.updateDocument,
  )

  app.get(
    '/api/digitization/get/:id',
    validateToken,
    digitizationController.getDocument,
  )

  app.get(
    '/api/digitization/url/:filename',
    validateToken,
    digitizationController.getDocument,
  )

  app.get(
    '/api/digitization',
    validateToken,
    digitizationController.filterDocuments,
  )

  app.post(
    '/api/digitization/request/filter',
    validateToken,
    requestController.filter,
  )
}
