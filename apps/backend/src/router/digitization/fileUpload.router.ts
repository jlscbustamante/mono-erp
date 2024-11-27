/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Application } from 'express'
import multer, { FileFilterCallback } from 'multer'

import { FileUploadController } from '../../controllers/fileUpload.controller'
import { validateToken } from '../../middleware/jwt/validateToken'
import { updateSchema } from '../../middleware/validators/digitization/updateSchema'
import validateSchema from '../../middleware/validators/validateSchema'
import { safeAny } from '../../utils/someAny'

const fileUploadController = new FileUploadController()
export const loadDigitizationPaymentsEndpoints = (app: Application): void => {
  // cargar multer
  const upload = multer({
    fileFilter: (req: safeAny, file: safeAny, cb: FileFilterCallback) => {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        file.mimetype === 'text/csv' ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        file.mimetype === 'application/vnd.ms-excel' ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        cb(null, true)
      } else {
        // cb(null, false)
        cb(new Error('El archivo no es del tipo csv o xlsx'))
      }
    },
  })

  app.post(
    '/api/fileUploadIzipay',
    validateToken,
    upload.single('fileD'),
    fileUploadController.uploadIzipayPos,
  )

  app.post(
    '/api/fileUploadBanco',
    validateToken,
    upload.single('fileD'),
    fileUploadController.createDocumentBanco,
  )

  app.post(
    '/api/fileUploadCulqiOnline',
    validateToken,
    upload.single('fileD'),
    fileUploadController.uploadCulqiOnline,
  )

  app.post(
    '/api/fileUploadCulqiPos',
    validateToken,
    upload.single('fileD'),
    fileUploadController.uploadCulqiPos,
  )

  app.get(
    '/api/digitization/payments/filter',
    validateToken,
    // validatePermission,
    fileUploadController.filter,
  )

  app.get(
    '/api/digitization/get-doc/:filename',
    fileUploadController.showDocument,
  )

  app.delete('/api/digitization/:id', fileUploadController.deleteDocument)

  app.put(
    '/api/digitization/',
    validateSchema(updateSchema),

    fileUploadController.updateDocument,
  )

  // app.get('/api/digitization/:id', fileUploadController.getDocument)

  // app.get('/api/digitization/url/:filename', fileUploadController.getDocument)

  app.post(
    '/api/fileUpload/izipayAmex',
    validateToken,
    upload.single('fileD'),
    fileUploadController.uploadIzipayAmex,
  )

  app.post(
    '/api/fileUpload/izipayMc',
    validateToken,
    upload.single('fileD'),
    fileUploadController.uploadIzipayMc,
  )

  app.post(
    '/api/fileUpload/izipayDinner',
    validateToken,
    upload.single('fileD'),
    fileUploadController.uploadIzipayDinner,
  )

  app.post(
    '/api/fileUpload/culqiAbono',
    validateToken,
    upload.single('fileD'),
    fileUploadController.uploadCulqiAbono,
  )
}
