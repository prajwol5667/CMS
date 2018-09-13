import Vue from 'vue'
import Router from 'vue-router'

// Containers
const Default = () => import('@/containers/Default')

// Views
const Dashboard = () => import('@/views/Dashboard')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')

// CMS Routing
// Operator
const ListOperator = () => import('@/views/operator/List');
const CreateOperator = () => import('@/views/operator/Create');

// NavApp
const ListSites = () => import('@/views/navApp/sites/List');
const CreateSites = () => import('@/views/navApp/sites/Create');
const ListBanner = () => import('@/views/navApp/banner/List');
const CreateBanner = () => import('@/views/navApp/banner/Create');
const ListAnnouncement = () => import('@/views/navApp/announcement/List');
const CreateAnnouncement = () => import('@/views/navApp/announcement/Create');
const ListPromotion = () => import('@/views/navApp/promotion/List');
const CreatePromotion = () => import('@/views/navApp/promotion/Create');

// Jeetwin
const ListPosterAd = () => import('@/views/jeetwin/posterAd/List');
const CreatePosterAd = () => import('@/views/jeetwin/posterAd/Create');
const ListTournament = () => import('@/views/jeetwin/tournament/List');
const CreateTournament = () => import('@/views/jeetwin/tournament/Create');

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: Default,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'operator',
          redirect: '/operator/all',
          name: 'Operator',
          component: {
            render(c) {return c('router-view')}
          },
          children: [
            {
              path: 'all',
              name: 'All Operator',
              component: ListOperator
            },
            {
              path: 'create',
              name: 'Add Operator',
              component: CreateOperator
            }
          ]
        },
        {
          path: 'navApp',
          redirect: '/',
          name: 'Navigation App',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'sites',
              redirect: '/navApp/sites/all',
              name: 'Sites',
              component: {
                render(c) { return c('router-view') }
              },
              children: [
                {
                  path: 'all',
                  name: 'All Sites',
                  component: ListSites
                },
                {
                  path: 'create',
                  name: 'Add Sites',
                  component: CreateSites
                }
              ]
            },
            {
              path: 'banner',
              redirect: '/navApp/banner/all',
              name: 'Banner',
              component: {
                render(c) { return c('router-view') }
              },
              children: [
                {
                  path: 'all',
                  name: 'All Banner',
                  component: ListBanner
                },
                {
                  path: 'create',
                  name: 'Add Sites',
                  component: CreateBanner
                }
              ]
            },
            {
              path: 'announcement',
              redirect: '/navApp/announcement/all',
              name: 'Announcement',
              component: {
                render(c) { return c('router-view') }
              },
              children: [
                {
                  path: 'all',
                  name: 'All Announcement',
                  component: ListAnnouncement
                },
                {
                  path: 'create',
                  name: 'Add Announcement',
                  component: CreateAnnouncement
                }
              ]
            },
            {
              path: 'promotion',
              redirect: '/navApp/promotion/all',
              name: 'Promotion',
              component: {
                render(c) { return c('router-view') }
              },
              children: [
                {
                  path: 'all',
                  name: 'All Promotion',
                  component: ListPromotion
                },
                {
                  path: 'create',
                  name: 'Add Promotion',
                  component: CreatePromotion
                }
              ]
            },
          ]
        },
        {
          path: 'jw',
          redirect: '/',
          name: 'JeetWin',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'posterAd',
              redirect: '/jw/posterAd/all',
              name: 'PosterAd',
              component: {
                render(c) { return c('router-view') }
              },
              children: [
                {
                  path: 'all',
                  name: 'All Poster Ad',
                  component: ListPosterAd
                },
                {
                  path: 'create',
                  name: 'Add Poster Ad',
                  component: CreatePosterAd
                }
              ]
            },
            {
              path: 'tournament',
              redirect: '/jw/tournament/all',
              name: 'Tournament',
              component: {
                render(c) { return c('router-view') }
              },
              children: [
                {
                  path: 'all',
                  name: 'All Tournament',
                  component: ListTournament
                },
                {
                  path: 'create',
                  name: 'Add Tournament',
                  component: CreateTournament
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
      ]
    }
  ]
})
