<template>
  <div class="animated fadeIn">
     <b-row>
      <b-col sm="12">
        <form @submit.prevent="$v.$touch()">
          <b-card header="Add Tournament">
            <b-row>
              <b-col md="6">
                <p-input label="Tournament Name" id="title" v-model="form.title" name="title" :handler="$v" :formData="form" placeholder="Tournament Name" type="text" @change.native="inputChange('title')"/>
              </b-col>
              <b-col md="6">
                <p-input label="Tournament Slug" id="slug" v-model="form.slug" name="slug" :handler="$v" :formData="form" placeholder="Tournament URL" type="text" disabled />
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
                  <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.required">Image is required!</div>
                  <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.maxSize">Must be less than 500KB!</div>
                  <div class="invalid-feedback d-block" v-if="$v.form.image.$error && !$v.form.image.fileType">Must be an image!</div>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <p-switch label="Is Featured" id="featured" v-model="form.featured" name="featured" :handler="$v" :formData="form"/>
              </b-col>
              <b-col md="6">
                <p-switch label="Status" id="status" v-model="form.status" name="status" :handler="$v" :formData="form"/>
              </b-col>
            </b-row>
          </b-card>
          <b-row>
            <b-col md="6" v-for="(value, index) in form.detail" :key="index">
              <b-card header="Tournament Details">
                <div slot="header" class="mb-0">
                  <span>Tournament Detail #{{index+1}}</span>
                  <p-button type="info" class="float-right" @click.native="removeDetail(index)">Remove</p-button>
                </div>
                <b-row>
                  <b-col md="4">
                    <b-form-group label="Order" label-for="order">
                      <b-form-input id="order" v-model.trim="value.order" placeholder="Order" />
                      <div class="invalid-feedback d-block" v-if="!$v.form.detail.$each[index].order.required">Order is required</div>
                      <div class="invalid-feedback d-block" v-if="!$v.form.detail.$each[index].order.numeric">Must be number</div>                    
                    </b-form-group>
                  </b-col>
                  <b-col md="8">
                    <b-form-group label="Title" label-for="title">
                      <b-form-input id="title" v-model.trim="value.title" placeholder="Title"/>
                      <div class="invalid-feedback d-block" v-if="!$v.form.detail.$each[index].title.required">Title is required</div>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group label="Description" label-for="description">
                      <vue-editor id="description" v-model="value.description" rows="3"/>
                      <!-- <b-form-textarea id="description" v-model.trim="value.description" placeholder="Description" rows="3"/> -->
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
                <p-button type="success" :loading="loading" @click.native="submit()">Save</p-button>
                <p-button type="danger">Cancel</p-button>   
              </b-col>
            </b-row>
          </b-card>
        </form>
      </b-col>
    </b-row><!--/.row-->
  </div>
</template>

<script>
import { required, minLength, maxLength, numeric } from "vuelidate/lib/validators";
import { PButton, PInput, PSwitch, PDatetime, PDropdown } from "../../../components";

export default {
  name: 'CreateTournament',
  data: () => {
    return {
      loading: false,
      categoryList: [
        {'value':'general', 'text': 'General Tournament'},
      ],
      image: {},
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
        },
        errorResponse: {
          title: {
            'tournament.exist': false
          }
        }
      }
    }
  },
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(100),
        titleExist(){
          return !this.form.errorResponse.title['tournament.exist']
        }
      },
      slug: { required },
      startDate: {},
      endDate: {},
      enableDate: { required },
      disableDate: { required },
      order: {},
      featured: {},
      category: { required },
      status: {},
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
  watch: {
    'form.title': function (val) {
      this.form.slug = val.replace(/[^a-zA-Z0-9]/g,'-').toLowerCase();
    }
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
    addDetail(){
     this.form.detail.push({
       order: '',
       title: '',
       description: ''
     })
    },
    removeDetail(index){
      this.form.detail.splice(index, 1);
    },
    submit(){
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

        this.$http.post(this.API_ENDPOINT+'/admin/tournament', formData).then((res) => {
          this.loading = false;

          this.$notify.success({message: 'Tournament created successfully'});
          if(res.data.message==='tournament.added.image.failed'){
            this.$notify.error({message: 'Tournament image failed to save.'});
          }else if(res.data.message==='tournament.added.tournamentdetail.failed'){
            this.$notify.error({message: 'Tournament detail failed to save.'});
          }else if(res.data.message==='tournament.added.tournamentdetail.failed.image.failed'){
            this.$notify.error({message: 'Tournament detail & Image failed to save.'});
          }

          this.form.title = '';
          this.form.slug = '';
          this.form.startDate = '';
          this.form.endDate = '';
          this.form.enableDate = '';
          this.form.disableDate = '';
          this.form.order = 0;
          this.form.category = 'general';
          this.form.featured = 0;
          this.form.status = 1;
          this.form.detail = [];
          this.form.image = '';
          this.image.remove();
          this.$v.$reset();
        }).catch(err => {
          console.log(err.response);
          this.loading = false;
          if(err.response.data.errors){
            if(err.response.data.errors.hasOwnProperty('title')){
              this.form.errorResponse.title['tournament.exist'] = true;
            }else{
              this.$notify.error({message: err.response.data.errors});
            }
          }else{
            switch (err.response.data.message) {
              case 'image.required':
                this.$notify.error({message: 'Tournament image is required..'});
                break;
              default:
                this.$notify.error({message: 'Something went wrong.'});
                break;
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
