import 'react-toastify/dist/ReactToastify.css'
import './report.css'

import { Checkbox, Divider, Drawer, FloatButton, Input, Modal } from 'antd'
import Link from 'antd/es/typography/Link'
import { models } from 'powerbi-client'
import { PowerBIEmbed } from 'powerbi-client-react'
import { useEffect, useState } from 'react'
import { BiMenu } from 'react-icons/bi'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/reports/sdk'
import { IReport } from '@/data/reports/types'
import { safeAny } from '@/utils'

export default function Reports() {
  const [reports, setReports] = useState<IReport[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [idSelected, setIdSelected] = useState<null | number>(null)
  const [showModalCreation, setShowModalCreation] = useState(false)
  const [params] = useSearchParams()
  const reportId = Number(params.get('reportId'))
  const token = params.get('token')
  const hideBar = Boolean(Number(params.get('hideBar') ?? 0))
  const isMobile = Boolean(Number(params.get('isMobile') ?? 0))
  const isExternal = Boolean(Number(params.get('isExternal') ?? 0))

  const loadReports = async () => {
    if (!isExternal) {
      const reports = await sdk.reports()
      setReports(reports)
    }
  }
  useEffect(() => {
    if (reportId) setIdSelected(reportId)
    ;(async () => {
      await loadReports()
    })()
  }, [])
  return (
    <>
      {!hideBar && (
        <FloatButton
          shape="circle"
          type="primary"
          style={{ top: 10, left: 10 }}
          icon={<BiMenu />}
          onClick={() => {
            setMenuOpen(true)
          }}
        />
      )}
      <ReportContainer id={idSelected} token={token} isMobile={isMobile} />
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        placement="left"
        title="Reportes"
      >
        <MenuReports
          reports={reports}
          setMenuOpen={setMenuOpen}
          setIdSelected={setIdSelected}
          idSelected={idSelected}
          setShowModalCreation={setShowModalCreation}
        />
      </Drawer>
      <CreationForm
        setShowModalCreation={setShowModalCreation}
        showModalCreation={showModalCreation}
        onCreate={async () => {
          await loadReports()
        }}
      />
      <ToastContainer />
    </>
  )
}

const MenuReports: React.FC<{
  reports: IReport[]
  setMenuOpen: safeAny
  setIdSelected: safeAny
  idSelected: number | null
  setShowModalCreation: safeAny
}> = ({ reports, setMenuOpen, setIdSelected, idSelected }) => {
  const navigate = useNavigate()

  return (
    <>
      {/* <Title level={4}>Reportes</Title> */}
      <div>
        {reports.map((report) => {
          return (
            <p
              key={report.id}
              onClick={() => {
                setMenuOpen(false)
                setIdSelected(report.id)
              }}
              className={`cursor-pointer p-3 hover:bg-gray-100 rounded-sm font-bold ${
                idSelected === report.id ? 'bg-gray-100' : ''
              }`}
            >
              {report.rpt_name}
            </p>
          )
        })}
        <Divider />
        <div className="flex justify-between">
          <Link href="#" onClick={() => navigate('/modules')}>
            Ir modulos
          </Link>
          {/* <Link href="#" onClick={() => setShowModalCreation(true)}>
            Añadir reporte(url)
          </Link> */}
        </div>
      </div>
    </>
  )
}
const CreationForm: React.FC<{
  setShowModalCreation: safeAny
  showModalCreation: boolean
  onCreate: () => Promise<void>
}> = ({ setShowModalCreation, showModalCreation, onCreate }) => {
  const [url, setUrl] = useState('')
  const [haveMobile, setHaveMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const validateUrl = (
    url: string,
  ): { workspaceId: string; reportId: string } => {
    const grupos = /groups\/([^/]+)/.exec(url)
    const informes = /reports\/([^/]+)/.exec(url)
    if (!grupos || !informes) {
      throw new Error(
        'No se encontro el workspaceId ni el reportId en la url recibida',
      )
    }
    const gruposValor = grupos[1]
    const informesValor = informes[1]
    return {
      workspaceId: gruposValor,
      reportId: informesValor,
    }
  }
  const clearData = () => {
    setName('')
    setUrl('')
    setHaveMobile(false)
  }

  const handlerCreation = async () => {
    try {
      setIsLoading(true)
      if (name == '') throw new Error('El nombre del reporte es requerido')
      const { workspaceId, reportId } = validateUrl(url)
      await sdk.addReport({
        name,
        workspaceId,
        reportId,
      })
      toast.info('Reporte creado', NOTIFICATION.info)
      await onCreate()
      clearData()
      setShowModalCreation(false)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Modal
      onCancel={() => {
        setShowModalCreation(false)
      }}
      title="Añdir reporte"
      okText="Añadir"
      open={showModalCreation}
      okButtonProps={{
        loading: isLoading,
      }}
      centered={true}
      onOk={handlerCreation}
    >
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Nombre del reporte"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="URL del reporte(power bi)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="">
          <label className="flex gap-2">
            <Checkbox
              checked={haveMobile}
              onChange={(e) => setHaveMobile(e.target.checked)}
            />
            Tiene diseño movil
          </label>
        </div>
      </div>
    </Modal>
  )
}

const ReportContainer: React.FC<{
  id: number | null
  token: string | null
  isMobile: boolean
}> = ({ id, token, isMobile }) => {
  const [showPBI, setShowPBI] = useState(false)
  const [embedConfig, setEmbedConfig] = useState({
    type: 'report',
    embedUrl: '',
    accessToken: '',
    tokenType: models.TokenType.Embed, // Use models.TokenType.Aad if you're embedding for your organization.
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: false,
        },
      },
    },
  })
  const [message, setMessage] = useState('Selecciona algún reporte en el menu')
  useEffect(() => {
    ;(async () => {
      try {
        if (id) {
          setShowPBI(false)
          setMessage('Cargando reporte...')
          const report = await sdk.reportEmbed(id, token ?? undefined)
          const newObj: safeAny = {
            ...embedConfig,
            accessToken: report.accessToken,
            embedUrl: report.embedUrl[0].embedUrl,
          }
          if (isMobile)
            newObj.settings.layoutType = models.LayoutType.MobilePortrait
          setEmbedConfig(newObj)
          setMessage('')
          setShowPBI(true)
        }
      } catch (err: any) {
        toast.error(err.message, { ...NOTIFICATION.error, autoClose: false })
      }
    })()
  }, [id])

  return !showPBI ? (
    <div
      className="flex items-center justify-center bg-sky-50 w-full min-h-screen"
      style={{ aspectRatio: isMobile ? '9/16' : '16/9' }}
    >
      {message}
    </div>
  ) : (
    <PowerBIEmbed
      cssClassName={`w-full ${isMobile ? '_aspect-9-16' : '_aspect-16-9'}`}
      embedConfig={{ ...embedConfig }}
      // getEmbeddedComponent={(embeddedReport) => {
      //   this.report = embeddedReport as Report
      // }}
    />
  )
}
