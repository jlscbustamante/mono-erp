/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { badRequest } from '@hapi/boom'
import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import XLSX from 'xlsx'

import { FileUpload } from '../entities/FileUpload'
import FilePaymentRepository from '../repositories/FileUpload.repository'
import { AwsService } from '../services/Aws.service'
import { FileUploadService } from '../services/FileUpload.service'
import { EnvFilters, IToken } from '../types'
import { CulqiFolder, IzipayeFolder } from '../types/fileUpload'
import { catchError } from '../utils/decorators'
import {
  culqiAbonoSchema,
  culqiOnlineSchema,
  culqiPosSchema,
  FolderSchema,
  izipayAmexSchema,
  izipayDinnerSchema,
  izipayMcSchema,
  izipayPosSchema,
} from '../utils/fileSchemas'
import { safeAny } from '../utils/someAny'

const awsService = new AwsService()
const fileUploadService = new FileUploadService(
  FilePaymentRepository,
  awsService,
)

export class FileUploadController {
  @catchError
  async createDocumentBanco(req: Request, res: Response): Promise<void> {
    const token: IToken = req.headers.token as safeAny
    if (!req.file) {
      throw badRequest('No se encontro archivo fileD')
    }
    const arHeader = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
    const arHeaderJson = {
      A: 'Fecha',
      B: 'Fecha valuta',
      C: 'Descripción operación',
      D: 'Monto',
      E: 'Saldo',
      F: 'Sucursal - agencia',
      G: 'Operación - Número',
      H: 'Operación - Hora',
      I: 'Usuario',
      J: 'UTC',
      K: 'Referencia2',
    } as any
    // Si el archivo es XLSX (funciona tambien con csv), realiza la lectura de filas
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convierte la hoja en un objeto JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: arHeader,
      blankrows: true,
    })
    const arDataHeader = jsonData[0] as safeAny
    let _schemaComplete = false
    Object.keys(arDataHeader as keyof safeAny).forEach((key) => {
      const value = arDataHeader[key]
      const value_aux = arHeaderJson[key]
      if (value == value_aux) {
        _schemaComplete = true
      } else {
        _schemaComplete = false
      }
    })

    if (!_schemaComplete) {
      throw badRequest(
        'No coincide el archivo con los datos que se deberia de subir',
      )
    }

    const admFile = req.body as FileUpload
    await fileUploadService.createDocumentBanco(admFile, req.file, token.name)
    res
      .status(200)
      .json({ message: 'Documento creado correctamente', data: admFile })
  }

  @catchError
  async showDocument(req: Request, res: Response): Promise<void> {
    const { filename } = req.params
    const urlFile = await fileUploadService.showDocument(filename)
    const response = await axios.get(urlFile, {
      responseType: 'arraybuffer',
    })
    res.set('Content-Type', 'application/pdf')
    res.status(200).send(response.data)
  }

  @catchError
  async filter(req: Request, response: Response): Promise<void> {
    const queries = req.query as EnvFilters<FileUpload>
    const files = await fileUploadService.filterDocuments(queries)
    response.json({ data: files })
  }

  async deleteDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params
      await fileUploadService.deleteDocument(Number(id))
    } catch (err) {
      next(err)
    }
  }

  async getDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, filename } = req.params
      let admFile: FileUpload | null = null
      if (filename) {
        admFile = await fileUploadService.getDocumentByFileName(filename)
      } else {
        admFile = await fileUploadService.getDocumentById(Number(id))
      }
      res.status(200).json({ data: admFile })
    } catch (err) {
      next(err)
    }
  }

  async updateDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const document = req.body as FileUpload
      await fileUploadService.updateDocument(document)
      res.status(200).json({ message: 'Documento actualizado' })
    } catch (err) {
      next(err)
    }
  }

  @catchError
  async uploadIzipayPos(req: Request, res: Response): Promise<void> {
    const token: IToken = req.headers.token as safeAny
    if (!req.file) throw badRequest('No se encontro archivo fileD')
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })

    FileUploadController.validateSchema(workbook, izipayPosSchema)
    await fileUploadService.uploadPaymentMethods(
      req.file,
      IzipayeFolder.pos,
      token.name,
    )

    res.status(200).json({ message: 'Documento creado correctamente' })
  }

  @catchError
  async uploadCulqiOnline(req: Request, res: Response): Promise<void> {
    const token: IToken = req.headers.token as safeAny
    if (!req.file) throw badRequest('No se encontro archivo fileD')

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    FileUploadController.validateSchema(workbook, culqiOnlineSchema)
    await fileUploadService.uploadPaymentMethods(
      req.file,
      CulqiFolder.online,
      token.name,
    )
    res.status(200).json({ message: 'Documento creado correctamente' })
  }

  @catchError
  async uploadCulqiPos(req: Request, res: Response): Promise<void> {
    const token: IToken = req.headers.token as safeAny
    if (!req.file) {
      throw badRequest('No se encontro archivo fileD')
    }
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    FileUploadController.validateSchema(workbook, culqiPosSchema)

    await fileUploadService.uploadPaymentMethods(
      req.file,
      CulqiFolder.pos,
      token.name,
    )
    res.status(200).json({ message: 'Documento creado correctamente' })
  }

  // nuevos
  @catchError
  async uploadIzipayAmex(req: Request, res: Response) {
    if (!req.file) throw badRequest('No se encontro el archivo fileD')
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })

    const token: IToken = req.headers.token as safeAny
    FileUploadController.validateSchema(workbook, izipayAmexSchema)
    await fileUploadService.uploadPaymentMethods(
      req.file,
      IzipayeFolder.amex,
      token.name,
    )

    res.status(200).json({ message: 'Archivo subido correctamente' })
  }

  @catchError
  async uploadIzipayMc(req: Request, res: Response) {
    if (!req.file) throw badRequest('No se encontro el archivo fileD')
    const token: IToken = req.headers.token as safeAny

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })

    FileUploadController.validateSchema(workbook, izipayMcSchema)
    await fileUploadService.uploadPaymentMethods(
      req.file,
      IzipayeFolder.mc,
      token.name,
    )

    res.status(200).json({ message: 'Archivo subido correctamente' })
  }

  @catchError
  async uploadIzipayDinner(req: Request, res: Response) {
    if (!req.file) throw badRequest('No se encontro el archivo fileD')
    const token: IToken = req.headers.token as safeAny
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })

    FileUploadController.validateSchema(workbook, izipayDinnerSchema)
    await fileUploadService.uploadPaymentMethods(
      req.file,
      IzipayeFolder.dinner,
      token.name,
    )

    res.status(200).json({ message: 'Archivo subido correctamente' })
  }

  @catchError
  async uploadCulqiAbono(req: Request, res: Response) {
    if (!req.file) throw badRequest('No se encontro el archivo fileD')
    const token: IToken = req.headers.token as safeAny
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })

    FileUploadController.validateSchema(workbook, culqiAbonoSchema)
    await fileUploadService.uploadPaymentMethods(
      req.file,
      CulqiFolder.abono,
      token.name,
    )

    res.status(200).json({ message: 'Archivo subido correctamente' })
  }

  static validateSchema(workbook: XLSX.WorkBook, schema: FolderSchema) {
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData: Record<string, string>[] = XLSX.utils.sheet_to_json(
      worksheet,
      {
        header: schema.header,
        blankrows: false,
      },
    )
    const arDataHeader = jsonData[0]
    console.log(arDataHeader)
    let _schemaComplete = false
    Object.keys(arDataHeader).forEach((key) => {
      const value = arDataHeader[key]
      const value_aux = schema.headerJson[key]
      if (value.toLowerCase() == value_aux.toLowerCase()) _schemaComplete = true
      else _schemaComplete = false

      if (!_schemaComplete) {
        throw badRequest(
          `El archivo no cumple con la estructura valida, se esperaba la columna '${value_aux}' y se encontro '${value}'`,
        )
      }
    })
  }
}
