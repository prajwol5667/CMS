<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card header="Add Banner">
          <form @submit.prevent="$v.$touch()">
            <b-row>
              <b-col md="6">
                <p-input label="Primary Tag" id="primaryTag" v-model="form.primaryTag" name="primaryTag" :handler="$v" :formData="form" placeholder="Primary Tag" type="text"/>
              </b-col>
              <b-col md="6">
                <p-input label="Secondary Tag" id="secondaryTag" v-model="form.secondaryTag" name="secondaryTag" :handler="$v" :formData="form" placeholder="Secondary Tag" type="text" />
              </b-col>
              <b-col md="6">
                <p-input label="Action" id="action" v-model="form.action" name="action" :handler="$v" :formData="form" placeholder="Action" type="text" />
              </b-col>
              <b-col md="6">
                <p-input label="Order" id="order" v-model="form.order" name="order" :handler="$v" :formData="form" placeholder="Order" type="text" />
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
import { required, numeric, maxLength } from "vuelidate/lib/validators";
import { PInput, PSwitch, PButton } from "../../../components/";

export default {
  data: () => {
    return {
      loading: false,
      image: {},
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
        required,
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
      this.form.image = e
    },
    submit(){
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

        this.$http.post(this.API_ENDPOINT+'/admin/carousel', formData).then((res) => {
          this.loading = false;

          this.$notify.success({message: 'Banner added successfully'})
          if(res.data.message==='carousel.added.image.failed'){
            this.$notify.error({message: 'Banner image failed to save.'})
          }

          this.form.primaryTag = '';
          this.form.secondaryTag = '';
          this.form.order = 0;
          this.form.action = '';
          this.form.status = 1;
          this.form.image = '';
          this.image.remove();
          this.$v.$reset();

        }).catch(err => {
          console.log(err);
          this.loading = false;
          if(err.response.data.message==='image.required'){
            this.$notify.error({message: 'Banner Image is required.'});
          }else{
            this.$notify.error({message: 'Something went wrong'});
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
