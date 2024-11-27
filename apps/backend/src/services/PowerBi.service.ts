// NOTE: SERVICIO DE AWS USADO DEL EJM DE GITHUB: NO SE TIPO NI NADA
// SI QUIEREN TIPARLO NORMAL XQ YO NO :nice

/* eslint-disable no-prototype-builtins */
/* eslint-disable prefer-const */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import msal from '@azure/msal-node'
import { badRequest } from '@hapi/boom'
import axios from 'axios'
import { In, IsNull, Not, Repository } from 'typeorm'

import config from '../config/config'
import { MenuReport } from '../entities/MenuReport'
import { safeAny } from '../utils/someAny'

export class PowerBIService {
  constructor(private readonly reportRepository: Repository<MenuReport>) {}
  async getReports(device: 'mobile' | 'web' | undefined) {
    let num: safeAny
    if (!device) num = [1, 2, 3]
    else if (device == 'web') num = [1, 2]
    else if (device == 'mobile') num = [1, 3]

    return this.reportRepository.find({
      select: ['id', 'rpt_name', 'show_in', 'status'],
      where: {
        status: 1,
        show_in: In(num),
        key_report: Not(IsNull()),
        key_workspc: Not(IsNull()),
      },
    })
  }

  async createReport(report: MenuReport) {
    report.id = null

    return this.reportRepository.save(report)
  }

  async getEmbedInfo(reportId: string) {
    // Get the Report Embed details
    try {
      const reportdb = await this.reportRepository.findOneBy({
        id: Number(reportId),
      })
      if (!reportdb)
        throw badRequest('El reporte con id ' + reportId + ' no fue encontrado')
      // Get report details and embed token
      const embedParams = await this.getEmbedParamsForSingleReport(
        // config.workspaceId,
        // config.reportId,
        reportdb.key_workspc,
        reportdb.key_report,
      )

      return {
        accessToken: embedParams.embedToken.token,
        embedUrl: embedParams.reportsDetail,
        expiry: embedParams.embedToken.expiration,
        status: 200,
      }
    } catch (err: any) {
      console.log('ERRORRR: ', err)

      return {
        status: err.status,
        error: `Error while retrieving report embed details\r\n${
          err.statusText
        }\r\nRequestId: \n${err.headers.get('requestid')}`,
      }
    }
  }

  async getInfoFree() {
    const api = 'https://api.powerbi.com/v1.0/myorg/availableFeatures'
    const headers = await this.getRequestHeader()
    const resultInfo = await axios.get(api, {
      headers: headers as any,
    })

    return resultInfo.data
  }

  private async getEmbedParamsForSingleReport(
    workspaceId: string,
    reportId: string,
    additionalDatasetId?: string,
  ) {
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`
    const headers = await this.getRequestHeader()

    // Get report info by calling the PowerBI REST API
    // const result = await fetch(reportInGroupApi, {
    //   method: 'GET',
    //   headers: headers as any,
    // });
    const response = await axios.get(reportInGroupApi, {
      headers: headers as any,
    })
    const resultJson = response.data

    if (response.status != 200) {
      throw resultJson
    }

    // Convert result in json to retrieve values
    // const resultJson: any = await result.json();

    // Add report data for embedding
    const reportDetails = new PowerBiReportDetails(
      resultJson.id,
      resultJson.name,
      resultJson.embedUrl,
    )
    const reportEmbedConfig = new EmbedConfig()

    // Create mapping for report and Embed URL
    reportEmbedConfig.reportsDetail = [reportDetails]

    // Create list of datasets
    // eslint-disable-next-line prefer-const
    let datasetIds = [resultJson.datasetId]

    // Append additional dataset to the list to achieve dynamic binding later
    if (additionalDatasetId) {
      datasetIds.push(additionalDatasetId)
    }

    // Get Embed token multiple resources
    reportEmbedConfig.embedToken =
      await this.getEmbedTokenForSingleReportSingleWorkspace(
        reportId,
        datasetIds,
        workspaceId,
      )

    return reportEmbedConfig
  }

  private async getEmbedParamsForMultipleReports(
    workspaceId: string,
    reportIds: string[],
    additionalDatasetIds: string[],
  ) {
    // EmbedConfig object
    const reportEmbedConfig = new EmbedConfig()

    // Create array of embedReports for mapping
    reportEmbedConfig.reportsDetail = []

    // Create Array of datasets
    const datasetIds = []

    // Get datasets and Embed URLs for all the reports
    for (const reportId of reportIds) {
      const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`
      const headers = await this.getRequestHeader()

      // Get report info by calling the PowerBI REST API
      // const result = await fetch(reportInGroupApi, {
      //   method: 'GET',
      //   headers: headers as any,
      // });
      const response2 = await axios.get(reportInGroupApi, {
        headers: headers as any,
      })
      const resultJson2 = response2.data

      if (response2.status != 200) {
        throw resultJson2
      }

      // Convert result in json to retrieve values
      // const resultJson: any = await result2.json();

      // Store result into PowerBiReportDetails object
      const reportDetails = new PowerBiReportDetails(
        resultJson2.id,
        resultJson2.name,
        resultJson2.embedUrl,
      )

      // Create mapping for reports and Embed URLs
      reportEmbedConfig.reportsDetail.push(reportDetails)

      // Push datasetId of the report into datasetIds array
      datasetIds.push(resultJson2.datasetId)
    }

