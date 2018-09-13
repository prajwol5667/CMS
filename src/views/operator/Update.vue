<template>
  <div class="d-block">
    <form @submit.prevent="$v.$touch()">
      <b-row>
        <b-col md="6">
          <p-input label="First Name" id="firstName" v-model="form.firstName" name="firstName" :handler="$v" :formData="form" placeholder="First Name" type="text"/>
        </b-col>
        <b-col md="6">
          <p-input label="Last Name" id="lastName" v-model="form.lastName" name="lastName" :handler="$v" :formData="form" placeholder="Last Name" type="text" />
        </b-col>
        <b-col md="6">
          <p-input label="Username" id="username" v-model="form.username" name="username" :handler="$v" :formData="form" placeholder="Username" type="text"/>
        </b-col>
        <b-col md="6">
          <p-input label="Password" id="password" v-model="form.password" name="password" :handler="$v" :formData="form" placeholder="Password" type="password" />
        </b-col>
        <b-col md="12">
          <p-switch label="Status" id="status" v-model="form.status" name="status" :handler="$v" :formData="form"/>
        </b-col>
        <b-col md="12">
          <p-button type="success" :loading="loading" @click.native="update()">Update</p-button>
          <p-button type="danger" @click.native="closeModal">Cancel</p-button>   
        </b-col>
      </b-row><!--/.row-->
    </form>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { PInput, PSwitch, PButton } from "../../components/";

export default {
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
        },
      }
    }
  },
  props: {
    uData: Object,
    uId: Number
  },
  validations: {
    form: {
      firstName: { required },
      lastName: { required },
      username: { required },
      password: {},
      status: {}
    }
  },
  components: {
    PInput,
    PButton,
    PSwitch
  },
  methods: {
    update(){
      this.$v.form.$touch();
      if(this.$v.form.$error){
        return true;
      }else{
        this.loading = true;

        var formData = {
          email: '',
          username: this.form.username,
          first_name: this.form.firstName,
          last_name: this.form.lastName,
          status: this.form.status 
        }
        if(this.form.password!==''){
          formData = {
            password: this.form.password,
            ...formData
          }
        }

        this.$http.put(this.API_ENDPOINT+'/admin/member/admin/'+this.uId, formData).then(res => {
          this.loading = false;
          this.$notify.success({message: 'Operator updated successfully'});
          this.closeModal();
        }).catch(err => {
          this.loading = false;
          if(err.response.data.message==='admin.no.exist'){
            this.$notify.error({message: 'Operator doesn\'t exist.'});
          }else{
            this.$notify.error({message: 'Something went wrong.'})
          }
        })
      }
    },
    closeModal(){
      this.$emit('closemodal');
    }
  },
  created(){
    this.form.firstName =  this.uData.first_name;
    this.form.lastName =  this.uData.last_name;
    this.form.username =  this.uData.username;
    this.form.status = parseInt(this.uData.status);
  }
}
</script>
