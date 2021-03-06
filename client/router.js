import Vue from 'vue'
import Router from 'vue-router'
import qs from 'qs'
import { scrollBehavior, parseReqObjs } from '~/utils'

Vue.use(Router)

const Policy = () => import('~/pages/policy/index').then(m => m.default || m)
const Business = () => import('~/pages/business/index').then(m => m.default || m)
const Contacts = () => import('~/pages/contacts/index').then(m => m.default || m)
const BlogIndex = () => import('~/pages/blog/index').then(m => m.default || m)
const BlogHome = () => import('~/pages/blog/home').then(m => m.default || m)
const BlogShow = () => import('~/pages/blog/show').then(m => m.default || m)
const OrganizationsIndex = () => import('~/pages/organizations/index').then(m => m.default || m)
const OrganizationsHome = () => import('~/pages/organizations/home').then(m => m.default || m)
const OrganizationsShow = () => import('~/pages/organizations/show').then(m => m.default || m)
const ProductsIndex = () => import('~/pages/products/index').then(m => m.default || m)
const ProductsHome = () => import('~/pages/products/home').then(m => m.default || m)
const ProductsShow = () => import('~/pages/products/show').then(m => m.default || m)

const Login = () => import('~/pages/auth/login').then(m => m.default || m)
const Register = () => import('~/pages/auth/register').then(m => m.default || m)
const PasswordReset = () => import('~/pages/auth/password/reset').then(m => m.default || m)
const PasswordRequest = () => import('~/pages/auth/password/email').then(m => m.default || m)

const ManagementHome = () => import('~/pages/management/home').then(m => m.default || m)

const ProfileHome = () => import('~/pages/profile/home').then(m => m.default || m)
const BookmarksHome = () => import('~/pages/bookmarks/home').then(m => m.default || m)
const ProfileShow = () => import('~/pages/profile/show').then(m => m.default || m)
const BookmarksProducts = () => import('~/pages/bookmarks/products').then(m => m.default || m)
const BookmarksArticles = () => import('~/pages/bookmarks/articles').then(m => m.default || m)

const ManagementOrganizationsHome = () => import('~/pages/management/organizations/home').then(m => m.default || m)
const ManagementOrganizationsIndex = () => import('~/pages/management/organizations/index').then(m => m.default || m)
const ManagementOrganizationsEdit = () => import('~/pages/management/organizations/edit').then(m => m.default || m)
const ManagementOrganizationsServices = () => import('~/pages/management/organizations/services').then(m => m.default || m)

const ManagementOrganizationsProductsHome = () => import('~/pages/management/organizations/products/home').then(m => m.default || m)
const ManagementOrganizationsProductsIndex = () => import('~/pages/management/organizations/products/index').then(m => m.default || m)
const ManagementOrganizationsProductsEdit = () => import('~/pages/management/organizations/products/edit').then(m => m.default || m)

const ManagementOrganizationsPointsIndex = () => import('~/pages/management/organizations/points/index').then(m => m.default || m)

