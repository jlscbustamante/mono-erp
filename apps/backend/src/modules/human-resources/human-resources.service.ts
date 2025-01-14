import { format } from 'date-fns'
import {
  Attendance,
  ATTENDANCE_EVENT,
  JobTitle,
  RhEmployee,
  Sucursal,
} from 'pizzadb'
import { IUserFilter3 } from 'shared'
import { IsNull, Raw, Repository } from 'typeorm'
import { Parameters } from '../../parameters'
import { filter3 } from '../../repositories/filter3base'
import { separateNames } from '../../utils/separate-names'
import { SaveMotorizer } from './types/save-motorizer.interface'

export class HumanResourcesService {
  constructor(
    private readonly employeeRepository: Repository<RhEmployee>,
    private readonly assistanceRepository: Repository<Attendance>,
    private readonly jobtitleRepository: Repository<JobTitle>,
    private readonly sucursalRepository: Repository<Sucursal>,
    private readonly parameters: Parameters,
  ) {}

  async filterEmployees(filters: IUserFilter3<RhEmployee>) {
    const data = await filter3(this.employeeRepository, filters)
    return data
  }

  async createEmployee(employee: RhEmployee) {
    // subir image
    try {
      console.log('empleado : ', employee)
      await this.employeeRepository.insert({ ...employee })
    } catch (err: any) {
      console.log(err)
      if (err.code == 'ER_DUP_ENTRY')
        throw new Error('Ya existe un empleado con el mismo documento')
      else throw err
    }
  }
  async updateEmployee(employee: RhEmployee) {
    await this.employeeRepository.update(
      { id: employee.id },
      { ...employee, sucursal_id: employee.sucursal_id ?? null },
    )
  }

  async filterAssistance(store: string, dates: string[], userId?: number) {
    const assistance = await this.assistanceRepository.find({
      select: {
        employee: {
          id: true,
          first_name: true,
          last_name: true,
        },
        sucursal: {
          id: true,
          title: true,
        },
      },
      where: {
        employee_id: userId,
        attendance_at: Raw(
          (alias) => `DATE(${alias}) BETWEEN '${dates[0]}' AND '${dates[1]}'`,
        ),
        sucursal_id: store,
      },
      order: {
        attendance_at: 'ASC',
      },
      relations: {
        employee: true,
        sucursal: true,
      },
    })
    return assistance
  }

  async filterAssistancePos(
    store: string,
    dates: string[],
    doc?: string,
    event?: string,
  ) {
    const assistance = await this.assistanceRepository.find({
      select: {
        employee: {
          id: true,
          first_name: true,
          last_name: true,
        },
        sucursal: {
          id: true,
          title: true,
        },
      },
      where: {
        attendance_at: Raw(
          (alias) => `DATE(${alias}) BETWEEN '${dates[0]}' AND '${dates[1]}'`,
        ),
        sucursal_id: store,
        event: event as ATTENDANCE_EVENT,
        employee: {
          doc_number: doc,
        },
      },
      order: {
        attendance_at: 'ASC',
      },
      relations: {
        employee: true,
        sucursal: true,
      },
    })
    return assistance.map((el) => {
      return {
        ...el,
        attendance_at: format(new Date(el.attendance_at), 'yyyy-MM-dd HH:mm'),
      }
    })
  }

  async getEmployeesBySucursal(store: string) {
    const employees = await this.employeeRepository.find({
      where: {
        sucursal_id: store == '' ? IsNull() : store,
      },
    })
    return employees
  }

  async getJobsTitle() {
    return this.jobtitleRepository.find({
      order: {
        name: 'ASC',
      },
    })
  }

  async createJobTitle(jobTitle: JobTitle) {
    await this.jobtitleRepository.insert({ ...jobTitle })
  }

  async updateJobTitle(jobTitle: JobTitle) {
    await this.jobtitleRepository.update({ id: jobTitle.id }, { ...jobTitle })
  }

  async saveMotorizer(motorizer: SaveMotorizer) {
    const doc = motorizer.original_doc ?? motorizer.doc_number
    if (!doc) throw new Error('No se puede actualizar sin documento')
    const user = await this.employeeRepository.findOne({
      where: {
        doc_number: doc,
      },
    })

    const motorizaedJob = await this.jobtitleRepository.findOne({
      where: {
        id: this.parameters.getInt('JOBS_ID', 'DELIVERY'),
      },
    })

    if (!user) {
      const newEmployee = new RhEmployee()
      const { firstName, lastName } = separateNames(motorizer.name)
      newEmployee.first_name = firstName
      newEmployee.last_name = lastName
      newEmployee.email = motorizer.email
      newEmployee.doc_number = motorizer.doc_number ?? doc
      newEmployee.status = motorizer.status
      newEmployee.phone = motorizer.phone
      if (motorizaedJob) {
        newEmployee.jobtitle_id = motorizaedJob.id
        newEmployee.jobtitle_name = motorizaedJob.name
      }
      await this.createEmployee(newEmployee)
    } else {
      const { firstName, lastName } = separateNames(motorizer.name)
      user.first_name = firstName
      user.last_name = lastName
      user.email = motorizer.email
      user.doc_number = motorizer.doc_number ?? doc
      user.status = motorizer.status
      user.phone = motorizer.phone
      if (motorizaedJob) {
        user.jobtitle_id = motorizaedJob.id
        user.jobtitle_name = motorizaedJob.name
      }

      await this.employeeRepository.update({ id: user.id }, user)
    }
  }
}
