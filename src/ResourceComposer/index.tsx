import React from 'react'
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import type { BaseAdmin } from 'admin'
import type { Provider } from 'admin/providers/interfaces'
import type { BaseAnalytic } from 'integration/analytics/base'

import { RenderList } from '../ListView/RenderList'
import { RenderDetail } from '../DetailView/RenderDetail'
import { SideBar, SideBarElement } from '../ListView/components/SideBar'
import { mountElement } from '../common/permissions'
import { SideBarElementCompatible } from '../LegacySupport'
import { TPathRules } from '../ListView/components/Breadcrumbs/Breadcrumbs'
import { getAccessor } from '../DetailView/utils/dataAccess'
import { ErrorBoundary } from '../common/components/ErrorBoundary'

type ResourceProps = {
  props: {
    admin?: BaseAdmin
  }
}

const Resource = ({ name, children }: { name: string; children: JSX.Element }): JSX.Element => (
  <Switch>
    <Route exact path={`/${name}/`}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Route>
  </Switch>
)

const AdminResource = ({
  name,
  admin,
  provider,
  user,
  analytics,
}: {
  name: string
  admin: BaseAdmin
  provider: Provider
  user: object
  analytics: BaseAnalytic | undefined
}): JSX.Element => (
  <Switch>
    <Redirect exact strict from={`/${name}`} to={`/${name}/`} />
    {!getAccessor(admin.hideListView) && (
      <Route exact strict path={`/${name}/`}>
        <ErrorBoundary>
          <RenderList resourceName={name} admin={admin} provider={provider} user={user} analytics={analytics} />
        </ErrorBoundary>
      </Route>
    )}
    <Route exact path={`/${name}/:id`}>
      <ErrorBoundary>
        <RenderDetail resourceName={name} admin={admin} provider={provider} user={user} analytics={analytics} />
      </ErrorBoundary>
    </Route>
  </Switch>
)

const isAdminResource = (resource: ResourceProps): boolean => resource.props.admin !== undefined

const ResourceComposer = ({
  children,
  withSideBar = true,
  permissions = [],
  breadcrumbsRules,
}: {
  permissions?: string[]
  withSideBar?: boolean
  children: JSX.Element[]
  breadcrumbsRules?: TPathRules
}): JSX.Element => {
  const forbiddenResourceElement = <p>Простите, вам сюда нельзя :(</p>

  return (
    <Router>
      {withSideBar && (
        <SideBar header="Разделы" breadcrumbsRules={breadcrumbsRules}>
          {React.Children.map(children, (resource: JSX.Element) => {
            if (isAdminResource(resource)) {
              const { props } = resource as ResourceProps
              const adminPermissions = props?.admin?.permissions || []
              const showSideBar = !getAccessor(props?.admin?.hideSideBar)
              if (showSideBar) {
                const element = <SideBarElement resource={resource} />

                return mountElement(permissions, adminPermissions, element) || <></>
              }
            }
            if ('path' in resource.props && 'navTitle' in resource.props) {
              return <SideBarElementCompatible {...resource.props} />
            }
            return <></>
          })}
        </SideBar>
      )}
      {React.Children.map(children, (resource: JSX.Element) => {
        if (isAdminResource(resource)) {
          const { props } = resource as ResourceProps
          const adminPermissions = props?.admin?.permissions || []

          return mountElement(permissions, adminPermissions, resource) || forbiddenResourceElement
        }
        return resource
      })}
    </Router>
  )
}

export { ResourceComposer, Resource, AdminResource }
