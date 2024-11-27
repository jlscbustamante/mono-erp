export interface IIamUser {
  id: number
  name: string
  email: string
  password: string
  rol_id: number
  email_token: string
  email_validate: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface IFilterIamUser {
  id?: number
  name?: string
  email?: string
  password?: string
  rol_id?: number
  email_token?: string
  email_validate?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface ICreateIamUser extends IIamUser {
  id: any
}
