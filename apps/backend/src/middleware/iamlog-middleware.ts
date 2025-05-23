import iamLogRepository from '../repositories/iamLog.repository'
import { IamLogService } from '../services/IamLog.service'
import { Request, Response, NextFunction } from 'express'
import { Filters, IToken } from '../types'
import { TerminalPost } from '../entities/TerminalPost'

//log de mantenimiento
// update : /api/terminal-post/update-terminal-post
// create : /api/terminal-post/create-terminal-post

export const iamLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log('message: Log de mantenimiento ')
  //console.dir(res.statusMessage)
  console.dir(res.statusCode)

  const originalJson = res.json

  res.json = function (body) {
    // Hacemos el log asincrónico sin bloquear la respuesta

    const { dataTrace: _usedbody, ...restBody } = body

    setImmediate(() => {
      console.log('Log asincrónico:', {
        method: req.method,
        url: req.originalUrl,
        response: body,
      })

      console.dir(res.statusCode)

      // Aquí podrías guardar en una base de datos, enviar a un sistema externo, etc.

      //const iamLogService = new IamLogService(iamLogRepository)
      //datos creados durante login con creacion de JWT
      const userReq: IToken = req.headers.token as any

      console.log('ruta : ' + req.path)

      switch (req.path) {
        case '/api/terminal-post/update-terminal-post':
          console.log('update')
          break

        case '/api/terminal-post/create-terminal-post':
          console.log('create')
          break
      }

      console.log('user : ')
      console.dir(userReq)

      const argsIamLog = {
        user_id: userReq.id,
        user_name: userReq.name,
        user_email: userReq.mail,
        module_id: 4,
        module_name: 'Mantenimiento',
        //action: 'CREATE',
        //tbl_name: 'adm_terminalpos',
        //tbl_primary_id: 'id',
        //created_at: new Date(),
      }

      let argsIamLog2 = {
        user_id: 0,
        user_name: '',
        user_email: '',
        module_id: 0,
        module_name: '',
        action: '',
        tbl_name: '',
        tbl_primary_id: 0,
      }

      let table = ''
      //URL del enlace del menu donde esta la pantalla con el elemento (React) a interaccionar
      let module_url_submenu
      let nombre_submenu = ''
      let nombre_submenu2 = ''
      //variables obtenidas en el switch
      let s_action = ''
      let s_tbl_name = ''
      let s_tbl_primary_id = 0

      switch (req.method) {
        case 'POST':
          s_action = 'CREATE'
          //obtener partes del URL
          module_url_submenu = req.path.split('/')
          nombre_submenu = module_url_submenu[2]
          nombre_submenu2 = module_url_submenu[3]
          switch (nombre_submenu) {
            //caso de motorizados
            //case https://ridertrack.moturider.com/api/v1/getCouriersExtFullApi
            ///api/hex/parameters/public
            case 'category':
              //hay category/update-categoryType
              //y category/update-category

              switch (nombre_submenu2) {
                case 'create-category':
                  s_tbl_name = 'adm_category_expense'
                  break

                case 'create-categoryType':
                  s_tbl_name = 'adm_type_category'
                  break
              }
              break
            case 'cash-account':
              //hay /api/cash-account/update-type-cash
              // y cash-account/update-cash-account

              switch (nombre_submenu2) {
                case 'create-cash-account':
                  s_tbl_name = 'adm_cash_account'
                  break
                case 'create-typecash-account':
                  s_tbl_name = 'adm_type_cash'
                  break
              }
              break

            // case 'cash-account-type':
            //   //combinar con cash account
            //   s_tbl_name = 'adm_type_cash'
            //   break

            // case 'category-type':
            //   //combinar con category
            //   s_tbl_name = 'adm_type_category'
            //   break

            case 'cost-centers':
              s_tbl_name = 'cost_center'
              break

            case 'terminal-post':
              s_tbl_name = 'adm_terminalpos'
              break

            case 'menu-report':
              s_tbl_name = 'sys_menu_report'
              break
            case 'parameters':
              s_tbl_name = 'sys_parameters'
              break
          }
          break

        case 'PUT':
          /*
          argsIamLog2 = {
            ...argsIamLog,
            action: 'EDIT',
            tbl_name: 'adm_terminalpos',
            tbl_primary_id: body.dataTrace.id,
          }*/
          s_action = 'EDIT'
          //obtener partes del URL
          module_url_submenu = req.path.split('/')
          nombre_submenu = module_url_submenu[2]
          nombre_submenu2 = module_url_submenu[3]
          switch (nombre_submenu) {
            //caso de motorizados
            //case https://ridertrack.moturider.com/api/v1/getCouriersExtFullApi
            ///api/hex/parameters/public
            case 'category':
              //hay category/update-categoryType en router categoryType.router.ts
              //y category/update-category en router category.router.ts
              switch (nombre_submenu2) {
                // case 'create-category':
                //   s_tbl_name = 'adm_category_expense'
                //   break
                case 'update-category':
                  s_tbl_name = 'adm_category_expense'
                  break
                // case 'create-categoryType':
                //   s_tbl_name = 'adm_type_category'
                //   break
                case 'update-categoryType':
                  s_tbl_name = 'adm_type_category'
                  break
              }
              break

            case 'cash-account':
              //hay /api/cash-account/update-type-cash
              // y cash-account/update-cash-account

              switch (nombre_submenu2) {
                // case 'create-cash-account':
                //   s_tbl_name = 'adm_cash_account'
                //   break
                case 'update-cash-account':
                  s_tbl_name = 'adm_cash_account'
                  break
                // case 'create-typecash-account':
                //   s_tbl_name = 'adm_type_cash'
                //   break
                case 'update-type-cash':
                  s_tbl_name = 'adm_type_cash'
                  break
              }
              break
            // case 'cash-account-type':
            //   //combinar con cash account
            //   s_tbl_name = 'adm_type_cash'
            //   break

            // case 'category-type':
            //   //combinar con category
            //   s_tbl_name = 'adm_type_category'
            //   break

            case 'cost-centers':
              s_tbl_name = 'cost_center'
              break

            case 'terminal-post':
              s_tbl_name = 'adm_terminalpos'
              break

            case 'menu-report':
              s_tbl_name = 'sys_menu_report'
              break
            case 'parameters':
              s_tbl_name = 'sys_parameters'
              break
          }

          break
        case 'DELETE':
          argsIamLog2 = {
            ...argsIamLog,
            action: 'DELETE',
            tbl_name: 'adm_terminalpos',
            tbl_primary_id: body.dataTrace.id,
          }
          break
      }

      //el id del registro nuevo o existente
      const idReg = body.dataTrace.id
      if (typeof idReg !== 'undefined' && idReg > 0) {
        argsIamLog2 = {
          ...argsIamLog,
          action: s_action,
          tbl_name: s_tbl_name,
          tbl_primary_id: idReg,

          //casos de PAID, LOGIN (ver si es con POST) y APPROVED
        }

        const iamLogService = new IamLogService(iamLogRepository)
        console.log('body')
        console.log(idReg)
        iamLogService.createIamLog(argsIamLog2)
      }
    })

    // Llamamos a la función original para no interferir
    return originalJson.call(this, restBody)
  }

  next() // creas ID : 20
}
