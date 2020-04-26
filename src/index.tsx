import * as React from 'react'
import { ThemeProvider } from '@chakra-ui/core'

import { BaseAdmin } from 'admin'
import { BaseProvider } from 'admin/providers'
import { StringField } from 'admin/fields/StringField'
import { LayoutComposer } from './LayoutComposer'

const App = (props: any): JSX.Element => {
  const { admin, additionalComponents } = props

  return (
    <ThemeProvider>
      <LayoutComposer customAdminClass={admin} additionalComponents={additionalComponents} />
    </ThemeProvider>
  )
}

export { App, BaseAdmin, BaseProvider, StringField }
