<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header" class="mb-0">
            <span>All Sites</span>
            <p-button type="info" class="float-right" @click.native="$router.push({path:'/navApp/sites/create'})">Add New</p-button>
          </div>
          <b-table :hover="true" responsive stacked="lg" :striped="false" :bordered="true" :small="false" :items="sites" :fields="fields">
            <template slot="sn" slot-scope="data">
              {{data.index+1 + ((currentPage-1)*SIZE)}}
            </template>
            <template slot="status" slot-scope="data">
              <b-badge :variant="getBadge(data.item.status)">{{ data.item.status==='1'?'Enabled':'Disabled' }}</b-badge>
            </template>
            <template slot="logo" slot-scope="data">
              <img :src="`${data.item.path}?auto=compress&w=100&h=100`">
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

    <b-modal ref="edit" size="lg" header-bg-variant="primary" hide-footer title="Update Sites" @hidden="clearData()">
      <UpdateSites :uId="updateId" :uData="updateData" v-if="updateModal" @closemodal="updateList()"/>
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
import UpdateSites from "./Update";

export default {
  name: 'SitesManagement',
  data: () => {
    return {
      loader: false,
      sites: [],
      updateData: {},
      updateId: '',
      updateModal: false,
      fields: [
        {key:'sn', label: 'SN'},
        {key:'name', label: 'Site Name'},
        {key:'site_url', label: 'Site URL'},
        {key:'logo', label:'Logo'},
        {key:'status', label:'Status'},
        {key:'action', label:'Action'}
      ],
      count: 0,
      currentPage: 1,
      deleteId: '',
    }
  },
  components: {
    PButton,
    UpdateSites
  },
  watch:{
    'currentPage': function (v) {
      this.getSites(v)
    }
  },
  methods: {
    getSites(page){
      this.$http.get(this.API_ENDPOINT+'/admin/sites?page='+page+'&size='+this.SIZE).then(response => {
        this.sites = response.data.data
        this.count = response.data.rowCount
      }).catch(err => {
        console.log(err.response)
        this.$notify.error({message: 'Failed to fetch site list data.'})
      })
    },
    getBadge (status) {
      return status === '1' ? 'success' : 'danger'
    },
    edit(id){
      this.$http.get(this.API_ENDPOINT+'/admin/sites/'+id).then(response => {
        this.$refs.edit.show();
        this.updateModal = true;
        this.updateId = id;
        this.updateData = response.data
      }).catch(err => {
        console.log(err.response)
        if(err.response.data.message==='site.no.exist'){
          this.$notify.error({message: 'Site does not exist.'});
        }else{
          this.$notify.error({message: 'Something went wrong.'});          
        }
      })
    },
    cancelDelete () {
      this.$refs.confirm.hide()
      this.deleteId = '';
    },
    confirm(id) {
      this.$refs.confirm.show()
      this.deleteId = id
    },
    deleteSites(){
      let id = this.deleteId
      this.loader = true;

      this.$http.delete(this.API_ENDPOINT+'/admin/sites/'+id).then(response => {
        this.loader = false;
        this.$refs.confirm.hide();
        
        this.getSites(this.currentPage);

        this.$notify.success({message: 'Site removed successfully'});
        if(response.data.message==='site.deleted.image.failed'){
          this.$notify.warn({message: 'Site Image failed to remove.'})
        }

      }).catch(err => {
        this.loader = false;
        this.$refs.confirm.hide()
        switch (err.response.data.message) {
          case 'site.no.exist':
            this.$notify.error({message: 'Site does not exist'});
            break;
          default:
            this.$notify.error({message: 'Something went wrong.'})
            break;
        }
      })
    },
    updateList(){
      this.getSites(this.currentPage);
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
    this.getSites(1);
  }
}
</script>

<style scoped>

</style>
