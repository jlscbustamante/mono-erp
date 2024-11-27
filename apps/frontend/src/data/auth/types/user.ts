export interface IUserAuth {
  permissionData(): string
  token: string
  user: {
    id: number
    name: string
    email: string
    status: 'A'
    granted: number
  }
}
