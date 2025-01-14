import { type Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { Attendance, Fillime, JobTitle, RhEmployee } from 'pizzadb'
import { IUserFilter3 } from 'shared'
import { parseFilters } from '../../middleware/parse-filter.middleware'
import { Get, Post, Put } from '../../utils/decorators/endpoint.middleware'
import { HumanResourcesService } from './human-resources.service'
import { SaveMotorizer } from './types/save-motorizer.interface'

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

  @Get('/rh/employees/fillime', parseFilters)
  async filterEmployeesFillime(req: Request) {
    const filters = req.body as Fillime<RhEmployee>
    const data = await this.rhService.fillimeEmployees(filters)
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

  @Get('/rh/assistances/fillime', parseFilters)
  async filterAssistanceFillime(req: Request) {
    const filter = req.body as Fillime<Attendance>

    return this.rhService.filterAssistanceFillime(filter)
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

  @Get('/rh/assistances/pos/filter')
  async filterAssistancePos(req: Request) {
    const { store, dates, doc, event } = req.query as {
      store: string
      dates: string[]
      doc?: string
      event?: string
    }

    const data = await this.rhService.filterAssistancePos(
      store,
      dates,
      doc,
      event,
    )

    return data
  }

  @Get('/rh/sucursal/employees')
  async getEmployeesBySucursal(req: Request) {
    const { store } = req.query as { store: string | undefined }
    return this.rhService.getEmployeesBySucursal(store ?? '')
  }

  @Get('/rh/jobs-title')
  async getJobsTitle() {
    return this.rhService.getJobsTitle()
  }

  @Post('/rh/jobs-title')
  async createJobTitle(req: Request) {
    const jobTitle = req.body as JobTitle

    return this.rhService.createJobTitle(jobTitle)
  }

  @Put('/rh/jobs-title')
  async updateJobTitle(req: Request) {
    const jobTitle = req.body as JobTitle

    return this.rhService.updateJobTitle(jobTitle)
  }

  @Post('/rh/motorizer')
  async saveMotorizer(req: Request) {
    const body = req.body as SaveMotorizer
    await this.rhService.saveMotorizer(body)
  }
}
