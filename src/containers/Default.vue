<template>
  <div class="app">
    <AppHeader />
    <div class="app-body">
      <AppSidebar />
      <main class="main">
        <breadcrumb/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { Header as AppHeader, Sidebar as AppSidebar, Breadcrumb } from "../components/";

export default {
  name: 'full',
  components: {
    AppHeader,
    AppSidebar,
    Breadcrumb
  },  
}
</script>

<style lang="scss">
.nav-item.nav-dropdown{
  ul.nav-dropdown-items{
    margin-left: 10px;
  }
}
.sidebar .nav-dropdown.open{
  background: rgba(0, 0, 0, 0.5)
}
</style>

