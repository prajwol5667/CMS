<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header" class="mb-0">
            <span>All Announcement</span>
            <p-button type="info" class="float-right" @click.native="$router.push({path:'/navApp/announcement/create'})">Add New</p-button>
          </div>
          <b-table :hover="true" responsive stacked="lg" :striped="false" :bordered="true" :small="false" :items="announcement" :fields="fields">
            <template slot="sn" slot-scope="data">
              {{data.index+1 + ((currentPage-1)*SIZE)}}
            </template>
            <template slot="status" slot-scope="data">
              <b-badge :variant="getBadge(data.item.status)">{{ data.item.status==='1'?'Enabled':'Disabled' }}</b-badge>
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

    <b-modal ref="edit" size="lg" header-bg-variant="primary" hide-footer title="Update Announcement" @hidden="clearData()">
      <UpdateAnnouncement :uId="updateId" :uData="updateData" v-if="updateModal" @closemodal="updateList()"/>
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
import UpdateAnnouncement from "./Update";

export default {
  name: 'AnnouncementManagement',
  data: () => {
    return {
      loader: false,
      announcement: [],
      updateData: {},
      updateId: '',
      updateModal: false,
      fields: [
        {key:'sn', label:'SN'},
        {key:'title', label:'Announcement Title'},
        {key:'description', label:'Description'},
        {key:'status', label:'Status'},
        {key:'action', label:'Action'},      
      ],
      count: 0,
      currentPage: 1,
      deleteId: ''
    }
  },
  components: {
    PButton,
    UpdateAnnouncement
  },
  watch: {
    'currentPage': function (v) {
      this.getAnnouncement(v)
    }
  },
  methods: {
    getAnnouncement(page){
      this.$http.get(this.API_ENDPOINT+'/admin/announcement?page='+page+'&size='+this.SIZE).then(response => {
        this.announcement = response.data.data;
        this.count = response.data.rowCount;
      }).catch(err => {
        console.log(err.response);
        this.$notify.error({message: 'Failed to fetch announcement data list.'});
      })
    },
    getBadge (status) {
      return status === '1' ? 'success' : 'danger'
    },
    edit(id){
      this.$http.get(this.API_ENDPOINT+'/admin/announcement/'+id).then(response => {
        this.$refs.edit.show();
        this.updateModal = true;
        this.updateId = id;
        this.updateData = response.data
      }).catch(err => {
        console.log(err);
        if(err.response.data.message==='announcement.no.exist'){
          this.$notify.error({message:'Announcement doesn\'t exist.'});
        }else{
          this.$notify.error({message:'Something went wrong.'});
        }
      })
    },
    confirm(id){
      this.$refs.confirm.show();
      this.deleteId = id;
    },
    cancelDelete(){
      this.$refs.confirm.hide();
      this.deleteId = '';
    },
    deleteSites(){
      let id = this.deleteId;
      this.loader = true;

      this.$http.delete(this.API_ENDPOINT+'/admin/announcement/'+id).then(response => {
        if(response.data.code==='success'){
          this.loader = false;
          this.$refs.confirm.hide();

          this.getAnnouncement(this.currentPage);
          this.$notify.success({message:'Announcement removed successfully'})
        }
      }).catch(err => {
        console.log(err);
        this.loader = false;
        this.$refs.confirm.hide();
        if(err.response.data.message==='announcement.no.exist'){
          this.$notify.error({message:'Announcement doesn\'t exist.'});
        }else{
          this.$notify.error({message:'Something went wrong.'});
        }
      })
    },
    updateList(){
      this.getAnnouncement(this.currentPage);
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
    this.getAnnouncement(1);
  }
}
</script>

<style lang="scss" scoped>

</style>
