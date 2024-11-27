/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { badImplementation, badRequest } from '@hapi/boom'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { DataSource } from 'typeorm'

import config from '../config/config'
import { AppDataSource } from '../config/database'
import { safeAny } from '../utils/someAny'

// NOTE: las tablas usadas seran cambiadas en un futuro
export class AuthService {
  dataSource: DataSource
  constructor() {
    this.dataSource = AppDataSource
  }

  async login(
    user: string,
    password: string,
  ): Promise<{
    token: string
    user: {
      id: number
      name: string
      mail: string
      granted: number
      status: 'A'
    }
  }> {
    const findedUser = await this.dataSource.query(
      `SELECT user.id id,user.nickname name,user.mail email,user.password password,user.status status,rol.granted granted FROM \`erp2.users\` user INNER JOIN \`erp2.roles\` rol ON user.roles_id = rol.id WHERE user.status = 'A' AND user.mail='${user}'`,
    )

    if (findedUser.length == 0) throw badRequest('El usuario no existe')
    if (
      !(await this.compareTextHash(password, findedUser[0].password as string))
    )
      throw badRequest('Contraseña incorrecta')
    const dataUser = findedUser[0]
    delete dataUser.password
    const token = this.createToken(dataUser)

    return { token, user: dataUser }
  }

  private async compareTextHash(text: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(text, hash)

    return result
  }

  private async textToHash(text: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const result = await bcrypt.hash(text, 10)

    return result
  }

  private createToken(payload: safeAny): string {
    const token = jwt.sign(payload as object, config.JWTKey)
    if (!token)
      throw badImplementation(
        'Ocurrio un error al crear el token, payload: ',
        payload,
      )

    return token
  }
}
