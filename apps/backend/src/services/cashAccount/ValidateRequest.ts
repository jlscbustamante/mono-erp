import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { In } from 'typeorm'

import { Account } from '../../entities/Account'
import { Parameter } from '../../entities/Parameter'
import { RequestEntity } from '../../entities/Request'
import { AccountRepository } from '../../repositories/account.repository'
import { ParameterRepository } from '../../repositories/parameter.repository'
import { RequestRepository } from '../../repositories/request.repository'
import { CategoryTypeId } from '../../types/category'
import { OpFilter } from '../../types/filter'
import {
  RequestAccountFlow,
  RequestCategoryType,
  RequestStatus,
} from '../../types/request'

interface IGeneralValidation {
  hasApproved: () => IGeneralValidation
  hasClosed: () => IGeneralValidation
  hasRegistered: () => IGeneralValidation
  hasDocUrl: () => IGeneralValidation
  hasAEAccounts: () => IGeneralValidation
  hasCategories: () => IGeneralValidation
  hasCashAccounts: () => IGeneralValidation
  validateCategoryMultiple: () => IGeneralValidation
  validateTypesFlowInAccountFlow: () => IGeneralValidation
  validateTypesInCategoryMove: () => IGeneralValidation
  cutStatus(status: RequestStatus[]): IGeneralValidation
  setCategoryMultiple(): Promise<IGeneralValidation>
  getLogs(): string[]
  getValidatedRequests(): RequestEntity[]
}

export class RequestUtils implements IGeneralValidation {
  private readonly logs: string[] = []
  private requeriments: RequestEntity[]
  private dates: string[]
  private _dates: [string, string]

  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly parameterRepository: ParameterRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async validate(_dates: [string, string]): Promise<IGeneralValidation> {
    this.dates = eachDayOfInterval({
      start: parseISO(_dates[0]),
      end: parseISO(_dates[1]),
    }).map((el) => format(el, 'yyyy-MM-dd'))
    this._dates = _dates

    const { data: _requeriments } = await this.requestRepository.filter3({
      relations: {
        cashAccountAE: true,
        cashAccountCategoryAE: true,
        categoryAccountAE: true,
        cashAccount: true,
        cashAccountCategory: true,
        category: {
          categoryType: true,
        },
      },
      filters: {
        approved_at: [OpFilter.RangeDate, _dates[0], _dates[1]],
        status: [
          OpFilter.In,
          RequestStatus.Approved,
          RequestStatus.Registered,
          RequestStatus.Closed,
        ],
      },
    })
    this.requeriments = _requeriments

    return this
  }

  getLogs(): string[] {
    return this.logs
  }

  getValidatedRequests(): RequestEntity[] {
    return this.requeriments
  }

  hasClosed(): IGeneralValidation {
    if (this.requeriments.some((el) => el.status === RequestStatus.Closed)) {
      this.logs.push(
        `Existen requerimientos cerrados entre estas fechas : ${this._dates.join(
          ', ',
        )}`,
      )
    }

    return this
  }

  cutStatus(status: RequestStatus[]): IGeneralValidation {
    this.requeriments = this.requeriments.filter((el) =>
      status.includes(el.status),
    )

    return this
  }

  async setCategoryMultiple(): Promise<IGeneralValidation> {
    const logs: string[] = []
    const requerimentsMultiple = this.requeriments.filter((el) => {
      return (
        el.category?.categoryType?.type_id === CategoryTypeId.Multiple &&
        el.category_move === RequestCategoryType.Category
      )
    })
    const categoryAccountIds = requerimentsMultiple.map(
      (el) => el.category_account_id,
    )
    const valueParameters = [...new Set(categoryAccountIds)]
    const parameterMap: Map<string, Parameter> = new Map()
    const parameters =
      await this.parameterRepository.getMultipleAccount(valueParameters)
    parameters.forEach((el) => {
      parameterMap.set(el.id.toString(), el)
    })
    const accountIds: number[] = []
    for (const req of requerimentsMultiple) {
      const parameter = parameterMap.get(req.category_account_id.toString())
      if (!parameter) {
        logs.push(
          `No existe parametro con value: ${req.category_account_id}, id del requerimiento : ${req.id}`,
        )
        continue
      }
      let accountId = undefined
      switch (parameter.name) {
        case 'CAJA':
          accountId = req.costCenter?.account_caja
          break
        case 'AJUSTE':
          accountId = req.costCenter?.account_ajuste
          break
        case 'MERCADERIA':
          accountId = req.costCenter?.account_merca
          break
      }
      if (!accountId) {
        logs.push(
          `No existe cuenta en cost_center para la categoria multiple : ${req.category_account_id}, id del requerimiento : ${req.id}`,
        )
        continue
      }
      accountIds.push(accountId)
      req.category_account_id = accountId
    }

    const accounts = await this.accountRepository.find({
      where: { id: In(accountIds) },
    })
    const accountsMap: Map<string, Account> = new Map()
    accounts.forEach((account) => {
      accountsMap.set(account.id.toString(), account)
    })
    for (const req of requerimentsMultiple) {
      const account = accountsMap.get(req.category_account_id.toString())
      if (!account) {
        logs.push(
          `No existe cuenta en account para la categoria multiple : id de la cuenta(encontrada en parametros) : ${req.category_account_id}, id del requerimiento : ${req.id}`,
        )
        continue
      }

      req.categoryAccountAE = account
    }

    return this
  }

