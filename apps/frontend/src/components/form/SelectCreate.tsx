import { Select } from 'antd'
import { useState } from 'react'

import { filterOption, safeAny } from '@/utils'

export const SelectCreate = () => {
  const [searchValue, setSearchValue] = useState('')
  return (
    <div className="w-80">
      <Select
        notFoundContent={<div>Crear {searchValue}</div>}
        showSearch
        searchValue={searchValue}
        onSearch={setSearchValue}
        filterOption={filterOption as safeAny}
        options={[
          { label: 'uno', value: '1' },
          { label: 'dos', value: '2' },
        ]}
        className="w-full"
        onChange={(val) => {
          console.log('valor : ', val)
        }}
      />
    </div>
  )
}
