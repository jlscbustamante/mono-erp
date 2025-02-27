import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Drawer, Empty } from 'antd'
import useMessage from 'antd/es/message/useMessage'
import React, { useEffect, useMemo, useState } from 'react'
import { BiSolidError } from 'react-icons/bi'
import { FaCheckCircle } from 'react-icons/fa'
import { IoIosInformationCircle } from 'react-icons/io'
import { PiSpinnerGap } from 'react-icons/pi'
import { TbReload } from 'react-icons/tb'

import {
  clearLogsJob,
  getAvailableJobs,
  getLogJobs,
  runJobGroup,
} from '@/data/hex/movements'
import { JobLog } from '@/data/interfaces'
import { cn } from '@/utils'
import { Play } from 'lucide-react'
import { toast } from 'react-toastify'

const ProcessRunDrawer: React.FC<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  const jobsQuery = useQuery({
    queryKey: ['jobs'],
    queryFn: getAvailableJobs,
  })
  const process = useMemo(() => jobsQuery.data ?? [], [jobsQuery.data])

  const logQuery = useQuery({
    queryKey: ['log-jobs'],
    queryFn: getLogJobs,
    refetchInterval: 40000,
  })

  const logs: JobLog[] = useMemo(() => {
    return logQuery.data ?? []
  }, [logQuery.data])

  // const runJobsMt = useMutation({
  //   mutationFn: runJobs,
  //   onSuccess: () => {
  //     logQuery.refetch()
  //   },
  //   onError: (err) => {
  //     apiMessage.error(err.message)
  //   },
  // })

  const clearLogs = useMutation({
    mutationFn: clearLogsJob,
    onError: (err) => {
      apiMessage.error(err.message)
    },
    onSuccess: () => {
      logQuery.refetch()
    },
  })

  const [apiMessage, contextHolder] = useMessage()

  return (
    <>
      {contextHolder}
      <Drawer title="Correr procesos" open={open} onClose={onClose} width={500}>
        <div className="mb-2 flex justify-between items-center">
          <div></div>
          {/* <Button
            type="primary"
            disabled={process.length < 1}
            loading={runJobsMt.isPending}
            onClick={() => runJobsMt.mutate()}
          >
            Correr los procesos
          </Button> */}
          <div className="space-x-1">
            <Button
              type="primary"
              onClick={() => clearLogs.mutate()}
              loading={clearLogs.isPending}
            >
              Limpiar registros
            </Button>
            <Button
              type="primary"
              icon={<TbReload className="" />}
              onClick={() => logQuery.refetch()}
              loading={logQuery.isRefetching}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          {process.length === 0 && (
            <div className="flex justify-center my-4">
              <Empty description="No hay procesos" />
            </div>
          )}
          {process.map((el) => {
            return (
              <CardProcess
                name={el}
                key={el}
                logs={logs}
                refetchLogs={() => {
                  logQuery.refetch()
                }}
              />
            )
          })}
        </div>
      </Drawer>
    </>
  )
}

const CardProcess: React.FC<{
  name: string
  logs: JobLog[]
  refetchLogs: () => void
}> = ({ name, logs, refetchLogs }) => {
  const groupInLog = logs.find((el) => el.groupName == name)

  const runGroupMt = useMutation({
    mutationFn: async (groupName: string) => {
      await runJobGroup(groupName)
    },
    onSuccess: () => {
      refetchLogs()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleRun = (groupName: string) => {
    runGroupMt.mutate(groupName)
  }

  if (!groupInLog)
    return (
      <div className="p-3 border  border-solid flex justify-between rounded border-slate-700">
        <span>{name}</span>
        <Button
          size="small"
          ghost
          className="!text-black cursor-pointer"
          onClick={() => handleRun(name)}
          loading={runGroupMt.isPending}
        >
          <Play className="text-slate-700 w-5 h-auto" />
        </Button>
      </div>
    )

  return <CardProcessLog log={groupInLog} name={name} />
}

const CardProcessLog = ({ log, name }: { log: JobLog; name: string }) => {
  const [counter, setCounter] = useState(
    () => log.jobs[log.jobs.length - 1].time,
  )
  const secondsToMinutesFormat = (seconds: number) => {
    const date = new Date(seconds * 1000)
    return date.getMinutes() + ':' + date.getSeconds()
  }
  const hasError = useMemo(() => log.jobs.some((el) => !el.ok), [log])

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (!log.closed) {
      interval = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [log.closed])

  return (
    <>
      <div className="p-3 border  border-solid rounded flex justify-between items-center">
        <span>{name}</span>
        {log.closed ? (
          hasError ? (
            <BiSolidError className="text-red-500 w-5 h-auto" />
          ) : (
            <FaCheckCircle className="text-lime-600" />
          )
        ) : (
          <PiSpinnerGap className="animate-spin" />
        )}
      </div>
      <div className="py-3 pl-3">
        <ul className="space-y-2">
          {log.jobs.map((el, index) => {
            if (el.isInfo) {
              return (
                <div key={el.name} className="flex justify-between">
                  <span className="font-semibold">{el.name}</span>
                  <p className="flex gap-2 items-center">
                    <IoIosInformationCircle className="text-sky-600 w-4 h-auto" />
                  </p>
                </div>
              )
            }
            if (index == log.jobs.length - 1) {
              return (
                <div
                  key={el.name}
                  className={cn({
                    'text-red-500': !el.ok,
                  })}
                >
                  <div className="flex justify-between items-center ">
                    <span
                      className={cn({
                        'font-semibold': !el.ok,
                      })}
                    >
                      {el.name}
                    </span>
                    <p className="flex gap-2 items-center">
                      <span>{secondsToMinutesFormat(counter)}</span>
                      {log.closed ? (
                        el.ok ? (
                          <FaCheckCircle className="text-lime-600" />
                        ) : (
                          <BiSolidError className="text-red-500 w-4 h-auto" />
                        )
                      ) : (
                        <PiSpinnerGap className="animate-spin" />
                      )}
                    </p>
                  </div>
                  <div>
                    <span>{el.error}</span>
                  </div>
                </div>
              )
            }
            return (
              <div key={el.name} className="flex justify-between">
                <span>{el.name}</span>
                <p className="flex gap-2 items-center">
                  <span>{secondsToMinutesFormat(el.time)}</span>
                  <FaCheckCircle className="text-lime-600 w-4 h-auto" />
                </p>
              </div>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default ProcessRunDrawer
