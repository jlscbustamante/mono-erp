import { Attendance, JobTitle, RhEmployee } from 'pizzadb'
import { IUserFilter3 } from 'shared'
import { IsNull, Raw, Repository } from 'typeorm'
import { filter3 } from '../../repositories/filter3base'

export class HumanResourcesService {
  constructor(
    private readonly employeeRepository: Repository<RhEmployee>,
    private readonly assistanceRepository: Repository<Attendance>,
    private readonly jobtitleRepository: Repository<JobTitle>,
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
}
