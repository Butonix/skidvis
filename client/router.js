import Vue from 'vue'
import Router from 'vue-router'
import { scrollBehavior } from '~/utils'

Vue.use(Router)

const Home = () => import('~/pages/home').then(m => m.default || m)
const Welcome = () => import('~/pages/welcome').then(m => m.default || m)

const Login = () => import('~/pages/auth/login').then(m => m.default || m)
const Register = () => import('~/pages/auth/register').then(m => m.default || m)
const PasswordReset = () => import('~/pages/auth/password/reset').then(m => m.default || m)
const PasswordRequest = () => import('~/pages/auth/password/email').then(m => m.default || m)

const Settings = () => import('~/pages/settings/index').then(m => m.default || m)
const SettingsProfile = () => import('~/pages/settings/profile').then(m => m.default || m)
const SettingsPassword = () => import('~/pages/settings/password').then(m => m.default || m)

const ManagementHome = () => import('~/pages/management/home').then(m => m.default || m)
const ManagementIndex = () => import('~/pages/management/index').then(m => m.default || m)

const ManagementOrganizationsHome = () => import('~/pages/management/organizations/home').then(m => m.default || m)
const ManagementOrganizationsIndex = () => import('~/pages/management/organizations/index').then(m => m.default || m)
const ManagementOrganizationsEdit = () => import('~/pages/management/organizations/edit').then(m => m.default || m)

const ManagementOrganizationsProductsHome = () => import('~/pages/management/organizations/products/home').then(m => m.default || m)
const ManagementOrganizationsProductsIndex = () => import('~/pages/management/organizations/products/index').then(m => m.default || m)
const ManagementOrganizationsProductsEdit = () => import('~/pages/management/organizations/products/edit').then(m => m.default || m)

const routes = [
  { path: '/', name: 'welcome', component: Welcome },
  { path: '/home', name: 'home', component: Home },

  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/password/reset', name: 'password.request', component: PasswordRequest },
  { path: '/password/reset/:token', name: 'password.reset', component: PasswordReset },

  { path: '/settings',
    component: Settings,
    children: [
      { path: '', redirect: { name: 'settings.profile' } },
      { path: 'profile', name: 'settings.profile', component: SettingsProfile },
      { path: 'password', name: 'settings.password', component: SettingsPassword }
    ]
  },

  { path: '/management',
    component: ManagementHome,
    meta: {
      breadcrumb: 'management'
    },
    children: [
      { path: '',
        name: 'management.index',
        component: ManagementIndex
      },
      { path: 'organizations',
        component: ManagementOrganizationsHome,
        meta: {
          breadcrumb: 'organizations'
        },
        children: [
          { path: '',
            name: 'management.organizations.index',
            component: ManagementOrganizationsIndex
          },
          { path: 'create',
            name: 'management.organizations.create',
            meta: {
              breadcrumb: 'create'
            },
            component: ManagementOrganizationsEdit
          },
          { path: 'products',
            component: ManagementOrganizationsProductsHome,
            meta: {
              breadcrumb: 'products'
            },
            children: [
              { path: '',
                name: 'management.organizations.products.index',
                component: ManagementOrganizationsProductsIndex
              },
              { path: 'create',
                name: 'management.organizations.products.create',
                meta: {
                  breadcrumb: 'create'
                },
                component: ManagementOrganizationsProductsEdit
              },
              { path: ':id/edit',
                name: 'management.organizations.products.edit',
                meta: {
                  breadcrumb: 'edit'
                },
                component: ManagementOrganizationsProductsEdit
              }
            ]
          },
          { path: ':id/edit',
            name: 'management.organizations.edit',
            meta: {
              breadcrumb: 'edit'
            },
            component: ManagementOrganizationsEdit
          }
        ]
      }
    ]
  }

]

export function createRouter () {
  return new Router({
    routes,
    scrollBehavior,
    mode: 'history'
  })
}
