<template>
  <div class="animated fadeIn">
     <b-row>
      <b-col sm="12">
        <b-card header="Add Sites">
          <form @submit.prevent="$v.$touch()">
            <b-row>
              <b-col md="6">
                <p-input label="Site Name" id="siteName" v-model="form.siteName" name="siteName" :handler="$v" :formData="form" placeholder="Site Name" type="text" @change.native="inputChange('siteName')"/>
              </b-col>
              <b-col md="6">
                <p-input label="Site URL" id="siteURL" v-model="form.siteURL" name="siteURL" :handler="$v" :formData="form" placeholder="Site URL" type="text" />
              </b-col>
              <b-col md="6">
                <p-input label="Site Description" id="siteDesc" v-model="form.siteDesc" name="siteDesc" :handler="$v" :formData="form" rows="10" type="editor" />
              </b-col>
              <b-col md="6">
                <b-form-group label="Upload Banner">
                  <croppa placeholder="Choose Image" @file-choose="addImage" v-model="image" ref="croppa"/>
                  <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.required">Image is required!</div>
                  <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.maxSize">Must be less than 500KB!</div>
                  <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.fileType">Must be an image!</div>
                </b-form-group>
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
import { PInput, PSwitch, PButton } from "../../../components/";

export default {
  name: 'CreateSites',
  data(){
    return {
      loading: false,
      image: {},
      form: {
        siteName: '',
        siteURL: '',
        siteDesc: '',
        status: 1,
        image: '',
        errorMessages: {
          siteName: {
            required: 'Site name is required',
            siteExist: 'Site Already exist',
            minLength: 'Site must be between 3 to 50 characters',
            maxLength: 'Site must be between 3 to 50 characters'
          },
          siteURL: {
            required: 'Site URL is required',
            // url: 'Must be valid URL'
          },
        },
        errorResponse: {
          siteName: {
            'site.exist': false
          }
        }
      }
    }
  },
  validations: {
    form: {
      siteName: { 
        required,
        minLength: minLength(3),
        maxLength: maxLength(50),
        siteExist(){
          return !this.form.errorResponse.siteName['site.exist']
        }
      },
      siteURL: { 
        required,
        // url
      },
      image: {
        required,
        maxSize: function(e){
          if(!e) return true;
          let inMB = ((e.size / 1000)).toFixed(2);
          return (inMB > 500) ? false : true;
        },
        fileType: function(e){
          if(!e) return true
          let type = e.type ? e.type.split('/')[0] : '';
          return (type!=='' && type==='image') ? true : false;
        }
      },
      siteDesc: {},
      status: {},
    }
  },
  components: {
    PInput,
    PSwitch,
    PButton
  },
  methods: {
    addImage(e){
      this.form.image = e
    },
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
        var formData = new FormData();
        formData.append('name', this.form.siteName);
        formData.append('site_url', this.form.siteURL);
        formData.append('image', this.form.image);
        formData.append('description', this.form.siteDesc);
        formData.append('status', this.form.status)
        this.$http.post(this.API_ENDPOINT+'/admin/sites', formData)
        .then((res) => {
          this.loading = false;
          
          this.$notify.success({message: 'Site added successfully.'});
          if(res.data.message==='site.added.image.failed'){
            this.$notify.error({message: 'Site Image failed to save.'});
          }
          
          this.form.siteName = '';
          this.form.siteURL = '';
          this.form.image = '';
          this.form.siteDesc = '';
          this.form.status = 1;
          this.image.remove();
          this.$v.$reset();
          
        }).catch(err => {
          console.log(err);
          this.loading = false;
          if(err.response.data.errors){
            if(err.response.data.errors.hasOwnProperty('name')){
              this.form.errorResponse.siteName['site.exist'] = true;
            }else{
              this.$notify.error({message: err.response.data.errors});
            }
          }else{
            switch(err.response.data.message){
              case 'image.required':
                this.$notify.error({message: 'Site Image is required.'});
                break;
              default:
                this.$notify.error({message: 'Something went wrong.'})
                break;
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
