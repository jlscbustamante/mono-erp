import archiver from 'archiver'
import axios from 'axios'
import type { Response } from 'express'
import stream from 'stream'

interface Doc {
  doc_url: string
  doc_operacion: string
  warehouseId: string
}

export class FileService {
  async downloadAndZiped(docs: Doc[], res: Response) {
    const zipStream = new stream.PassThrough()
    const archive = archiver('zip')

    archive.on('error', (err) => {
      res.status(500).send({
        message: err.message,
        error: err.message,
      })
    })

    res.attachment('documentos.zip')
    archive.pipe(zipStream)

    zipStream.pipe(res)

    for (const doc of docs) {
      try {
        const response = await axios.get(doc.doc_url, {
          responseType: 'arraybuffer',
        })
        const fileName = doc.warehouseId + '_' + doc.doc_operacion + '.pdf'
        archive.append(response.data, { name: fileName })
      } catch (err) {
        console.log('Error al descargar el archivo', err)
      }
    }
    archive.finalize()
  }
}
