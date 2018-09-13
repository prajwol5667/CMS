<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <h1>JW CMS</h1>
                <p class="text-muted">Sign In to your account</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                  <b-form-input 
                    :state="$v.form.username.$error?false:null"
                    v-model.trim="form.username" 
                    placeholder="Username" 
                    type="text" 
                    @keyup.enter.native="login"
                    @blur.native="$v.form.username.$touch"></b-form-input>
                    <div class="invalid-feedback d-block" v-if="$v.form.username.$error && !$v.form.username.required">Username is required!</div>
                    <div class="invalid-feedback d-block" v-if="invalidCred">Username or Password is incorrect!</div>
                </b-input-group>
                <b-input-group class="mb-3">
                  <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                  <b-form-input 
                    :state="$v.form.password.$error?false:null"
                    v-model.trim="form.password" 
                    placeholder="Password" 
                    type="password" 
                    @keyup.enter.native="login"
                    @blur.native="$v.form.password.$touch"></b-form-input>
                    <div class="invalid-feedback d-block" v-if="$v.form.password.$error && !$v.form.password.required">Password is required!</div>
                    <div class="invalid-feedback d-block" v-if="invalidCred">Username or Password is incorrect!</div>
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <p-button type="primary" :loading="loading" @click.native="login()">Login</p-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { PButton } from "../../components/";
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      invalidCred: false,
      form: {
        username: '',
        password: ''
      }
    }
  },
  validations: {
    form: {
      username: {required},
      password: {required}
    }
  },
  components:{
    PButton
  },
  methods: {
    login(){
      if(this.$v.$invalid){
        this.$v.$touch();
      }else{
        this.loading = true;
        let body = { 
          username: this.form.username,
          password: this.form.password
        }
        this.$http.post(this.API_ENDPOINT+'/admin/auth/login/admin', body, { headers: {'Content-Type': 'application/json'} }).then(res => {
          this.loading = false;
          window.sessionStorage.setItem('user', JSON.stringify(res.data.user));
          this.$router.push({path:'/'})
        }).catch(err => {
          this.loading = false;
          if(err.response.data.error[0]==='invalid.username.password'){
            this.invalidCred = true
          }else if(err.response.data.error[0]==='account.deactivated'){
            this.$notify.error({message: 'Account is deactivated'});
          }else{
            this.$notify.error({message: err.response.data.error[0]});
          }
        })
      }
    }
  }
}
</script>
