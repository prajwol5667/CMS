<template>
  <div class="d-block">
    <b-row>
      <b-col md="12">
        <p-input label="Site Name" id="siteName" v-model="form.siteName" name="siteName" :handler="$v" :formData="form" placeholder="Site Name" type="text" @change="inputChange('siteName')"/>
      </b-col>
      <b-col md="12">
        <p-input label="Site URL" id="siteURL" v-model="form.siteURL" name="siteURL" :handler="$v" :formData="form" placeholder="Site URL" type="text" />
      </b-col>
      <b-col md="12">
        <p-input label="Site Description" id="siteDesc" v-model="form.siteDesc" name="siteDesc" :handler="$v" :formData="form" rows="10" type="editor" />
      </b-col>
      <b-col md="12">
        <b-form-group label="Upload Banner">
          <croppa placeholder="Choose Image" v-model="image" @file-choose="addImage" @image-remove="imageRemoved" ref="croppa"/>
          <div class="invalid-feedback d-block" v-if="$v.form.image.$error && $v.form.image.maxSize">Must be less than 500KB!</div>
          <div class="invalid-feedback d-block" v-if="$v.form.image.$error && $v.form.image.fileType">Must be an image!</div>
        </b-form-group>

        <div v-if="imageData && imageShow">
          <img :src="imageData" alt="" width="100%">
        </div>
      </b-col>
      <b-col md="12">
        <p-switch label="Status" id="status" v-model="form.status" name="status" :handler="$v" :formData="form"/>
      </b-col>
      <b-col md="12">
        <p-button type="success" :loading="loading" @click.native="update()">Update</p-button>
        <p-button type="danger" @click.native="closeModal()">Cancel</p-button>   
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { PInput, PSwitch, PButton } from "../../../components/";

export default {
  data: () => {
    return {
      image: {},
      loading: false,
      imageData: '',
      imageShow: true,
      form:{
        siteName: '',
        siteURL: '',
        siteDesc: '',
        status: 1,
        image: '',
        errorMessages: {
          siteName: {
            required: 'Site name is required',
            minLength: 'Site must be between 3 to 50 characters',
            maxLength: 'Site must be between 3 to 50 characters'
          },
          siteURL: {
            required: 'Site URL is required',
            // url: 'Must be valid URL'
          },
        },
      },
    }
  },
  props: {
    uData: Object,
    uId: Number
  },
  validations: {
    form: {
      siteName: { 
        required,
        minLength: minLength(3),
        maxLength: maxLength(50),
      },
      siteURL: { 
        required,
        // url
      },
      image: {
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
    PButton,
    PInput,
    PSwitch,
  },
  methods: {
    addImage(e){
      this.imageShow = e ? false : true
      this.form.image = e;
    },
    imageRemoved(){
      this.imageShow = true;
    },
    update(){
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
        formData.append('status', this.form.status);
        
        this.$http.put(this.API_ENDPOINT+'/admin/sites/'+ this.uId, formData).then(response => {
          this.loading = false
          this.$notify.success({message: 'Site updated successfully'})
          if(response.data.message==='site.updated.image.failed'){
            this.$notify.warn({message: 'Site Image failed to update'})            
          }
          this.closeModal();
        }).catch(err => {
          this.loading = false;
          if(err.response.data.message==='site.no.exist'){
            this.$notify.error({message: 'Site Doesn\'t exist.'})
          }else{
            this.$notify.error({message: 'Something went wrong.'});
          }
        })
      }
    },
    closeModal(){
      this.$emit('closemodal')
    }
  },
  created(){
    this.form.siteName = this.uData.name
    this.form.siteURL = this.uData.site_url
    this.form.siteDesc = this.uData.description
    this.form.status = parseInt(this.uData.status);
    this.imageData = this.uData.path
    this.imageShow = this.uData.path ? true : false
  }
}
</script>
