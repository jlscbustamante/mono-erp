import { Attendance, RhEmployee } from 'pizzadb'
import { IUserFilter3 } from 'shared'
import { In, Raw, Repository } from 'typeorm'
import { filter3 } from '../../repositories/filter3base'

export class HumanResourcesService {
  constructor(
    private readonly employeeRepository: Repository<RhEmployee>,
    private readonly assistanceRepository: Repository<Attendance>,
  ) {}

  async filterEmployees(filters: IUserFilter3<RhEmployee>) {
    const data = await filter3(this.employeeRepository, filters)
    return data
  }

  async createEmployee(employee: RhEmployee) {
    // subir image
    try {
      await this.employeeRepository.insert({ ...employee })
    } catch (err: any) {
      if (err.code == 'ER_DUP_ENTRY')
        throw new Error('Ya existe un empleado con el mismo documento')
      else throw err
    }
  }

  async filterAssistance(store: string, dates: string[]) {
    const usersInStores = await this.employeeRepository.find({
      select: {
        id: true,
      },
      where: {
        sucursal_id: store,
      },
    })
    const assistance = await this.assistanceRepository.find({
      select: {
        employee: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
      where: {
        employee_id: In(usersInStores.map((el) => el.id)),
        attendance_at: Raw(
          (alias) => `DATE(${alias}) BETWEEN '${dates[0]}' AND '${dates[1]}'`,
        ),
      },
      order: {
        attendance_at: 'ASC',
      },
      relations: {
        employee: true,
      },
    })
    return assistance
  }
}