  hasRegistered(): IGeneralValidation {
    if (
      this.requeriments.some((el) => el.status === RequestStatus.Registered)
    ) {
      this.logs.push(
        `Existen requerimientos contabilizados entre estas fechas : ${this._dates.join(
          ', ',
        )}`,
      )
    }

    return this
  }

  hasApproved(): IGeneralValidation {
    if (this.requeriments.some((el) => el.status === RequestStatus.Approved)) {
      this.logs.push(
        `Existen requerimientos aprobados entre estas fechas : ${this._dates.join(
          ', ',
        )}`,
      )
    }

    return this
  }

  validateTypesInCategoryMove(): IGeneralValidation {
    const failed = this.requeriments.filter(
      (el) =>
        el.category_move != RequestCategoryType.Category &&
        el.category_move != RequestCategoryType.Cash,
    )
    if (failed.length > 0) {
      this.logs.push(
        `Existen requerimientos con categorias invalidas(${Object.values(
          RequestCategoryType,
        ).join(', ')}): ${this._dates.join(', ')}, ids: ${failed
          .map((el) => el.id)
          .join(', ')}`,
      )
    }

    return this
  }

  validateTypesFlowInAccountFlow(): IGeneralValidation {
    const failed = this.requeriments.filter(
      (el) =>
        el.account_flow != RequestAccountFlow.In &&
        el.account_flow != RequestAccountFlow.Out,
    )

    if (failed.length > 0) {
      this.logs.push(
        `Existen requerimientos con account_flow invalidos(${Object.values(
          RequestAccountFlow,
        ).join(', ')}): ${this._dates.join(', ')}, ids: ${failed
          .map((el) => el.id)
          .join(', ')}`,
      )
    }

    return this
  }

  hasCashAccounts(): IGeneralValidation {
    const failed = this.requeriments.filter(
      (el) =>
        el.cashAccount == null ||
        (el.cashAccountCategory == null &&
          el.category_move == RequestCategoryType.Cash),
    )
    if (failed.length > 0) {
      this.logs.push(
        `Existen requerimientos sin caja asignada entre estas fechas : ${this._dates.join(
          ', ',
        )}, ids: ${failed.map((el) => el.id).join(', ')}`,
      )
    }

    return this
  }

  hasDocUrl(): IGeneralValidation {
    const failed = this.requeriments.filter(
      (el) => el.doc_url == null || el.doc_url == '',
    )
    if (failed.length > 0) {
      this.logs.push(
        `Existen requerimientos sin documento asignado entre estas fechas : ${this._dates.join(
          ', ',
        )}, ids: ${failed.map((el) => el.id).join(', ')}`,
      )
    }

    return this
  }

  hasCategories(): IGeneralValidation {
    const failed = this.requeriments.filter(
      (el) =>
        el.category == null && el.category_move == RequestCategoryType.Category,
    )
    if (failed.length > 0) {
      this.logs.push(
        `Existen requerimientos sin categoria asignada entre estas fechas : ${this._dates.join(
          ', ',
        )}, ids: ${failed.map((el) => el.id).join(', ')}`,
      )
    }

    return this
  }

  hasAEAccounts(): IGeneralValidation {
    const failed = this.requeriments.filter(
      (el) => el.cashAccountAE == null || el.categoryAccountAE == null,
    )
    if (failed.length > 0) {
      this.logs.push(
        `Existen requerimientos sin cuenta caja o cuenta categoria para asientos contables(account) asignada entre estas fechas : ${this._dates.join(
          ', ',
        )}, ids: ${failed.map((el) => el.id).join(', ')}`,
      )
    }

    return this
  }

  validateCategoryMultiple(): IGeneralValidation {
    const failed = this.requeriments.filter(
      (el) =>
        el.category_move == RequestCategoryType.Category &&
        el.category?.categoryType.type_id == CategoryTypeId.Multiple &&
        el.costCenter?.is_cash != 1,
    )
    if (failed.length > 0) {
      this.logs.push(
        `Existen requerimientos con categoria multiple pero centro de costo invalido en estas fechas : ${this._dates.join(
          ', ',
        )}, ids: ${failed.map((el) => el.id).join(', ')}`,
      )
    }

    return this
  }
}
