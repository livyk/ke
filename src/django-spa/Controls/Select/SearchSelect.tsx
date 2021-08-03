import React, { forwardRef } from 'react'
import BaseSelect from 'react-select/async'

import type { BaseSelectProps, Option } from './types'

const SearchSelectInner = <T extends Option>(
  { value, onChange, ...other }: SearchSelectInnerProps<T>,
  ref?: React.ForwardedRef<HTMLDivElement>
): JSX.Element => (
  <BaseSelect
    value={value}
    onChange={onChange as (v: T | readonly T[] | undefined | null) => void}
    inputRef={ref}
    {...other}
  />
)

export const SearchSelect = forwardRef(SearchSelectInner) as SearchSelectProps

type SearchSelectProps = <T extends Option>(
  props: SearchSelectInnerProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof SearchSelectInner>

type SearchSelectInnerProps<T extends Option> = BaseSelectProps<T> & {
  defaultOptions: readonly T[]
  loadOptions: (search: string) => Promise<T[]>
}
