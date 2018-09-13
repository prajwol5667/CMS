<template>
  <div class="d-block">
    <form @submit.prevent="$v.$touch()">
      <b-row>
        <b-col md="12">
          <p-input label="Primary Tag" id="primaryTag" v-model="form.primaryTag" name="primaryTag" :handler="$v" :formData="form" placeholder="Primary Tag" type="text"/>
        </b-col>
        <b-col md="12">
          <p-input label="Secondary Tag" id="secondaryTag" v-model="form.secondaryTag" name="secondaryTag" :handler="$v" :formData="form" placeholder="Secondary Tag" type="text" />
        </b-col>
        <b-col md="12">
          <p-input label="Action" id="action" v-model="form.action" name="action" :handler="$v" :formData="form" placeholder="Action" type="text" />
        </b-col>
        <b-col md="12">
          <p-input label="Order" id="order" v-model="form.order" name="order" :handler="$v" :formData="form" placeholder="Order" type="text" />
        </b-col>
        <b-col md="12">
          <b-form-group label="Upload Banner">
            <croppa placeholder="Choose Image" @file-choose="addImage" v-model="image" @image-remove="imageRemoved" ref="croppa"/>
            <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.required">Image is required!</div>
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
import { required, numeric, maxLength } from "vuelidate/lib/validators";
import { PInput, PSwitch, PButton } from "../../../components/";

export default {
  data: () => {
    return {
      image: {},
      loading: false,
      imageData: '',
      imageShow: false,
      form: {
        primaryTag: '',
        secondaryTag: '',
        order: 0,
        action: '',
        status: 1,
        image: '',
        errorMessages: {
          primaryTag: {
            required: "Primary Tag is required",
            maxLength: "Primary Tag should be less than 30 characters"
          },
          action: {
            required: 'Action is required'
          },
          order: {
            required: "Order is required",
            numeric: "Must be a number"
          },
          image: {
            required: "Image is required",
          }
        }
      }
    }
  },
  props: {
    uData: Object,
    uId: Number
  },
  validations: {
    form: {
      primaryTag: {
        required,
        maxLength: maxLength(30)
      },
      secondaryTag: {},
      order: { required, numeric },
      action: { required },
      status: {},
      image: {
        maxSize: function (e) {
          if(!e) return true;
          let inMB = ((e.size / 1000)).toFixed(2);
          return (inMB > 500) ? false : true;
        },
        fileType: function (e) {
          if(!e) return true;
          let type = e.type ? e.type.split('/')[0] : '';
          return (type!=='' && type==='image') ? true : false;
        }
      }
    }
  },
  components: {
    PInput,
    PSwitch,
    PButton
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
        formData.append('primary_tag', this.form.primaryTag)
        formData.append('secondary_tag', this.form.secondaryTag)
        formData.append('action', this.form.action)
        formData.append('order', this.form.order)
        formData.append('status', this.form.status)
        formData.append('image', this.form.image)

        this.$http.put(this.API_ENDPOINT+'/admin/carousel/'+this.uId, formData).then(response => {
          console.log(response.data)
          this.loading = false;
          this.$notify.success({message: 'Banner updated successfully'});
          if(response.data.message==='carousel.updated.image.failed'){
            this.$notify.warn({message: 'Banner image failed to update.'});
          }
          this.closeModal();
        }).catch(err => {
          console.log(err)
          this.loading = false;
          if(err.response.data.message==='carousel.no.exist'){
            this.$notify.error({message: 'Banner doesn\'t exist.'});
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
  created() {
    this.form.primaryTag = this.uData.primary_tag
    this.form.secondaryTag = this.uData.secondary_tag
    this.form.order = this.uData.order
    this.form.action = this.uData.action
    this.form.status = parseInt(this.uData.status)
    this.imageData = this.uData.path;
    this.imageShow = this.uData.path ? true : false;
  }
}
</script>
