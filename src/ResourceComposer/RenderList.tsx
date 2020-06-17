import * as React from 'react'
import { useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/core'

import type { BaseAdmin } from 'admin'
import type { BaseProvider } from 'admin/providers'
import type { Pagination, TableFilter } from '../admin/providers'
import { Table } from './components/Table'
import { SideBar } from './components/SideBar'

export const RenderList: React.FC<{ admin: BaseAdmin; provider: BaseProvider }> = ({ admin, provider }) => {
  const [objects, setObjects] = useState<Model[]>([])

  const [backendFilters, setBackendFilters] = useState([])

  const [pagination, setPagination] = useState<Pagination>()

  const [pageCount, setPageCount] = useState(0)

  const [page, setPage] = useState(1)

  const processBackendResponse = ([backendData, , backendPagination]: [
    Model[],
    Array<TableFilter>,
    Pagination
  ]): void => {
    setObjects(backendData)
    setPagination(backendPagination)

    if (backendPagination?.count) {
      setPageCount(Math.ceil(backendPagination.count / backendPagination.perPage))
    }
  }

  useEffect(() => {
    provider.getList(admin.baseUrl, backendFilters, page).then(processBackendResponse)
  }, [admin.baseUrl, provider, backendFilters, page])

  return (
    <Flex>
      <SideBar />
      {objects && (
        <Table
          data={objects}
          columns={admin.list_fields}
          backendFilters={backendFilters}
          pageCount={pageCount}
          backendPagination={pagination}
          setBackendFilters={setBackendFilters}
          setBackendPage={setPage}
          filterable
        />
      )}
    </Flex>
  )
}