import * as React from 'react'
import { Flex, Text, Box, Collapse, Button } from '@chakra-ui/core'
import { usePagination, useTable, useFilters } from 'react-table'
import { Link } from 'react-router-dom'

import type { ReactNode } from 'react'
import type { Row, HeaderGroup } from 'react-table'
import type { ListFieldDescription } from 'admin/fields/FieldDescription'

import { StyledTable, TableCell, TableHead, TableRow } from './styles'
import { Bottom } from './Bottom'
import type { Pagination, Filter } from '../../../admin/providers'

type TableProps = {
  data: any
  columns: ListFieldDescription[]
  backendFilters: Filter[] | undefined
  pageCount: number | undefined
  backendPagination: Pagination | undefined
  setBackendFilters: Function | undefined
  setBackendPage: Function | undefined
  filterable: boolean
}

// Use declaration merging to extend types https://github.com/tannerlinsley/react-table/commit/7ab63858391ebb2ff621fa71411157df19d916ba
declare module 'react-table' {
  export interface TableOptions<D extends object> extends UsePaginationOptions<D>, UseFiltersOptions<D> {}

  export interface TableInstance<D extends object = {}> extends UsePaginationInstanceProps<D> {}

  export interface TableState<D extends object = {}> extends UsePaginationState<D>, UseFiltersState<D> {}

  export interface ColumnInstance<D extends object = {}> extends UseSortByColumnProps<D> {}
}

const mountHeader = (headerGroups: HeaderGroup[]): ReactNode => {
  return headerGroups.map((headerGroup: HeaderGroup) => (
    <Flex flex={1} flexDirection="row" {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((column: any) => (
        <TableCell p={4} key={column.id} bg="gray.100" {...column.getHeaderProps()} justifyContent="space-between">
          <Flex flexDirection="column">
            <Text fontWeight="bold">{column.render('Header')}</Text>
          </Flex>
        </TableCell>
      ))}
    </Flex>
  ))
}

const mountRows = (rows: Row[], prepareRow: Function): ReactNode => {
  return rows.map((row: Row) => {
    prepareRow(row)

    return (
      // eslint-disable-next-line
      <TableRow flexDirection="row" {...row.getRowProps()} data-testid="table-row">
        {row.cells.map((cell: any) => {
          return (
            <TableCell key={cell.row.index} justifyContent="flex-start" p={4} {...cell.getCellProps()}>
              {cell.column.toDetailRoute ? (
                <Link to={{ pathname: `${cell.column.toDetailRoute}/${cell.column.accessor(cell.row.original)}` }}>
                  {cell.render('Cell')}
                </Link>
              ) : (
                cell.render('Cell')
              )}
            </TableCell>
          )
        })}
      </TableRow>
    )
  })
}

const FilterBlock = ({ headerGroups }: { headerGroups: HeaderGroup[] }): JSX.Element => {
  const [show, setShow] = React.useState<boolean>(false)
  const handleToggle = (): void => setShow(!show)

  const mountFilters = (): ReactNode => {
    return headerGroups.map((headerGroup: HeaderGroup) =>
      headerGroup.headers.map((column: any) => (
        <Flex flexDirection="column" m={2} key={column.id}>
          {column.Filter && (
            <>
              <Text fontWeight="bold">{column.render('Header')}</Text>
              <Box>{column.render('Filter')}</Box>
            </>
          )}
        </Flex>
      ))
    )
  }

  return (
    <>
      <Button variantColor="teal" onClick={handleToggle} maxWidth={130} m={2}>
        Фильтровать
      </Button>
      <Collapse mt={19} isOpen={show}>
        {mountFilters()}
      </Collapse>
    </>
  )
}

const Table = ({
  columns,
  backendFilters,
  data,
  pageCount: controlledPageCount,
  setBackendFilters,
  setBackendPage,
  filterable = false,
}: TableProps): JSX.Element => {
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    pageCount,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      initialState: { pageIndex: 0 },
      pageCount: controlledPageCount,
      autoResetPage: false,
      stateReducer: (newState: any, action: any) => {
        if (action.type === 'setFilter' && setBackendFilters) {
          const backendFiltersList = backendFilters ? Array.from(backendFilters) : []

          const toUpdateFilters = [...backendFiltersList, ...newState.filters]
          const uniqueFilters = new Set(toUpdateFilters)

          setBackendFilters(uniqueFilters)
        }
        if (action.type === 'gotoPage' && setBackendPage) {
          setBackendPage(newState.pageIndex + 1)
        }
        return newState
      },
    },
    useFilters,
    usePagination
  )

  return (
    <Flex flexDirection="row" width="100%" flex={1} bg="gray.50" p={4}>
      <Flex
        flexDirection="column"
        flex={1}
        maxWidth="100%"
        bg="white"
        width="auto"
        rounded="md"
        borderWidth="1px"
        onClick={() => false}
      >
        {filterable && <FilterBlock headerGroups={headerGroups} />}

        <StyledTable {...getTableProps()}>
          <TableHead>{mountHeader(headerGroups)}</TableHead>
          <Flex flexDirection="column">{mountRows(page, prepareRow)}</Flex>
        </StyledTable>

        <Bottom
          pageIndex={pageIndex}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageOptions={pageOptions}
          pageCount={pageCount}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
        />
      </Flex>
    </Flex>
  )
}

export { Table }