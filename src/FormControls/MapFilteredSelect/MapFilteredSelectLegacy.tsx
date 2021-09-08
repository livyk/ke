import React, { useCallback, useMemo, ReactElement } from 'react'
import styled from 'styled-components'

import { Filter, FiltersValue, Filters } from '../../Widgets/Filters'
import { MapSelect, MapSelectProps } from '../MapSelect'
import { WidgetWrapper } from '../../common/components/WidgetWrapper'
import { ListVertical } from '../../Layouts'
import { LayoutComponent, SlotElements } from '../../cdk/Layouts'
import { getDefaultMapLayout } from './layouts'

const moscowCoords = { lat: 55.75, lng: 37.61 }

const StyledMapFilterWidget = styled.div`
  padding: 5.4px;
  white-space: pre-line;
`

export function MapFilteredSelectLegacy<T, K extends string>({
  value,
  onChange,
  options,
  clusters,
  filters,
  filtersValue,
  onFiltersValueChange,
  name,
  style,
  helpText,
  description,
  center,
  mapLayout,
  filtersLayoutProxy,
  mapHeight = 448,
  ...rest
}: MapFilteredSelectLegacyProps<T, K>): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { bbox, zoom, ...otherFilters } = filtersValue
  const onFiltersChange = useCallback(
    (f: Record<K, unknown>) => onFiltersValueChange({ ...filtersValue, ...f }),
    [filtersValue, onFiltersValueChange]
  )
  const onZoomChange = useCallback(
    (z: number) => onFiltersValueChange({ ...filtersValue, zoom: z }),
    [filtersValue, onFiltersValueChange]
  )
  const onBboxChange = useCallback(
    (b: string | undefined) => onFiltersValueChange({ ...filtersValue, bbox: b }),
    [filtersValue, onFiltersValueChange]
  )

  const Layout = useMemo(() => mapLayout?.(mapHeight) || getDefaultMapLayout(mapHeight), [mapHeight, mapLayout])

  const mapChildren = useMemo(
    () => ({
      map: (
        <MapSelect
          value={value}
          onChange={onChange as any}
          options={options}
          clusters={clusters}
          center={center || moscowCoords}
          zoom={zoom || 12}
          onZoomChanged={onZoomChange}
          onBoundsChanged={onBboxChange}
        />
      ),
      filters: (
        <Filters
          filters={filters}
          value={otherFilters as FiltersValue<K>}
          onChange={onFiltersChange}
          layout={ListVertical}
          layoutProxy={filtersLayoutProxy}
        />
      ),
    }),
    [
      options,
      center,
      clusters,
      filters,
      onBboxChange,
      onChange,
      onFiltersChange,
      onZoomChange,
      otherFilters,
      value,
      zoom,
      filtersLayoutProxy,
    ]
  )

  return (
    <WidgetWrapper name={name} style={style} helpText={helpText} description={description} {...rest}>
      <StyledMapFilterWidget>
        <Layout>{mapChildren}</Layout>
      </StyledMapFilterWidget>
    </WidgetWrapper>
  )
}

type MapFilteredSelectLegacyProps<T, K extends string> = Pick<
  MapSelectProps<T>,
  'value' | 'onChange' | 'options' | 'clusters' | 'center'
> & {
  filters: readonly Filter<K>[]
  filtersValue: FiltersValue<K> & { zoom?: number; bbox?: string }
  onFiltersValueChange: (v: FiltersValue<K> & { zoom?: number; bbox?: string }) => void
  name: string
  style: any
  helpText: string
  description?: string | JSX.Element
  mapHeight?: number
  mapLayout?: (mapHeight: number) => LayoutComponent<SlotElements<'map' | 'filters'>>
  filtersLayoutProxy?: (elements: [string, ReactElement][]) => Record<string, ReactElement>
}
