<template>
  <div class="animated fadeIn">
     <b-row>
      <b-col sm="12">
        <b-card header="Add Announcement">
          <form @submit.prevent="$v.$touch()">
            <b-row>
              <b-col md="6">
                <p-dropdown v-model="form.site_id" name="site_id" label="Select Site" :loading="siteLoader" :formData="form" :handler="$v" id="site_id" :options="siteList"/>
              </b-col>
              <b-col md="6">
                <p-input label="Announcement Title" id="title" v-model="form.title" name="title" :handler="$v" :formData="form" placeholder="Announcement Title" type="text" @change.native="inputChange('title')"/>
              </b-col>
              <b-col md="12">
                <p-input label="Description" id="description" v-model="form.description" name="description" :handler="$v" :formData="form" rows="10" type="editor" />
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
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { PButton, PRadio, PInput, PSwitch, PDropdown } from "../../../components";

export default {
  name: 'CreateAnnouncement',
  data: () => {
    return {
      loading: false,
      siteLoader: false,
      siteList: [],
      form: {
        site_id: '',
        title: '',
        description: '',
        status: 1,
        errorMessages: {
          site_id: {
            required: 'Please Select Site'
          },
          title: {
            required: 'Title is required',
            titleExist: 'Title Already exist',
            minLength: 'Title must be between 3 to 100 characters.',
            maxLength: 'Title must be between 3 to 100 characters.'
          },
          description: {
            required: 'Description is required'
          }
        },
        errorResponse: {
          title: {
            'title.exist': false
          }
        }
      }
    }
  },
  validations: {
    form: {
      site_id: { required },
      title: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(100),
        titleExist(){
          return !this.form.errorResponse.title['title.exist']
        }
      },
      description: { required },
      status: {}
    }
  },
  components: {
    PButton,
    PRadio,
    PSwitch,
    PInput,
    PDropdown
  },
  methods: {
    inputChange(name){
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
        this.$http.post(this.API_ENDPOINT+'/admin/announcement', {
          site_id: this.form.site_id,
          title: this.form.title,
          description: this.form.description,
          status: this.form.status,
        }).then(() => {
          this.loading = false;
          this.$notify.success({message: 'Announcement created successfully'})

          this.form.site_id =  '';
          this.form.title =  '';
          this.form.description =  '';
          this.form.status = 1;
          this.$v.$reset();
        }).catch(err => {
          console.log(err);
          this.loading = false;
          if(err.response.data.errors){
            if(err.response.data.errors.hasOwnProperty('title')){
              this.form.errorResponse.title['title.exist'] = true;
            }else{
              this.$notify.error({message: err.response.data.errors});
            }
          }else{
            this.$notify.error({message: 'Something went wrong.'})
          }
        })
      }
    }
  },
  created(){
    this.siteLoader = true;
    this.$http.get(this.API_ENDPOINT+'/admin/sites').then(response => {
      this.siteLoader = false;
      this.siteList = response.data.data.map(r => {
        return {'value':r.id, 'text':r.name}
      })
    }).catch(err => {
      console.log(err);
      this.siteLoader = false;
      this.$notify.error({message:'Failed to fetch site list data.'})
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
