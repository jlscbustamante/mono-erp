import { REQUIERMENT_TYPE } from '@view'
import { useState } from 'react'
import { CreationForm } from './create-form'
import { CreationTransferForm } from './create-transfer'

export function RequirementeCreation() {
  const [reqType, setReqType] = useState(REQUIERMENT_TYPE.SIMPLE)
  return (
    <div className="p-3 bg-blue-50 h-full">
      {reqType == REQUIERMENT_TYPE.TRANSFER ? (
        <CreationTransferForm changeType={setReqType} type={reqType} />
      ) : (
        <CreationForm changeType={setReqType} type={reqType} />
      )}
    </div>
  )
}
