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
const ManagementOrganizationsShow = () => import('~/pages/management/organizations/show').then(m => m.default || m)
const ManagementOrganizationsEdit = () => import('~/pages/management/organizations/edit').then(m => m.default || m)

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
    children: [
      { path: '',
        name: 'management.index',
        component: ManagementIndex
      },
      { path: 'organizations',
        component: ManagementOrganizationsHome,
        children: [
          { path: '',
            name: 'management.organizations.index',
            component: ManagementOrganizationsIndex
          },
          { path: 'create', name: 'management.organizations.create', component: ManagementOrganizationsEdit },
          { path: ':id', name: 'management.organizations.show', component: ManagementOrganizationsShow },
          { path: ':id/edit', name: 'management.organizations.edit', component: ManagementOrganizationsEdit }
        ]
      }
    ]
  }

  // { path: '/management/organizations',
  //   component: ManagementOrganizationsHome,
  //   children: [
  //     { path: '', name: 'management.organizations.index', component: ManagementOrganizationsIndex },
  //     { path: ':id', name: 'management.organizations.show', component: ManagementOrganizationsShow },
  //     { path: ':id/edit', name: 'management.organizations.edit', component: ManagementOrganizationsEdit }
  //   ]
  // },
  // { path: '/management/organizations', name: 'management.organizations.index', component: ManagementOrganizationsIndex },
  // { path: '/management/organizations/:id', name: 'management.organizations.show', component: ManagementOrganizationsShow },
  // { path: '/management/organizations/:id/edit', name: 'management.organizations.edit', component: ManagementOrganizationsEdit }
]

export function createRouter () {
  return new Router({
    routes,
    scrollBehavior,
    mode: 'history'
  })
}
