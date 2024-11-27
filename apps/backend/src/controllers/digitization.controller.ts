import { badRequest } from '@hapi/boom'
import axios from 'axios'
import { NextFunction, Request, Response } from 'express'

import { AdmFile } from '../entities/AdmFile'
import AdmFileRepository from '../repositories/admFile.repository'
import RequestRepository from '../repositories/request.repository'
import { AdmFileService } from '../services/AdmFile.service'
import { AwsService } from '../services/Aws.service'
import { IToken } from '../types'
import { OpFilter } from '../types/filter'
import { safeAny } from '../utils/someAny'

const awsService = new AwsService()
const admFileService = new AdmFileService(
  AdmFileRepository,
  RequestRepository,
  awsService,
)

export class DigitizationController {
  async createDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        throw badRequest('No se encontro archivo fileD')
      }
      const token: IToken = req.headers.token as safeAny
      const admFile = req.body as AdmFile
      await admFileService.createDocument(admFile, req.file, token.name)
      res
        .status(200)
        .json({ message: 'Documento creado correctamente', data: admFile })
    } catch (err) {
      next(err)
    }
  }

  async showDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { filename } = req.params
      const urlFile = await admFileService.showDocument(filename)
      const response = await axios.get(urlFile, {
        responseType: 'arraybuffer',
      })
      res.set('Content-Type', 'application/pdf')
      res.status(200).send(response.data)
    } catch (err) {
      next(err)
    }
  }

  async deleteDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params
      await admFileService.deleteDocument(Number(id))
      res.json({ message: 'Documento eliminado' })
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
      let admFile: AdmFile | null = null
      if (filename) {
        admFile = await admFileService.getDocumentByFileName(filename)
      } else {
        admFile = await admFileService.getDocumentById(Number(id))
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
      const document = req.body as AdmFile
      await admFileService.updateDocument(document)
      res.status(200).json({ message: 'Documento actualizado' })
    } catch (err) {
      next(err)
    }
  }

  async filterDocuments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as {
        [key: string]: [OpFilter, ...safeAny[]]
      }
      const documents = await admFileService.filterDocuments(queries)
      res.status(200).json({ data: documents })
    } catch (err) {
      next(err)
    }
  }
}
