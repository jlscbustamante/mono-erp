/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { badImplementation, badRequest } from '@hapi/boom'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { DataSource } from 'typeorm'

import app from '../app'
import config from '../config/config'
import { AppDataSource } from '../config/database'
import { safeAny } from '../utils/someAny'
import { IamUserRoles } from './IamUserRoles.service'

const iamUserRolesService = new IamUserRoles()

export class IamUserPermission {
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
      email: string
      status: number
      rol_id: number
    }
    permissionData: any
  }> {
    const findedUser = await this.dataSource.query(
      `SELECT user.id id,user.name name,user.email email, user.status status,user.password password,rol.id rol_id FROM \`iam_user\` user INNER JOIN \`iam_role\` rol ON user.rol_id = rol.id WHERE user.status = 1 AND user.email='${user}'`,
    )
    const url_depends = app.get('url_depend')
    if (findedUser.length == 0) throw badRequest('El usuario no existe')

    if (!findedUser[0].password && findedUser) {
      const dataUser = findedUser[0]
      const token = this.createToken(dataUser, { expiresIn: '5m' })
      const permissionData: any = ''
      const transporter = nodemailer.createTransport({
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        secure: false,
        auth: {
          user: 'AKIA344YV56M4JZINSVV',
          pass: 'BPkdjUTaxakXLb/IJrUZPlOfTJV3hPj7oy+bpcMYJcGe',
        },
      })
      const mailTemplate = `
        <div style="text-align: center; background-color: #f2f2f2; padding: 10px; max-width: 600px; margin: 20px auto; margin-bottom: 20px;">
        <div style="max-width: 80px; margin: 20px 0; float: left;">
          <img src='https://erpraul.work/_imgs/pizza-logo.png' alt="Imagen" style="width: 100%; height: auto; margin-left: 140px;">
        </div>
        <div style="clear: both;"></div>
        <div style="padding: 10px; max-width: 300px; margin: auto; background-color: white; color: #808080; text-align: left;">
          <p>Hola ${dataUser?.name}.</p>
          <p>Seguramente es tu primer inicio de sesión, por lo que será necesario que cambies tu contraseña.</p>
          <p>Este proceso es necesario por razones de seguridad.</p>
          <p>Para iniciar sesión y personalizar tu contraseña por primera vez, haz clic en el siguiente enlace:</p>
          <a href="${url_depends}/auth/updatePassword?token=${token}">Iniciar Sesión</a>
          <p>Tienes 10 minutos para hacerlo antes de que el enlace expire.</p>
        </div>
        <div style="padding: 10px; max-width: 300px; max-height: 50px; margin: auto; background-color: #e30613; color: #f2f2f2; font-size: 1em; margin-bottom: 10px;">
          <p style="margin: 0;">¡Gracias!</p>
          <p style="margin: 0;">Equipo de soporte Pizza Raúl.</p>
        </div>
      </div>
        `
      const mailOptions = {
        from: 'soporte@pizzaraul.com',
        to: user,
        subject: '[Pizza Raul] Reseteo de contraseña',
        html: mailTemplate,
      }
      transporter.sendMail(mailOptions, function (error) {
        if (error) {
          console.log(error)
        } else {
          const data = {
            statusCode: 200,
            userEmail: user,
            message: 'Code enviado',
            token: token,
          }

          return data
        }
      })
      return { token, user: dataUser, permissionData }
    }
    if (
      !(await this.compareTextHash(password, findedUser[0].password as string))
    )
      throw badRequest('Contraseña incorrecta')
    const dataUser = findedUser[0]
    delete dataUser.password
    const token = this.createToken(dataUser)

    const permissionData: any = await iamUserRolesService.permission(
      String(findedUser[0].rol_id),
    )

    return { token, user: dataUser, permissionData }
  }

  private async compareTextHash(text: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(text, hash)

    return result
  }

  private createToken(payload: safeAny, options?: jwt.SignOptions): string {
    const token = jwt.sign(payload as object, config.JWTKey, options)
    if (!token) {
      throw badImplementation(
        'Ocurrió un error al crear el token, payload: ',
        payload,
      )
    }

    return token
  }
}
