<template>
  <AppHeader fixed>
    <SidebarToggler class="d-lg-none" display="md" mobile />
      <b-link class="navbar-brand" to="#">
        <img class="navbar-brand-full" src="img/brand/logo.svg" width="89" height="25" alt="CoreUI Logo">
        <img class="navbar-brand-minimized" src="img/brand/sygnet.svg" width="30" height="30" alt="CoreUI Logo">
      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg" />
      <b-navbar-nav class="ml-auto">
        <HeaderDropDown/>
      </b-navbar-nav>
  </AppHeader>
</template>

<script>
import HeaderDropDown from './HeaderDropDown'
import { SidebarToggler, Header as AppHeader } from "@coreui/vue";

export default {
  components: {
    AppHeader,
    HeaderDropDown,
    SidebarToggler
  }  
}
</script>
