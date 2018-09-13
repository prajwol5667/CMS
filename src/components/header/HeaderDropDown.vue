<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      {{ username }}
      <img
        src="img/avatars/6.jpg"
        class="img-avatar"
        alt="admin@bootstrapmaster.com" />
    </template>
    <template slot="dropdown">
      <b-dropdown-item @click="logout()"><i class="fa fa-lock" /> Logout</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    AppHeaderDropdown
  },
  data: () => {
    return {
      username: ''
    }
  },
  methods: {
    logout(){
      this.$http.get(this.API_ENDPOINT+'/admin/auth/logout').then(res => {
        this.$router.go('/')
      }).catch(err => {
        console.log(err.response);
        this.$notify.error({message: 'Some Error'})
      })
    }
  },
  created(){
    if(window.sessionStorage.getItem('user')){
      let user = JSON.parse(window.sessionStorage.getItem('user'))
      this.username = user.username
    }
  }
}
</script>