const routes = [
  { path: '/',
    name: 'welcome',
    component: ProductsIndex,
    meta: {
      title: 'Главная'
    }
  },

  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/password/reset', name: 'password.request', component: PasswordRequest },
  { path: '/password/reset/:token', name: 'password.reset', component: PasswordReset },

  { path: '/policy', name: 'policy', component: Policy },
  { path: '/business', name: 'business', component: Business },
  { path: '/contacts', name: 'contacts', component: Contacts },
  { path: '/blog',
    component: BlogHome,
    meta: {
      breadcrumb: 'Блог'
    },
    children: [
      { path: '',
        name: 'blog.index',
        component: BlogIndex
      },
      { path: ':articleId',
        name: 'blog.show',
        meta: {
          breadcrumb: {
            name: 'articleId',
            length: 100
          }
        },
        component: BlogShow
      }
    ]
  },
  { path: '/organizations',
    component: OrganizationsHome,
    meta: {
      breadcrumb: 'Организации'
    },
    children: [
      { path: '',
        name: 'organizations.index',
        component: OrganizationsIndex
      },
      { path: ':organizationId',
        name: 'organizations.show',
        meta: {
          breadcrumb: {
            name: 'organizationId'
          }
        },
        component: OrganizationsShow
      }
    ]
  },
  { path: '/products',
    component: ProductsHome,
    meta: {
      breadcrumb: 'Акции'
    },
    children: [
      { path: '',
        name: 'products.index',
        component: ProductsIndex,
        meta: {
          title: 'Акции'
        }
      },
      { path: ':productId',
        name: 'products.show',
        meta: {
          breadcrumb: {
            name: 'productId',
            length: 100
          }
        },
        component: ProductsShow
      }
    ]
  },

  { path: '/profile',
    component: ProfileHome,
    children: [
      { path: '',
        name: 'profile.show',
        meta: {
          guard: 'auth',
          title: 'Мой профиль'
        },
        component: ProfileShow
      }
    ]
  },
  { path: '/bookmarks',
    component: BookmarksHome,
    children: [
      { path: '',
        name: 'bookmarks.index',
        redirect: { name: 'bookmarks.products' }
      },
      { path: 'products',
        name: 'bookmarks.products',
        meta: {
          title: 'Закладки акций'
        },
        component: BookmarksProducts
      },
      { path: 'articles',
        name: 'bookmarks.articles',
        meta: {
          title: 'Закладки статей'
        },
        component: BookmarksArticles
      }
    ]
  },
  { path: '/management',
    component: ManagementHome,
    meta: {
      guard: 'auth',
      breadcrumb: 'Управление'
    },
    children: [
      { path: '',
        name: 'management.index',
        redirect: { name: 'management.organizations.index' }
        // component: ManagementIndex
      },
      { path: 'organizations',
        component: ManagementOrganizationsHome,
        meta: {
          breadcrumb: 'Организации'
        },
        children: [
          { path: '',
            name: 'management.organizations.index',
            component: ManagementOrganizationsIndex
          },
          { path: 'create',
            name: 'management.organizations.create',
            meta: {
              breadcrumb: 'Создание'
            },
            component: ManagementOrganizationsEdit
          },
          { path: ':organizationId',
            name: 'management.organizations.show',
            meta: {
              breadcrumb: {
                name: 'organizationId'
              }
            },
            redirect: { name: 'management.organizations.edit' },
            component: ManagementOrganizationsHome,
            children: [
              { path: 'edit',
                name: 'management.organizations.edit',
                meta: {
                  breadcrumb: 'Редактирование'
                },
                component: ManagementOrganizationsEdit
              },
              { path: 'services',
                name: 'management.organizations.services',
                meta: {
                  breadcrumb: 'Платные услуги'
                },
                component: ManagementOrganizationsServices
              },
              { path: 'products',
                component: ManagementOrganizationsProductsHome,
                meta: {
                  breadcrumb: 'Акции'
                },
                children: [
                  { path: '',
                    name: 'management.organizations.products.index',
                    component: ManagementOrganizationsProductsIndex
                  },
                  { path: 'create',
                    name: 'management.organizations.products.create',
                    meta: {
                      breadcrumb: 'Создание'
                    },
                    component: ManagementOrganizationsProductsEdit
                  },
                  { path: ':productId',
                    name: 'management.organizations.products.show',
                    meta: {
                      breadcrumb: {
                        name: 'productId'
                      }
                    },
                    redirect: { name: 'management.organizations.products.edit' },
                    component: ManagementOrganizationsProductsHome,
                    children: [
                      { path: 'edit',
                        name: 'management.organizations.products.edit',
                        meta: {
                          breadcrumb: 'Редактирование'
                        },
                        component: ManagementOrganizationsProductsEdit
                      }
                    ]
                  }
                ]
              },
              { path: 'points',
                component: ManagementOrganizationsPointsIndex,
                name: 'management.organizations.points.index',
                meta: {
                  breadcrumb: 'Точки'
                }
              }
            ]
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
    mode: 'history',
    parseQuery (query) {
      return parseReqObjs({ ...qs.parse(query) })
    },
    stringifyQuery (query) {
      let result = qs.stringify(query, { encode: false })

      return result ? ('?' + result) : ''
    }
  })
}
