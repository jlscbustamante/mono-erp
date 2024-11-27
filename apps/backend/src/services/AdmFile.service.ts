import { format, getUnixTime, parseISO } from 'date-fns'

import config from '../config/config'
import { URL_SHOW_DOC } from '../const'
import { AdmFile } from '../entities/AdmFile'
import { AdmFileRepository } from '../repositories/admFile.repository'
import { RequestRepository } from '../repositories/request.repository'
import { OpFilter } from '../types/filter'
import { safeAny } from '../utils/someAny'
import { AwsService } from './Aws.service'

export class AdmFileService {
  constructor(
    private readonly admFileRepository: AdmFileRepository,
    private readonly requestRepository: RequestRepository,
    private readonly awsService: AwsService,
  ) {}

  async createDocument(
    newFile: AdmFile,
    file: Express.Multer.File,
    user: string,
  ): Promise<void> {
    const admFile = Object.assign({}, newFile)
    const fileName = `${format(
      parseISO(admFile.doc_date),
      'yyyy-MM',
    )}/${getUnixTime(new Date())}.pdf`
    const filePath = `${config.host}/${URL_SHOW_DOC}/${fileName}`
    const path = `${config.s3FolderRequirement}${fileName}`
    await this.awsService.uploadFile(file, path)
    admFile.doc_url = filePath
    admFile.created_by = user
    admFile.created_at = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    admFile.id = null
    if (admFile.doc_request) {
      const request = await this.requestRepository.findOne({
        where: { id: admFile.doc_request },
      })
      if (request) {
        const docs = request.doc_url
        if (!docs) {
          request.doc_url = filePath
        } else {
          const docsurl = docs.split(',')
          docsurl.push(filePath)
          request.doc_url = docsurl.join(',')
        }
        await this.requestRepository.save(request)
      }
    }
    await this.admFileRepository.insert(admFile)
  }

  async showDocument(nameFile: string): Promise<string> {
    return await this.awsService.createPresigedUrl(
      `${config.s3FolderRequirement}${nameFile}`,
    )
  }

  async updateDocument(admFile: AdmFile): Promise<void> {
    await this.admFileRepository.save(admFile)
  }

  async deleteDocument(docId: number): Promise<void | undefined> {
    const doc = await this.admFileRepository.findOne({ where: { id: docId } })
    if (!doc) return
    if (doc.doc_request) {
      const request = await this.requestRepository.findOne({
        where: { id: doc.doc_request },
      })
      if (request) {
        const docs = request.doc_url ?? ''
        request.doc_url = docs
          .split(',')
          .filter((e) => e !== doc.doc_url)
          .join(',')
        await this.requestRepository.save(request)
      }
    }
    await this.admFileRepository.delete(docId)
  }

  async getDocumentById(docId: number): Promise<AdmFile | null> {
    return this.admFileRepository.findOne({ where: { id: docId } })
  }

  async getDocumentByFileName(nameFile: string): Promise<AdmFile | null> {
    return this.admFileRepository.findOne({ where: { doc_url: nameFile } })
  }

  async filterDocuments(filters: {
    [key: string]: [OpFilter, ...safeAny[]]
  }): Promise<AdmFile[]> {
    return this.admFileRepository.filterNt(filters)
  }
}
