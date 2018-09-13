<template>
  <div class="animated fadeIn">
     <b-row>
      <b-col sm="12">
        <b-card header="Add Promotion">
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
import { PButton, PRadio, PInput, PSwitch, PDropdown } from "../../../components";

export default {
  name: 'CreatePromotion',
  data: () => {
    return {
      image: {},
      siteList: [],
      siteLoader: false,
      loading: false,
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
            slugExist: 'Promotion slug already exist',
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
        errorResponse: {
          promoSlug: {
            'slug.exist': false
          }
        }
      }
    }
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
        slugExist() {
          return !this.form.errorResponse.promoSlug['slug.exist']
        }
      },
      promoDesc: { required },
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
      this.form.image = e
    },
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

        var formData = new FormData();
        formData.append('site_id', this.form.siteId);
        formData.append('promoTitle', this.form.promoTitle);
        formData.append('promoSlug', this.form.promoSlug);
        formData.append('promoDesc', this.form.promoDesc);
        formData.append('image', this.form.image);
        formData.append('status', this.form.status);

        this.$http.post(this.API_ENDPOINT+'/admin/promotion', formData).then((res) => {
          this.loading = false;
          
          this.$notify.success({message: 'Promotion Created successfully'});
          if(res.data.message==='promotion.added.image.failed'){
            this.$notify.error({message: 'Promotion Image failed to save.'});
          }

          this.form.siteId = '',
          this.form.promoTitle = '',
          this.form.promoSlug = '',
          this.form.promoDesc = '',
          this.form.image = '',
          this.form.status = 1,
          this.image.remove();
          this.$v.$reset();

        }).catch(err => {
          console.log(err);
          this.loading = false;
          if(err.response.data.errors){
            if(err.response.data.errors.hasOwnProperty('promoSlug')){
              this.form.errorResponse.promoSlug['slug.exist'] = true;
            }else{
              this.$notify.error({message: err.response.data.errors})
            }
          }else{
            switch (err.response.data.message) {
              case 'image.required':
                this.$notify.error({message: 'Promotion Image is required.'})                
                break;
              default:
                this.$notify.error({message: 'Something went wrong.'});
                break;
            }
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
      console.log(err)
      this.$notify.error({message: 'could not fetch site list'});
      this.siteLoader = false
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
