<template>
  <div class="d-block">
    <form @submit.prevent="$v.$touch()">
        <b-row>
          <b-col md="6">
            <p-input label="Tournament Name" id="title" v-model="form.title" name="title" :handler="$v" :formData="form" placeholder="Tournament Name" type="text"/>
          </b-col>
          <b-col md="6">
            <p-input label="Tournament Slug" id="slug" v-model="form.slug" name="slug" :handler="$v" :formData="form" placeholder="Tournament URL" type="text"/>
          </b-col>
          <b-col md="6">
            <PDatetime label="Start Date" id="startDate" v-model="form.startDate" name="startDate" :handler="$v" :formData="form" placeholder="Start Date" type="datetime"/>
          </b-col>
          <b-col md="6">
            <PDatetime label="End Date" id="endDate" v-model="form.endDate" name="endDate" :handler="$v" :formData="form" placeholder="End Date" type="datetime"/>
          </b-col>
          <b-col md="6">
            <PDatetime label="Enable Date" id="enableDate" v-model="form.enableDate" name="enableDate" :handler="$v" :formData="form" placeholder="Enable Date" type="datetime"/>
          </b-col>
          <b-col md="6">
            <PDatetime label="Disable Date" id="disableDate" v-model="form.disableDate" name="disableDate" :handler="$v" :formData="form" placeholder="Disable Date" type="datetime"/>
          </b-col>
          <b-col md="6">
            <p-input label="Order" id="order" v-model="form.order" name="order" :handler="$v" :formData="form" placeholder="Order" type="text"/>
          </b-col>
          <b-col md="6">
            <p-dropdown v-model="form.category" name="category" label="Select Category" :formData="form" :handler="$v" id="category" :options="categoryList"/>
          </b-col>
          <b-col md="12">
            <b-form-group label="Tournament Image">
              <croppa placeholder="Choose Image" @file-choose="addImage" v-model="image" ref="croppa"/>
              <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.maxSize">Must be less than 500KB!</div>
              <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.fileType">Must be an image!</div>
            </b-form-group>
            <div v-if="imageData && imageShow">
              <img :src="imageData" alt="" width="100%">
            </div>
          </b-col>
          <b-col md="6">
            <p-switch label="Is Featured" id="featured" v-model="form.featured" name="featured" :handler="$v" :formData="form"/>
          </b-col>
          <b-col md="6">
            <p-switch label="Status" id="status" v-model="form.status" name="status" :handler="$v" :formData="form"/>
          </b-col>
        </b-row>
      <b-row>
        <b-col md="12" v-for="(value, index) in form.detail" :key="index">
          <b-card header="Tournament Details">
            <div slot="header" class="mb-0">
              <span>Tournament Detail #{{index+1}}</span>
              <p-button type="info" class="float-right" @click.native="removeDetail(index)">Remove</p-button>
            </div>
            <b-row>
              <b-col md="12">
                <b-form-group label="Order" label-for="order">
                  <b-form-input id="order" v-model.trim="value.order" placeholder="Order" />
                  <div class="invalid-feedback d-block" v-if="!$v.form.detail.$each[index].order.required">Order is required</div>
                  <div class="invalid-feedback d-block" v-if="!$v.form.detail.$each[index].order.numeric">Must be number</div>                    
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group label="Title" label-for="title">
                  <b-form-input id="title" v-model.trim="value.title" placeholder="Title"/>
                  <div class="invalid-feedback d-block" v-if="!$v.form.detail.$each[index].title.required">Title is required</div>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group label="Description" label-for="description">
                  <vue-editor id="description" v-model="value.description" rows="3"/>
                  <div class="invalid-feedback d-block" v-if="!$v.form.detail.$each[index].description.required">Description is required</div>
                </b-form-group>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col md="12">
          <b-card>
            <p-button type="info" @click.native="addDetail()">Add Tournament Detail</p-button>
          </b-card>
        </b-col>
      </b-row>
      <b-card>
        <b-row>
          <b-col md="12">
            <p-button type="success" :loading="loading" @click.native="update()">Update</p-button>
            <p-button type="danger" @click.native="closeModal">Cancel</p-button>   
          </b-col>
        </b-row>
      </b-card>
    </form>
  </div>
</template>

