<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header" class="mb-0">
            <span>All Poster Ad</span>
            <p-button type="info" class="float-right" @click.native="$router.push({path:'/jw/posterAd/create'})">Add New</p-button>
          </div>
          <b-table :hover="true" responsive stacked="lg" :striped="false" :bordered="true" :small="false" :items="posterAd" :fields="fields">
            <template slot="sn" slot-scope="data">
              {{data.index+1 + ((currentPage-1)*SIZE)}}
            </template>
            <template slot="type" slot-scope="data">
              <span v-if="data.item.type===0">Web</span>
              <span v-else>App</span>
            </template>
            <template slot="actionType" slot-scope="data">
              <span>{{ actionType(data.item.actionType) }}</span>
            </template>
            <template slot="action">

            </template>
            <template slot="background" slot-scope="data">
              <img :src="`${data.item.path}?auto=compress&w=200&h=100`">
            </template>
            <template slot="status" slot-scope="data">
              <b-badge :variant="getBadge(data.item.status)">{{ data.item.status==='1'?'Enabled':'Disabled' }}</b-badge>
            </template>
            <template slot="actionMethod" slot-scope="data">
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

    <b-modal ref="edit" size="lg" centered header-bg-variant="primary" hide-footer title="Update Poster Ad" @hidden="clearData()">
      <UpdatePosterAd :uId="updateId" :uData="updateData" v-if="updateModal" @closemodal="updateList()"/>
    </b-modal>

    <b-modal ref="confirm" size="sm" centered header-bg-variant="primary" hide-footer title="Alert" @hidden="deleteId=''">
      <div class="mb-3">
        Are you sure?
      </div>
      <p-button type="success" :loading="loader" @click.native="deletePoster()">Yes</p-button>
      <p-button type="outline-danger" @click.native="cancelDelete()">Cancel</p-button>
    </b-modal>
  </div>
</template>

<script>
import UpdatePosterAd from "./Update";
import { PButton } from "../../../components/";

export default {
  name: 'PosterAdManamgement',
  data: () => {
    return {
      loader: false,
      posterAd: [],
      updateId: '',
      updateData: {},
      updateModal: false,
      deleteId: '',
      fields: [
        {key:'sn', label:'SN'},
        {key:'type', label:'Type'},
        {key:'actionType', label:'Action Type'},
        {key:'action', label:'Action'},
        {key:'background', label:'Background Image'},
        {key:'status', label:'Status'},
        {key:'actionMethod', label:'Action Method'},
      ],
      count: 0,
      currentPage: 1,
    }
  },
  components: {
    PButton,
    UpdatePosterAd
  },
  watch: {
    'currentPage': function (v) {
      this.getPosterAd(v);
    }
  },
  methods: {
    actionType(val){
      switch (val) {
        case 0:
          return 'Launch URL'
        case 1:
          return 'Launch Game'
        case 2:
          return 'Open Promotion'
        case 3:
          return 'Launch URI'
        default:
          return ''
      }
    },
    getPosterAd(page){
      this.$http.get(this.API_ENDPOINT+'/admin/posterAd?page='+page+'&size='+this.SIZE).then(response => {
        this.posterAd = response.data.data;
        this.count = response.data.rowCount
      }).catch(err => {
        console.log(err.response);
        this.$notify.error({message:'Failed to fetch posterad data list.'})
      })
    },
    getBadge (status) {
      return status === '1' ? 'success' : 'danger'
    },
    cancelDelete(){
      this.$refs.confirm.hide();
      this.deleteId = '';
    },
    confirm (id) {
      this.$refs.confirm.show()
      this.deleteId = id
    },
    deletePoster(){
      let id = this.deleteId;
      this.loader = true;

      this.$http.delete(this.API_ENDPOINT+'/admin/posterAd/'+id).then(response => {
        console.log(response.data);
        this.loader = false;
        this.$refs.confirm.hide();
        this.getPosterAd();
        this.$notify.success({message:'PosterAd removed successfully'});
        if(response.data.message==='posterAd.deleted.image.failed'){
          this.$notify.error({message:'PosterAd image failed to remove.'});
        }
      }).catch(err => {
        console.log(err.response);
        this.loader = false;
        this.$refs.confirm.hide();
        if(err.response.data.message==='posterAd.no.exist'){
          this.$notify.error({message: 'Posterad doesn\'t exist'});
        }else{
          this.$notify.error({message: 'Something went wrong.'});
        }
      })
    },
    edit(id){
      this.$http.get(this.API_ENDPOINT+'/admin/posterAd/'+id).then(response => {
        this.$refs.edit.show();
        this.updateModal = true;
        this.updateId = id;
        this.updateData = response.data
      }).catch(err => {
        console.log(err)
        if(err.response.data.message==='posterAd.no.exist'){
          this.$notify.error({message:'PosterAd doesn\'t exist.'});
        }else{
          this.$notify.error({message:'Something went wrong.'})
        }
      })
    },
    updateList(){
      this.getPosterAd(this.currentPage);
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
    this.getPosterAd(1);
  }
}
</script>

<style lang="scss" scoped>

</style>
