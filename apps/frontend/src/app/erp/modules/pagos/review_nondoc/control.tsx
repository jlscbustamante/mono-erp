import { AdmReqNondocsViewDto } from '@types'
import { NonDoc } from './nondoc'

export const Control = ({
  requirement,
}: {
  requirement: AdmReqNondocsViewDto
}) => {
  return (
    <div>
      <NonDoc requirement={requirement} />
    </div>
  )
}
