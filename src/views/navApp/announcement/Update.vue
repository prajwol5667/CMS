<template>
  <div class="d-block">
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
          <p-button type="success" :loading="loading" @click.native="update()">Update</p-button>
          <p-button type="danger" @click.native="closeModal">Cancel</p-button>   
        </b-col>
      </b-row><!--/.row-->
    </form>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { PButton, PRadio, PInput, PSwitch, PDropdown } from "../../../components";

export default {
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
          },
          description: {
            required: 'Description is required'
          }
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
      site_id: { required },
      title: {
        required,
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
    update(){
      this.$v.form.$touch();
      if(this.$v.form.$error){
        return true;
      }else{
        this.loading = true;

        this.$http.put(this.API_ENDPOINT+'/admin/announcement/'+this.uId, {
          site_id: this.form.site_id,
          title: this.form.title,
          description: this.form.description,
          status: this.form.status,
        }).then(() => {
          this.loading = false;
          this.$notify.success({message:'Announcement updated successfully'});
          this.closeModal();
        }).catch(err => {
          console.log(err);
          this.loading = false; 
          if(err.response.data.message==='announcement.no.exist'){
            this.$notify.error({message: 'Announcement doesn\'t exist.'});
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

    this.form.site_id = this.uData.site_id;
    this.form.title = this.uData.title;
    this.form.description = this.uData.description;
    this.form.status = parseInt(this.uData.status)
  }
}
</script>

<style lang="scss" scoped>

</style>
