import { type Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { RhEmployee } from 'pizzadb'
import { IUserFilter3 } from 'shared'
import { parseFilters } from '../../middleware/parse-filter.middleware'
import { Get, Post, Put } from '../../utils/decorators/endpoint.middleware'
import { HumanResourcesService } from './human-resources.service'

const upload = multer({
  fileFilter: (req: any, file: any, cb: FileFilterCallback) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (file.mimetype.includes('image')) {
      cb(null, true)
    } else {
      // cb(null, false)
      cb(new Error('El archivo no es de tipo img'))
    }
  },
})

export class HumanResourcesController {
  constructor(private readonly rhService: HumanResourcesService) {}

  @Get('/rh/employees/filter', parseFilters)
  async filterEmployees(req: Request) {
    const filters = req.body as IUserFilter3<RhEmployee>
    const data = await this.rhService.filterEmployees(filters)

    return data
  }

  @Post('/rh/employees', upload.single('image'))
  async createEmployee(req: Request) {
    const data = req.body as RhEmployee

    await this.rhService.createEmployee(data)
  }

  @Put('/rh/employees', upload.single('image'))
  async updateEmployee(req: Request) {
    const data = req.body as RhEmployee

    await this.rhService.updateEmployee(data)
  }

  @Get('/rh/assistances/filter')
  async filterAssistance(req: Request) {
    const { store, dates, userId } = req.query as {
      store: string
      dates: string[]
      userId?: string
    }
    const userIdParsed = userId ? parseInt(userId) : undefined

    const data = await this.rhService.filterAssistance(
      store,
      dates,
      userIdParsed,
    )
    return data
  }

  @Get('/rh/sucursal/employees')
  async getEmployeesBySucursal(req: Request) {
    const { store } = req.query as { store: string | undefined }
    return this.rhService.getEmployeesBySucursal(store ?? '')
  }
}
