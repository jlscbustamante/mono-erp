import { Button } from 'antd'
import { useCreateJob } from './create-job-drawer'

export const JobsNav = () => {
  const { open } = useCreateJob()
  return (
    <div className="flex justify-end items-center">
      <Button onClick={open} type="primary">
        Nuevo cargo
      </Button>
    </div>
  )
}
