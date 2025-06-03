import { AppParameters } from 'shared'
import { AppDataSource } from './config/database'

interface IParameter {
  id: number
  type: string
  name: string
  value: string
  role: string
  status: number
  created_at: string
  updated_at: string
}

export class Parameters {
  private static instance: Parameters | null = null
  private readonly parameters: AppParameters = {}

  public static getInstance(): Parameters {
    if (this.instance === null) {
      this.instance = new Parameters()
    }
    return this.instance
  }

  async loadParameters() {
    const data: IParameter[] = await AppDataSource.query(
      'SELECT * FROM sys_parameters',
    )
    for (const parameter of data) {
      if (!this.parameters[parameter.type]) {
        this.parameters[parameter.type] = {}
      }
      this.parameters[parameter.type][parameter.name] = parameter.value as any
    }
  }

  getAll() {
    return this.parameters
  }

  get(key: string, name: string) {
    return this.parameters[key][name] as string
  }

  getInt(key: string, name: string) {
    const value = parseInt(this.parameters[key][name] as string)
    if (isNaN(value)) {
      return 0
    }
    return value
  }

  getJson(key: string, name: string) {
    return JSON.parse(this.parameters[key][name] as string)
  }

  getArray(key: string, name: string) {
    const values = this.parameters[key][name] as string
    return values.split(',').filter((value) => !!value)
  }
}
