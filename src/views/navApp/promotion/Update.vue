<template>
  <div class="d-block">
    <form @submit.prevent="$v.$touch()">
      <b-row>
        <b-col md="12">
          <p-dropdown v-model="form.siteId" name="siteId" label="Select Site" :loading="siteLoader" :formData="form" :handler="$v" id="siteId" :options="siteList"/>
        </b-col>
        <b-col md="6">
          <p-input label="Promotion Name" id="promoTitle" v-model="form.promoTitle" name="promoTitle" :handler="$v" :formData="form" placeholder="Promotion Name" type="text"/>
        </b-col>
        <b-col md="6">
          <p-input label="Promotion Slug" id="promoSlug" v-model="form.promoSlug" name="promoSlug" :handler="$v" :formData="form" placeholder="promotion name to url" type="text" @change.native="inputChange('promoSlug')" disabled/>
        </b-col>
        <b-col md="12">
          <p-input label="Description" id="promoDesc" v-model="form.promoDesc" name="promoDesc" :handler="$v" :formData="form" rows="10" type="editor" />
        </b-col>
        <b-col md="12">
          <b-form-group label="Upload Image">
            <croppa placeholder="Choose Image" @file-choose="addImage" v-model="image" @image-remove="imageRemoved" ref="croppa"/>
            <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.maxSize">Must be less than 500KB!</div>
            <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.fileType">Must be an image!</div>
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
          <p-button type="danger" @click.native="closeModal">Cancel</p-button>   
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { PButton, PRadio, PInput, PSwitch, PDropdown } from "../../../components";

export default {
  data: () => {
    return {
      image: {},
      loading: false,
      imageData: '',
      imageShow: false,
      siteLoader: false,
      siteList: [],
      form: {
        siteId: '',
        promoTitle: '',
        promoSlug: '',
        promoDesc: '',
        image: '',
        status: 1,
        errorMessages: {
          siteId: {
            required: 'Please select site'
          },
          promoTitle: {
            required: 'Please enter promotion name',
            minLength: 'Promotion title must be between 3 to 50 characters',
            maxLength: 'Promotion title must be between 3 to 50 characters',
          },
          promoSlug: {
            required: 'Slug is required'
          },
          promoDesc: {
            required: 'Description is required'
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
      siteId: { required },
      promoTitle: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      },
      promoSlug: {
        required,
      },
      promoDesc: { required },
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
  watch: {
    'form.promoTitle': function (v) {
      this.form.promoSlug = v.replace(/[^a-zA-Z0-9]/g,'-').toLowerCase();
    }
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
        formData.append('site_id', this.form.siteId);
        formData.append('promoTitle', this.form.promoTitle);
        formData.append('promoSlug', this.form.promoSlug);
        formData.append('promoDesc', this.form.promoDesc);
        formData.append('image', this.form.image);
        formData.append('status', this.form.status);

        this.$http.put(this.API_ENDPOINT+'/admin/promotion/'+this.uId, formData).then((res) => {
          this.loading = true;
          this.$notify.success({message: 'Promotion updated successfully'});
          if(res.data.message==='promotion.updated.image.failed'){
            this.$notify.success({message: 'Promotion Image failed to update.'});
          }
          this.closeModal();
        }).catch(err => {
          console.log(err);
          this.loading = false;
          if(err.response.data.message==='promotion.no.exist'){
            this.$notify.error({message: 'Promotion doesn\'t exist..'})
          }else{
            this.$notify.error({message: 'Something went wrong.'})
          }
        })
      }
    },
    closeModal(){
      this.$emit('closemodal')
    }
  },
  created(){
    this.siteLoader = true;
    this.$http.get(this.API_ENDPOINT+'/admin/sites').then(response => {
      this.siteLoader = false;
      console.log(response.data)
      this.siteList = response.data.data.map(r => {
        return {'value':r.id, 'text':r.name}
      })
    }).catch(err => {
      console.log(err);
      this.siteLoader = false;
      this.$notify.error({message: 'Failed to fetch Site list.'})
    })

    this.form.siteId =  this.uData.site_id;
    this.form.promoTitle =  this.uData.promoTitle;
    this.form.promoSlug =  this.uData.promoSlug;
    this.form.promoDesc =  this.uData.promoDesc;
    this.form.status =  parseInt(this.uData.status);
    this.imageData = this.uData.path;
    this.imageShow = this.uData.path ? true : false;
  }
}
</script>

<style lang="scss" scoped>

</style>
