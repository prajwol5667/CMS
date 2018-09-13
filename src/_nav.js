export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'primary',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: 'Components',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: 'Operator',
      url: '/operator/all',
      icon: 'fa fa-users',
      children: [
        {
          name: 'Operator List',
          url: '/operator/all',
          icon: 'fa fa-users'
        },
        {
          name: 'Add Operator',
          url: '/operator/create',
          icon: 'fa fa-user-plus'
        }
      ]
    },
    {
      name: 'Navigation App',
      url: '/navApp',
      icon: 'fa fa-cubes',
      children: [
        {
          name: 'Sites',
          url: '/navApp/sites',
          icon: 'fa fa-sitemap',
          children: [
            {
              name: 'All Sites',
              url: '/navApp/sites/all',
              icon: 'fa fa-sitemap',
            },
            {
              name: 'Add Site',
              url: '/navApp/sites/create',
              icon: 'fa fa-plus'
            }
          ]
        },
        {
          name: 'Banner',
          url: '/navApp/banner',
          icon: 'fa fa-image',
          children: [
            {
              name: 'Banner List',
              url: '/navApp/banner/all',
              icon: 'fa fa-image'
            },
            {
              name: 'Add Banner',
              url: '/navApp/banner/create',
              icon: 'fa fa-plus'
            }
          ]
        },
        {
          name: 'Announcement',
          url: '/navApp/announcement',
          icon: 'fa fa-bullhorn',
          children: [
            {
              name: 'Announcement List',
              url: '/navApp/announcement/all',
              icon: 'fa fa-bullhorn'
            },
            {
              name: 'Add Announcement',
              url: '/navApp/announcement/create',
              icon: 'fa fa-plus'
            }
          ]
        },
        {
          name: 'Promotion',
          url: '/navApp/promotion',
          icon: 'fa fa-gift',
          children: [
            {
              name: 'Promotion List',
              url: '/navApp/promotion/all',
              icon: 'fa fa-gift'
            },
            {
              name: 'Add Promotion',
              url: '/navApp/promotion/create',
              icon: 'fa fa-plus'
            }
          ]
        },
      ]
    },
    {
      name: 'JeetWin',
      url: '/jw',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Poster Ad',
          url: '/jw/posterAd',
          icon: 'fa fa-image',
          children: [
            {
              name: 'All Poster Ad',
              url: '/jw/posterAd/all',
              icon: 'fa fa-image'
            },
            {
              name: 'Create Poster Ad',
              url: '/jw/posterAd/create',
              icon: 'fa fa-plus'
            }
          ]
        },
        {
          name: 'Tournament',
          url: '/jw/tournament',
          icon: 'icon-diamond',
          children: [
            {
              name: 'All Tournament',
              url: '/jw/tournament/all',
              icon: 'icon-puzzle'
            },
            {
              name: 'Create Tournament',
              url: '/jw/tournament/create',
              icon: 'icon-puzzle'
            }
          ]
        }
      ]
    }
  ]
}
