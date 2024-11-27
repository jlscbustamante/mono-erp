/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { badRequest } from '@hapi/boom'
import { format, getUnixTime } from 'date-fns'
import XLSX from 'xlsx'

import config from '../config/config'
import { FileUpload } from '../entities/FileUpload'
import { FileUploadRepository } from '../repositories/FileUpload.repository'
import { EnvFilters } from '../types'
import { CulqiFolder, IzipayeFolder } from '../types/fileUpload'
import { safeAny } from '../utils/someAny'
import { AwsService } from './Aws.service'

export class FileUploadService {
  constructor(
    private readonly filePaymentRepository: FileUploadRepository,
    private readonly awsService: AwsService,
  ) {}

  async createDocumentBanco(
    fileUpload: FileUpload,
    file: Express.Multer.File,
    user: string,
  ): Promise<void> {
    let _isCSV = false
    let csvData: safeAny
    //conversión de xlsx a csv
    if (
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      csvData = XLSX.utils.sheet_to_csv(worksheet)
      _isCSV = true
    }
    const fileName = `banco-${getUnixTime(new Date())}.csv`
    const path = `${config.s3BucketBanco}${config.s3FolderRequirementPayment}${fileName}`
    if (_isCSV) {
      await this.awsService.uploadFileBPC(csvData, path)
    } else {
      await this.awsService.uploadFileBPC(file, path)
    }
    fileUpload.file_name = fileName
    fileUpload.upload_by = user
    fileUpload.folder = `${config.s3BucketBanco}`
    fileUpload.file_type = 'csv'
    fileUpload.id = null
    await this.filePaymentRepository.insert(fileUpload)
  }

  async showDocument(nameFile: string): Promise<string> {
    return await this.awsService.createPresigedUrl(
      `${config.s3FolderRequirementPayment}${nameFile}`,
    )
  }

  async updateDocument(fileUpload: FileUpload): Promise<void> {
    await this.filePaymentRepository.save(fileUpload)
  }

  async deleteDocument(docId: number): Promise<void | undefined> {
    const doc = await this.filePaymentRepository.findOne({
      where: { id: docId },
    })
    if (!doc) return
    await this.filePaymentRepository.delete(docId)
  }

  async getDocumentById(docId: number): Promise<FileUpload | null> {
    return this.filePaymentRepository.findOne({ where: { id: docId } })
  }

  async getDocumentByFileName(nameFile: string): Promise<FileUpload | null> {
    return this.filePaymentRepository.findOne({
      where: { file_name: nameFile },
    })
  }

  async filterDocuments(
    filters: EnvFilters<FileUpload>,
  ): Promise<FileUpload[]> {
    return this.filePaymentRepository.filters(filters)
  }

  async uploadPaymentMethods(
    file: Express.Multer.File,
    folder: CulqiFolder | IzipayeFolder,
    user?: string,
  ) {
    const csvData = this.transformXlsxToCsv(file)
    const fileName = `${file.originalname.split('.')[0] ?? ''}_${getUnixTime(
      new Date(),
    )}.csv`
    const path = `${folder}/sinprocesar/${fileName}`

    const fileUpload = new FileUpload()
    fileUpload.file_name = fileName
    fileUpload.folder = folder
    fileUpload.file_type = 'csv'
    fileUpload.upload_by = user ?? ''

    await this.awsService.uploadFilePaymentMethods(csvData ?? file, path)
    await this.filePaymentRepository.insert(fileUpload)
  }

  private transformXlsxToCsv(file: Express.Multer.File): string | undefined {
    if (
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      const csvData = XLSX.utils.sheet_to_csv(worksheet, {
        blankrows: false,
        FS: ';',
      })
      if (!csvData)
        throw badRequest('Error al convertir el archivo, revise el formato')
      return csvData
    }
  }
}