    // Append to existing list of datasets to achieve dynamic binding later
    if (additionalDatasetIds) {
      datasetIds.push(...additionalDatasetIds)
    }

    // Get Embed token multiple resources
    reportEmbedConfig.embedToken =
      await this.getEmbedTokenForMultipleReportsSingleWorkspace(
        reportIds,
        datasetIds,
        workspaceId,
      )

    return reportEmbedConfig
  }

  private async getEmbedTokenForSingleReportSingleWorkspace(
    reportId: string,
    datasetIds: string[],
    targetWorkspaceId: string,
  ) {
    // Add report id in the request
    // eslint-disable-next-line prefer-const
    let formData: any = {
      reports: [
        {
          id: reportId,
        },
      ],
    }

    // Add dataset ids in the request
    formData['datasets'] = []
    for (const datasetId of datasetIds) {
      formData['datasets'].push({
        id: datasetId,
      })
    }

    // Add targetWorkspace id in the request
    if (targetWorkspaceId) {
      formData['targetWorkspaces'] = []
      formData['targetWorkspaces'].push({
        id: targetWorkspaceId,
      })
    }

    const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken'
    const headers = await this.getRequestHeader()

    // Generate Embed token for single report, workspace, and multiple datasets. Refer https://aka.ms/MultiResourceEmbedToken
    // const result = await fetch(embedTokenApi, {
    //   method: 'POST',
    //   headers: headers as any,
    //   body: JSON.stringify(formData),
    // });
    const result3 = await axios.post(embedTokenApi, formData, {
      headers: headers as any,
    })

    if (result3.status != 200) throw result3.data
    // return result.json();

    return result3.data
  }

  private async getEmbedTokenForMultipleReportsSingleWorkspace(
    reportIds: string[],
    datasetIds: string[],
    targetWorkspaceId: string,
  ) {
    // Add dataset ids in the request
    // eslint-disable-next-line prefer-const
    let formData: any = { datasets: [] }
    for (const datasetId of datasetIds) {
      formData['datasets'].push({
        id: datasetId,
      })
    }

    // Add report ids in the request
    formData['reports'] = []
    for (const reportId of reportIds) {
      formData['reports'].push({
        id: reportId,
      })
    }

    // Add targetWorkspace id in the request
    if (targetWorkspaceId) {
      formData['targetWorkspaces'] = []
      formData['targetWorkspaces'].push({
        id: targetWorkspaceId,
      })
    }

    const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken'
    const headers = await this.getRequestHeader()

    // Generate Embed token for multiple datasets, reports and single workspace. Refer https://aka.ms/MultiResourceEmbedToken
    // const result = await fetch(embedTokenApi, {
    //   method: 'POST',
    //   headers: headers as any,
    //   body: JSON.stringify(formData),
    // });
    const result4 = await axios.post(embedTokenApi, formData, {
      headers: headers as any,
    })

    if (result4.status != 200) throw result4.data

    return result4.data
  }

  private async getEmbedTokenForMultipleReportsMultipleWorkspaces(
    reportIds: string[],
    datasetIds: string[],
    targetWorkspaceIds: string[],
  ) {
    // Note: This method is an example and is not consumed in this sample app

    // Add dataset ids in the request
    let formData: any = { datasets: [] }
    for (const datasetId of datasetIds) {
      formData['datasets'].push({
        id: datasetId,
      })
    }

    // Add report ids in the request
    formData['reports'] = []
    for (const reportId of reportIds) {
      formData['reports'].push({
        id: reportId,
      })
    }

    // Add targetWorkspace ids in the request
    if (targetWorkspaceIds) {
      formData['targetWorkspaces'] = []
      for (const targetWorkspaceId of targetWorkspaceIds) {
        formData['targetWorkspaces'].push({
          id: targetWorkspaceId,
        })
      }
    }

    const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken'
    const headers = await this.getRequestHeader()

    // Generate Embed token for multiple datasets, reports and workspaces. Refer https://aka.ms/MultiResourceEmbedToken
    // const result = await fetch(embedTokenApi, {
    //   method: 'POST',
    //   headers: headers as any,
    //   body: JSON.stringify(formData),
    // });
    const result5 = await axios.post(embedTokenApi, formData, {
      headers: headers as any,
    })

    if (result5.status != 200) throw result5.data

    return result5.data
  }

  private async getRequestHeader() {
    // Store authentication token
    let tokenResponse

    // Store the error thrown while getting authentication token
    let errorResponse

    // Get the response from the authentication request
    try {
      tokenResponse = await this.authGetAccessToken()
    } catch (err: any) {
      if (
        err.hasOwnProperty('error_description') &&
        err.hasOwnProperty('error')
      ) {
        errorResponse = err.error_description
      } else {
        // Invalid PowerBI Username provided
        errorResponse = err.toString()
      }

      return {
        status: 401,
        error: errorResponse,
      }
    }

    // Extract AccessToken from the response
    const token = tokenResponse?.accessToken

    return {
      'Content-Type': 'application/json',
      // 'Authorization': utils.getAuthHeader(token)
      Authorization: `Bearer ${token}`,
    }
  }

  private async authGetAccessToken() {
    // Create a config variable that store credentials from config.json

    // Use MSAL.js for authentication

    const msalConfig: any = {
      auth: {
        clientId: config.clientId,
        authority: `${config.authorityUrl}${config.tenantId}`,
      },
    }

    // Check for the MasterUser Authentication
    if (config.authenticationMode.toLowerCase() === 'masteruser') {
      const clientApplication = new msal.PublicClientApplication(msalConfig)

      const usernamePasswordRequest = {
        scopes: [config.scopeBase],
        username: config.pbiUsername,
        password: config.pbiPassword,
      }

      return clientApplication.acquireTokenByUsernamePassword(
        usernamePasswordRequest,
      )
    }

    // Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
    if (config.authenticationMode.toLowerCase() === 'serviceprincipal') {
      msalConfig.auth.clientSecret = config.clientSecret
      const clientApplication = new msal.ConfidentialClientApplication(
        msalConfig,
      )

      const clientCredentialRequest = {
        scopes: [config.scopeBase],
      }

      return clientApplication.acquireTokenByClientCredential(
        clientCredentialRequest,
      )
    }
  }
}

class PowerBiReportDetails {
  reportId: any
  reportName: any
  embedUrl: any
  constructor(reportId: any, reportName: any, embedUrl: any) {
    this.reportId = reportId
    this.reportName = reportName
    this.embedUrl = embedUrl
  }
}

class EmbedConfig {
  reportsDetail: any
  embedToken: any
  type: any
  constructor(type?: any, reportsDetail?: any, embedToken?: any) {
    this.type = type
    this.reportsDetail = reportsDetail
    this.embedToken = embedToken
  }
}
