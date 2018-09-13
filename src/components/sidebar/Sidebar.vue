<template>
  <AppSidebar fixed>
    <SidebarNav :navItems="nav"></SidebarNav>
    <SidebarMinimizer/>
  </AppSidebar>
</template>

<script>
import nav from '@/_nav'

import { Sidebar as AppSidebar, SidebarNav, SidebarMinimizer } from "@coreui/vue";
export default {
  data () {
    return {
      nav: nav.items
    }
  },
  components: {
    AppSidebar,
    SidebarNav,
    SidebarMinimizer
  }
}
</script>