<script>
import { required, numeric } from "vuelidate/lib/validators";
import { PButton, PInput, PSwitch, PDatetime, PDropdown } from "../../../components";

export default {
  data: () => {
    return {
      image: {},
      loading: false,
      imageData: '',
      imageShow: false,
      categoryList: [
        {'value':'general', 'text': 'General Tournament'},
      ],
      form: {
        title: '',
        slug: '',
        startDate: '',
        endDate: '',
        enableDate: '',
        disableDate: '',
        order: 0,
        category: 'general',
        featured: 0,
        status: 1,
        detail: [],
        image: '',
        errorMessages: {
         title: {
            required: "Tournament Name is required",
            titleExist: "Tournament already exist"
          },
          slug: {
            required: "Tournament Slug is required",
          },
          category: {
            required: "Please select tournament category"
          },
          enableDate: {
            required: 'Enable Date is required'
          },
          disableDate: {
            required: 'Disable Date is required'
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
      title: { required },
      slug: { required },
      startDate: {},
      endDate: {},
      enableDate: {},
      disableDate: {},
      order: {},
      featured: {},
      category: { required },
      status: {},
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
      detail: {
        $each: {
          order: { required, numeric },
          title: { required },
          description: { required }
        }
      }
    }
  },
  components: {
    PButton,
    PSwitch,
    PInput,
    PDatetime,
    PDropdown
  },
  methods: {
    addImage(e){
      this.form.image = e
      this.imageShow = e ? false : true
    },
    imageRemoved(){
      this.imageShow = true;
    },
    removeDetail(index){
      this.form.detail.splice(index, 1);
    },
    addDetail(){
      this.form.detail.push({
       order: '',
       title: '',
       description: ''
     })
    },
    update(){
      this.$v.form.$touch();
      if(this.$v.form.$error){
        return true;
      }else{
        this.loading = true;

        var formData = new FormData();
        formData.append('title', this.form.title);
        formData.append('slug', this.form.slug);
        formData.append('start_date', this.form.startDate);
        formData.append('end_date', this.form.endDate);
        formData.append('enable_date', this.form.enableDate);
        formData.append('disable_date', this.form.disableDate);
        formData.append('order', this.form.order);
        formData.append('category', this.form.category);
        formData.append('featured', parseInt(this.form.featured));
        formData.append('status', parseInt(this.form.status));
        formData.append('detail', JSON.stringify(this.form.detail));
        formData.append('image', this.form.image);

        this.$http.put(this.API_ENDPOINT+'/admin/tournament/'+this.uId, formData).then((response) => {
          this.loading = false;

          this.$notify.success({message:'Tournament updated successfully'});
          if(response.data.message==='tournament.updated.image.failed'){
            this.$notify.error({message:'Tournament image failed to update.'});
          }else if(response.data.message==='tournament.updated.tournamentdetail.failed'){
            this.$notify.error({message:'Tournament detail failed to update.'});
          }else if(response.data.message==='tournament.updated.tournamentdetail.failed.image.failed'){
            this.$notify.error({message:'Tournament detail & image failed to update.'});
          }
          this.closeModal();
        }).catch(err => {
          console.log(err.response);
          this.loading = false;
          if(err.response.data.message==='tournament.no.exist'){
            this.$notify.error({message:'Tournament doesn\'t exist.'});
          }else{
            this.$notify.error({message:'Something went wrong.'})
          }
        })
      }
    },
    closeModal(){
      this.$emit('closemodal');
    }
  },
  created(){
    // console.log(this.uData.start_date, this.uData.start_date.substring(0, 19).replace('T', ' '));
    this.form.title = this.uData.title;
    this.form.slug = this.uData.slug;
    this.form.startDate = this.uData.start_date;
    this.form.endDate = this.uData.end_date;
    this.form.enableDate = this.uData.enable_date;
    this.form.disableDate = this.uData.disable_date;
    this.form.order = this.uData.order;
    this.form.category = this.uData.category;
    this.form.featured = parseInt(this.uData.featured);
    this.form.status = parseInt(this.uData.status);
    this.imageData = this.uData.path;
    this.imageShow = this.uData.path ? true : false; 
    this.form.detail = this.uData.detail.map(x => {
      return {
        order: x.d_order,
        title: x.d_title,
        description: x.d_description
      }
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
