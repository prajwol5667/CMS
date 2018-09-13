<template>
  <div class="animated fadeIn">
     <b-row>
      <b-col sm="12">
        <b-card header="Add Sites">
          <form @submit.prevent="$v.$touch()">
            <b-row>
              <b-col md="6">
                <p-input label="First Name" id="firstName" v-model="form.firstName" name="firstName" :handler="$v" :formData="form" placeholder="First Name" type="text"/>
              </b-col>
              <b-col md="6">
                <p-input label="Last Name" id="lastName" v-model="form.lastName" name="lastName" :handler="$v" :formData="form" placeholder="Last Name" type="text" />
              </b-col>
              <b-col md="6">
                <p-input label="Username" id="username" v-model="form.username" name="username" :handler="$v" :formData="form" placeholder="Username" type="text" @change.native="inputChange('username')"/>
              </b-col>
              <b-col md="6">
                <p-input label="Password" id="password" v-model="form.password" name="password" :handler="$v" :formData="form" placeholder="Password" type="password" />
              </b-col>
              <b-col md="12">
                <p-switch label="Status" id="status" v-model="form.status" name="status" :handler="$v" :formData="form"/>
              </b-col>
              <b-col md="12">
                <p-button type="success" :loading="loading" @click.native="submit()">Save</p-button>
                <p-button type="danger">Cancel</p-button>   
              </b-col>
            </b-row>
          </form>
        </b-card>
      </b-col>
    </b-row><!--/.row-->
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { PInput, PSwitch, PButton } from "../../components/";

export default {
  name: 'addOperator',
  data: () => {
    return {
      loading: false,
      form: {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        status: 1,
        errorMessages: {
          firstName: {
            required: 'First Name is required.'
          },
          lastName: {
            required: 'Last Name is required.',
          },
          username: {
            required: 'Username is required',
            usernameExist: 'Username already taken.'
          },
          password: {
            required: 'Password is required'
          }
        },
        errorResponse: {
          username: {
            'username.exist': false
          }
        }
      }
    }
  },
  validations: {
    form: {
      firstName: { required },
      lastName: { required },
      username: {
        required,
        usernameExist(){
          return !this.form.errorResponse.username['username.exist']
        }
      },
      password: { required },
      status: {}
    }
  },
  components: {
    PInput,
    PButton,
    PSwitch
  },
  methods: {
    inputChange (name) {
      Object.keys(this.form.errorResponse[name]).forEach((key) => {
        this.form.errorResponse[name][key] = false
      })
    },
    submit(){
      this.$v.form.$touch();
      if(this.$v.form.$error){
        return true;
      }else{
        this.loading = true;
        this.$http.post(this.API_ENDPOINT + '/admin/member/admin/register', {
          email: '',
          username: this.form.username,
          password: this.form.password,
          first_name: this.form.firstName,
          last_name: this.form.lastName,
          status: this.form.status
        }).then(res => {
          this.loading = false;

          this.$notify.success({message: 'Operator added successfully'});

          this.form.firstName =  '';
          this.form.lastName =  '';
          this.form.username =  '';
          this.form.password =  '';
          this.form.status =  1;
          this.$v.$reset();
        }).catch(err => {
          this.loading = false;
          if(err.response.data.errors){
            if(error.response.data.errors.hasOwnProperty('username')){
              this.form.errorResponse.title['title.exist'] = true;
            }else{
              this.$notify.error({message: err.response.data.errors});
            }
          }else{
            this.$notify.error({message: 'Something went wrong.'});
          }
        })
      }
    }
  }
}
</script>
