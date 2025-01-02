import axios from 'axios'
import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import { IamUser } from 'pizzadb'
import config from '../config/config'
import IamUserRepository from '../repositories/iamUser.repository'
import { IamUserService } from '../services/IamUser.service'
import { IamUserPermission } from '../services/IamUserPermission.service'
import { EnvFilters } from '../types'
import { catchError } from '../utils/decorators'
const iamUserService = new IamUserService(IamUserRepository)
const iamUserPermissionService = new IamUserPermission()

export class IamUserController {
  async getIamUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listIamUser = await IamUserRepository.find()
      res.status(200).json(listIamUser)
    } catch (err) {
      next(err)
    }
  }

  async getIamUserOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingIamUser = await IamUserRepository.findOne({
        where: {
          id: Number(req.query.iamUserId),
        },
      })
      res.status(200).json(existingIamUser)
    } catch (err) {
      next(err)
    }
  }

  async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingIamUser = await IamUserRepository.findOne({
        where: {
          id: Number(req.query.iamUserId),
        },
      })
      if (existingIamUser)
        await iamUserService.updateIamUserPassword(
          existingIamUser,
          String(req.query.password),
        )
      res.status(200).json(existingIamUser)
    } catch (err) {
      next(err)
    }
  }

  async firstLogin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const decodedToken = jwt.verify(
        String(req.query.token),
        config.JWTKey,
      ) as JwtPayload
      const email = decodedToken.email
      const existingIamUser = await IamUserRepository.findOne({
        where: {
          email: String(email),
        },
      })
      if (existingIamUser)
        await iamUserService.updateIamUserPassword(
          existingIamUser,
          String(req.query.password),
        )
      res.status(200).json(existingIamUser?.email)
    } catch (err) {
      next(err)
    }
  }

  async updateConfirmPassword(req: Request, res: Response): Promise<void> {
    const existingIamUser = await IamUserRepository.findOne({
      where: {
        email: String(req.query.email),
      },
    })
    if (existingIamUser) {
      try {
        await iamUserService.updateConfirmPassword(
          existingIamUser,
          String(req.query.password),
          String(req.query.newPassword),
        )
        const data = {
          message: 'Contraseña cambiada correctamente.',
          success: true,
          status: 200,
        }
        res.json(data)
        console.log('Cambiada')
      } catch (error) {
        const data = {
          message: 'Contraseña incorrecta.',
          success: false,
          status: 500,
        }
        res.json(data)
        console.log('Error')
      }
    } else {
      const data = {
        message: 'El usuario no existe',
        success: false,
        user: existingIamUser,
      }
      res.json(data)
    }
  }

  async updateIamUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        email: string
        password: string
        rol_id: number
        status: number
      }
      const existingIamUser = await IamUserRepository.findOne({
        where: {
          id: Number(req.query.iamUserId),
        },
      })
      if (!existingIamUser) {
        res.status(404).json({
          message: `IamUser con ID ${req.params.IamUserId} no encontrada`,
        })

        return
      }

      await iamUserService.updateIamUser(existingIamUser, args)
      res
        .status(200)
        .json({ message: 'IamUser se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async createIamUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        email: string
        password: string
        rol_id: number
        email_token: string
        email_validate: string
        status: number
      }
      await iamUserService.createIamUser(args)
      res.status(200).json({ message: 'Usuario se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getFilteredIamUserNt(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<IamUser>
      const requests = await iamUserService.getFilteredIamUserNt(queries)

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }

  async login(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body

      const token = await iamUserPermissionService.login(
        email as string,
        password as string,
      )

      response.status(200).json(token)
    } catch (err: any) {
      next(err)
    }
  }

  @catchError
  async signApp(req: Request, res: Response) {
    const body = req.body
    const textHash = await bcrypt.hash(body.password, 10)
    await IamUserRepository.insert({
      ...body,
      status: 1,
      password: textHash,
      rol_id: 10,
    })
    res.json({
      success: true,
      message: 'Usuario creado correctamente',
    })
  }
  ///////////////////////////
  async validateEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingIamUser = await IamUserRepository.findOne({
        where: {
          email: String(req.query.email),
        },
      })
      if (existingIamUser) {
        if (existingIamUser.status === 1) {
          res
            .status(200)
            .json({ statusCode: 200, message: 'El correo es válido.' })
        } else if (existingIamUser.status === 0) {
          res
            .status(404)
            .json({ statusCode: 404, message: 'Usuario inactivo.' })
        }
      } else {
        res
          .status(404)
          .json({ statusCode: 404, message: 'Correo no encontrado.' })
      }
    } catch (error: any) {
      next(error)
      res
        .status(500)
        .json({ statusCode: 500, message: 'Internal Server Error' })
    }
  }
  ////////////////////
  async resetPassword(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const nameIamUser = await IamUserRepository.findOne({
      where: {
        email: String(req.query.email),
      },
    })
    if (nameIamUser) {
      try {
        const consulta = `http://ec2-34-239-124-25.compute-1.amazonaws.com/api/OTPUX/${req.query.email}`
        const { data: respuesta } = await axios.get(consulta)

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
        <p>Hola ${nameIamUser?.name}.</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
        <p>En caso no hayas solicitado el reseteo, comunícate con el área de soporte.</p>
        <p>Tu código de verificación es: <strong style="font-size: 18px; color: black;">${respuesta.result.otp}</strong>.</p>
        <p>Tienes 5 minutos para poder utilizarlo, ¡suerte!</p>
        </div>
        <div style="padding: 10px; max-width: 300px; max-height: 50px; margin: auto; background-color: #e30613; color: #f2f2f2; font-size: 1em; margin-bottom: 10px;">
        <p style="margin: 0;">¡Gracias!</p>
        <p style="margin: 0;">Equipo de soporte Pizza Raúl.</p>
        </div>
        </div>
      `
        const mailOptions = {
          from: 'soporte@pizzaraul.com',
          to: req.query.email as string,
          subject: '[Pizza Raul] Reseteo de contraseña',
          html: mailTemplate,
        }

        transporter.sendMail(mailOptions, function (error) {
          if (error) {
            response.json(error)
          } else {
            const data = {
              statusCode: 200,
              userEmail: req.query.email,
              message: 'Code enviado',
              token: respuesta.result.token,
            }

            response.status(200).json({ data })
          }
        })
      } catch (err: any) {
        response.json(err)
        next(err)
      }
    } else {
      response.json('No se ha encontrado un usuario con este email')
    }
  }

  ///////////////
  @catchError
  async validateInfo(req: Request, response: Response): Promise<void> {
    const validate = `http://ec2-34-239-124-25.compute-1.amazonaws.com/api/OTPUX/${req.query.email}/${req.query.code}/${req.query.token}`
    const { data: respuesta } = await axios.get(validate)
    const data = {
      statusCode: 0,
      userEmail: req.query.email,
      message: '',
      succes: respuesta?.result?.validate || false,
    }
    const existingIamUser = await IamUserRepository.findOne({
      where: {
        email: String(req.query.email),
      },
    })

    if (existingIamUser && respuesta.result.validate) {
      await iamUserService.changePassword(
        existingIamUser,
        String(req.query.password),
      )
      data.message = 'Contraseña cambiada'
      data.statusCode = 200
      const nameIamUser = await IamUserRepository.findOne({
        where: {
          email: String(req.query.email),
        },
      })
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
          <p>Hola ${nameIamUser?.name}.</p>
          <p>Te informamos que tu contraseña se ha cambiado satisfactoriamente y ahora puedes acceder a tu cuenta con la nueva contraseña.</p>
          <p>Recuerda mantener tu contraseña en un lugar seguro y evitar compartirla con otras personas. Si no has realizado este cambio o tienes alguna pregunta, por favor, contacta a nuestro equipo de soporte para obtener asistencia adicional.</p>
          </div>
          <div style="padding: 10px; max-width: 300px; max-height: 50px; margin: auto; background-color: #e30613; color: #f2f2f2; font-size: 1em; margin-bottom: 10px;">
          <p style="margin: 0;">¡Gracias!</p>
          <p style="margin: 0;">Equipo de soporte Pizza Raúl.</p>
          </div>
          </div>
          `
      const mailOptions = {
        from: 'soporte@pizzaraul.com',
        to: req.query.email as string,
        subject: '[Pizza Raul] ¡Cambio éxitoso!',
        html: mailTemplate,
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          response.json(error)
        } else {
          response.status(200).json({ data })
          response.json('Correo enviado: ' + info.response)
        }
      })
    } else {
      data.message = respuesta.error.message
      data.statusCode = respuesta.error.statusCode
      response.json(data)
    }
  }
  async resetPasswordForm(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.query.iamUserId
      const existingIamUser = await IamUserRepository.findOne({
        where: {
          id: Number(id),
        },
      })
      if (existingIamUser) {
        const password = await bcrypt.hash(req.query.password as string, 10)
        existingIamUser.password = password
        IamUserRepository.save(existingIamUser)
      }

      response.status(200).json(existingIamUser)
    } catch (err) {
      next(err)
    }
  }
}
