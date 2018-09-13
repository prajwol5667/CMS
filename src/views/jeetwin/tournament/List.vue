<template>
   <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header" class="mb-0">
            <span>All Tournament</span>
            <p-button type="info" class="float-right" @click.native="$router.push({path:'/jw/tournament/create'})">Add New</p-button>
          </div>
          <b-table :hover="true" responsive stacked="lg" :striped="false" :bordered="true" :small="false" :items="tournament" :fields="fields">
            <template slot="sn" slot-scope="data">
              {{data.index+1 + ((currentPage-1)*SIZE)}}
            </template>
            <template slot="image" slot-scope="data">
              <img :src="`${data.item.path}?auto=compress&w=200&h=100`">
            </template>
            <template slot="featured" slot-scope="data">
              <b-badge :variant="getBadge(data.item.featured)">{{ data.item.featured==='1'?'Featured':'Not Featured' }}</b-badge>
            </template>
            <template slot="start_date" slot-scope="data">
              {{ formatDate(data.item.start_date) }}
            </template>
            <template slot="end_date" slot-scope="data">
              {{ formatDate(data.item.end_date) }}
            </template>
            <template slot="enable_date" slot-scope="data">
              {{ formatDate(data.item.enable_date) }}
            </template>
            <template slot="disable_date" slot-scope="data">
              {{ formatDate(data.item.disable_date) }}
            </template>
            <template slot="status" slot-scope="data">
              <b-badge :variant="getBadge(data.item.status)">{{ data.item.status==='1'?'Enabled':'Disabled' }}</b-badge>
            </template>
            <template slot="action" slot-scope="data">
              <b-button-group>
                <p-button type="info" @click.native="getDetail(data.item.id)"><i class="icon-eye icons"></i></p-button>
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

    <b-modal ref="detail" size="lg" centered header-bg-variant="primary" hide-footer title="Tournament Detail" @hidden="clearDetail()">
      <TournamentDetail :detail="detail" v-if="detailStatus" @closemodal="updateList()"/>
    </b-modal>

    <b-modal ref="edit" size="lg" centered header-bg-variant="primary" hide-footer title="Update Tournament" @hidden="clearData()">
      <UpdateTournamentDetail :uId="updateId" :uData="updateData" v-if="updateModal" @closemodal="updateList()"/>
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
const moment = require('moment-timezone');

import TournamentDetail from "./Detail";
import UpdateTournamentDetail from "./Update";
import { PButton } from "../../../components/";

export default {
  name: 'TournamentManagement',
  data: () => {
    return {
      loader: false,
      tournament: [],
      updateId: '',
      updateData: {},
      updateModal: false,
      deleteId: '',
      fields: [
        {key:'sn',label:'SN'},
        {key:'title',label:'Tournament Title'},
        {key:'slug',label:'Tournament URL'},
        {key:'start_date',label:'Start Date'},
        {key:'end_date',label:'End Date'},
        {key:'enable_date',label:'Enable Date'},
        {key:'disable_date',label:'Disable Date'},
        {key:'featured',label:'Featured'},
        {key:'category',label:'Category'},
        {key:'image',label:'Tournament Image'},
        {key:'status',label:'Status'},
        {key:'action',label:'Action'},  
      ],
      count: 0,
      currentPage: 1,
      detail: [],
      detailStatus: false,
    }
  },
  components: {
    PButton,
    TournamentDetail,
    UpdateTournamentDetail
  },
  watch: {
    'currentPage': function (v) {
      this.getTournament(v)
    }
  },
  methods: {
    formatDate(date){
      if(date){
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
      }
      return ;
    },
    getTournament(page){
      this.$http.get(this.API_ENDPOINT+'/admin/tournament?page='+page+'&size='+this.SIZE).then(response => {
        this.tournament = response.data.data;
        this.count = response.data.rowCount;
      }).catch(err => {
        console.log(err.response);
        this.$notify.error({message:'Failed to fetch tournament list data.'});
      })
    },
    getBadge (status) {
      return status === '1' ? 'success' : 'danger'
    },
    getDetail(id){
      this.$http.get(this.API_ENDPOINT+'/admin/tournament/detail/'+id).then(response => {
        this.$refs.detail.show();
        this.detailStatus = true;
        this.detail = response.data;
      }).catch(err => {
        console.log(err.response)
        this.$notify.error({message:'something went wrong'})
      })
    },
    clearDetail(){
      this.$refs.detail.hide();
      this.detailStatus = false;
      this.detail = [];
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

      this.$http.delete(this.API_ENDPOINT+'/admin/tournament/'+id).then(response => {
        console.log(response.data);
        this.loader = false;
        this.$refs.confirm.hide();
        this.getTournament();
        this.$notify.success({message:'Tournament removed successfully'});
        if(response.data.message==='tournament.deleted.image.failed'){
          this.$notify.error({message:'Tournament image failed to remove.'});
        }else if(response.data.message==='tournament.deleted.tournament.detail.failed'){
          this.$notify.error({message:'Tournament detail failed to remove.'});
        }else if(response.data.message==='tournament.deleted.tournament.detail.failed.image.failed'){
          this.$notify.error({message:'Tournament detail & image failed to remove.'});
        }
      }).catch(err => {
        console.log(err.response);
        this.loader = false;
        this.$refs.confirm.hide();
        switch (err.response.data.message) {
          case 'tournament.no.exist':
            this.$notify.error({message: 'Tournament doesn\'t exist.'});
            break;
          default:
            this.$notify.error({message: 'Something went wrong.'})
            break;
        }
        this.$notify.error({message: 'unabled to delete'});
      })
    },
    edit(id){
      this.$http.get(this.API_ENDPOINT+'/admin/tournament/'+id).then(response => {
        this.$refs.edit.show();
        this.updateModal = true;
        this.updateId = id;
        this.updateData = response.data
      }).catch(err => {
        console.log(err.response);
        if(err.response.data.message==='tournament.no.exist'){
          this.$notify.error({message:'Tournament doesn\'t exist.'});
        }else{
          this.$notify.error({message:'error'});
        }
      })
    },
    updateList(){
      this.getTournament(this.currentPage);
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
    this.getTournament(1);
  }
}
</script>

<style lang="scss" scoped>

</style>
