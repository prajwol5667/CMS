<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header" class="mb-0">
            <span>All Promotion</span>
            <p-button type="info" class="float-right" @click.native="$router.push({path:'/navApp/promotion/create'})">Add New</p-button>
          </div>
          <b-table :hover="true" responsive stacked="lg" :striped="false" :bordered="true" :small="false" :items="promotion" :fields="fields">
            <template slot="sn" slot-scope="data">
              {{data.index+1 + ((currentPage-1)*SIZE)}}
            </template>
            <template slot="status" slot-scope="data">
              <b-badge :variant="getBadge(data.item.status)">{{ data.item.status==='1'?'Enabled':'Disabled' }}</b-badge>
            </template>
            <template slot="image" slot-scope="data">
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

    <b-modal ref="edit" size="lg" header-bg-variant="primary" hide-footer title="Update Promotion" @hidden="clearData()">
      <UpdatePromotion :uId="updateId" :uData="updateData" v-if="updateModal" @closemodal="updateList()"/>
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
import UpdatePromotion from "./Update";

export default {
  name: 'PromotionManagement',
  data: () => {
    return {
      loader: false,
      promotion: [],
      updateData: {},
      updateId: '',
      updateModal: false,
      fields: [
        {key:'sn', label:'SN'},
        {key:'siteName', label:'Site Name'},
        {key:'promoTitle', label:'Promotion Name'},
        {key:'promoSlug', label:'Promotion URL'},
        {key:'image', label:'Image'},
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
    UpdatePromotion
  },
  methods: {
    getPromotion(page){
      this.$http.get(this.API_ENDPOINT+'/admin/promotion?page='+page+'&size='+this.SIZE).then(response => {
        this.promotion = response.data.data;
        this.count = response.data.rowCount;
      }).catch(err => {
        console.log(err)
        this.$notify.error({message: 'Failed to fetch promotion list data.'})
      })
    },
    getBadge (status) {
      return status === '1' ? 'success' : 'danger'
    },
    edit(id){
      this.$http.get(this.API_ENDPOINT+'/admin/promotion/'+id).then(response => {
        this.$refs.edit.show();
        this.updateModal = true;
        this.updateId = id;
        this.updateData = response.data
      }).catch(err => {
        console.log(err.response)
        if(err.response.data.message==='promotion.no.exist'){
          this.$notify.error({message: 'Promotion does not exist.'});
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

      this.$http.delete(this.API_ENDPOINT+'/admin/promotion/'+id).then(response => {
        this.loader = false;
        this.$refs.confirm.hide();
        
        this.getPromotion(this.currentPage);
        this.$notify.success({message: 'Promotion removed successfully'})
        if(response.data.message==='promotion.deleted.image.failed'){
          this.$notify.error({message: 'Promotion image failed to remov.'})
        }
      }).catch(err => {
        console.log(err.response)
        this.loader = false;
        this.$refs.confirm.hide();

        switch (err.response.data.message) {
          case 'promotion.no.exist':
            this.$notify.error({message: 'Promotion does not exist'});
            break;
          default:
            this.$notify.error({message: 'Something went wrong.'})
            break;
        }
      })
    },
    updateList(){
      this.getPromotion(this.currentPage);
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
    this.getPromotion(1);
  }
}
</script>

<style lang="scss" scoped>

</style>
