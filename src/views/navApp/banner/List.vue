<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header" class="mb-0">
            <span>All Banner</span>
            <p-button type="info" class="float-right" @click.native="$router.push({path:'/navApp/banner/create'})">Add New</p-button>
          </div>
          <b-table :hover="true" responsive stacked="lg" :striped="false" :bordered="true" :small="false" :items="banner" :fields="fields">
            <template slot="sn" slot-scope="data">
              {{data.index+1 + ((currentPage-1)*SIZE)}}
            </template>
            <template slot="status" slot-scope="data">
              <b-badge :variant="getBadge(data.item.status)">{{ data.item.status==='1'?'Enabled':'Disabled' }}</b-badge>
            </template>
            <template slot="image" slot-scope="data">
              <img :src="`${data.item.path}?auto=compress&w=200&h=200`">
            </template>
            <template slot="action" slot-scope="data">
              <b-button-group>
                <p-button type="warning" @click.native="edit(data.item.id)"><i class="icon-pencil icons"></i></p-button>
                <p-button type="danger" @click.native="confirm(data.item.id)"><i class="icon-trash icons"></i></p-button>
              </b-button-group>
            </template>
          </b-table>
          <nav>
            <b-pagination :total-rows="count" :per-page="this.SIZE" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
          </nav>
        </b-card>
      </b-col>
    </b-row>

    <b-modal ref="edit" size="lg" header-bg-variant="primary" hide-footer title="Update Banner" @hidden="clearData()">
      <UpdateBanner :uId="updateId" :uData="updateData" v-if="updateModal" @closemodal="updateList()"/>
    </b-modal>

    <b-modal ref="confirm" size="sm" centered header-bg-variant="primary" hide-footer title="Alert" @hidden="deleteId=''">
      <div class="mb-3">
        Are you sure?
      </div>
      <p-button type="success" :loading="loader" @click.native="deleteSites()">Yes</p-button>
      <p-button type="outline-danger" @click.native="cancelDelete">Cancel</p-button>
    </b-modal>
  </div>
</template>

<script>
import { PButton } from "../../../components/";
import UpdateBanner from "./Update";

export default {
  name: 'BannerManagement',
  data: () => {
    return {
      loader: false,
      banner: [],
      updateData: {},
      updateId: '',
      updateModal: false,
      fields: [
        {key:'sn', label:'SN'},
        {key:'primary_tag', label:'Primary Tag'},
        {key:'secondary_tag', label:'Secondary Tag'},
        {key:'image', label:'Image'},
        {key:'status', label:'Status'},
        {key:'action', label:'Action'},
      ],
      count: 0,
      currentPage: 1,
      deleteId: '',
    }
  },
  components: {
    PButton,
    UpdateBanner
  },
  watch:{
    'currentPage': function (v) {
      this.getBanner(v)
    }
  },
  methods: {
    getBanner(page){
      this.$http.get(this.API_ENDPOINT+'/admin/carousel?page='+page+'&size='+this.SIZE).then(response => {
        this.banner = response.data.data
        this.count = response.data.rowCount
      }).catch(err => {
        console.log(err.response);
        this.$notify.error({message: 'Failed to fetch banner list data.'})
      })
    },
    getBadge (status) {
      return status === '1' ? 'success' : 'danger'
    },
    edit(id){
      this.$http.get(this.API_ENDPOINT+'/admin/carousel/'+id).then(response => {
        this.$refs.edit.show();
        this.updateModal = true;
        this.updateId = id;
        this.updateData = response.data
      }).catch(err => {
        console.log(err);
        if(err.response.data.message==='carousel.no.exist'){
          this.$notify.error({message: 'Banner doesn\'t exist.'});
        }else{
          this.$notify.error({message: 'Something went wrong.'})
        }
      })
    },
    confirm(id) {
      this.$refs.confirm.show()
      this.deleteId = id
    },
    cancelDelete () {
      this.$refs.confirm.hide()
      this.deleteId = '';
    },
    deleteSites(){
      let id = this.deleteId;
      this.loader = true;

      this.$http.delete(this.API_ENDPOINT+'/admin/carousel/'+id).then(response => {
        if(response.data.code==='success'){
          this.loader = false;
          this.$refs.confirm.hide();
          
          this.getBanner(this.currentPage);

          this.$notify.success({message: 'Banner removed successfully'});
          if(response.data.message==='carousel.deleted.image.failed'){
            this.$notify.warn({message: 'Banner Image failed to remove.'})
          }
        }
      }).catch(err => {
        console.log(err);
        this.loader = false;
        this.$refs.confirm.hide();
        switch (err.response.data.message) {
          case 'carousel.no.exist':
            this.$notify.error({message: 'Banner does not exist.'});            
            break;
          default:
            this.$notify.error({message: 'Something went wrong.'});
            break;
        }
      })
    },
    updateList(){
      this.getBanner(this.currentPage);
      this.clearData();
    },
    clearData(){
      this.$refs.edit.hide();
      this.updateModal = false;
      this.updateId = '';
      this.updateData = {};
    }
  },
  created(){
    this.getBanner(1);
  }
}
</script>

<style scoped>

</style>
