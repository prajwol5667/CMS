<template>
  <div class="animated fadeIn">
     <b-row>
      <b-col sm="12">
        <b-card header="Add Poster Ad">
          <form @submit.prevent="$v.$touch()">
            <b-row>
              <b-col md="6">
                <p-radio v-model="form.type" name="type" label="Type" id="type" :inlineform="false" :inlineinput="true" :radioData="typeRadio" :formData="form" :handler="$v"/>
              </b-col>
              <b-col md="6">
                <p-input label="Order" id="order" v-model="form.order" name="order" :handler="$v" :formData="form" placeholder="Order" type="text"/>
              </b-col>
              <b-col md="12">
                <p-radio v-model="form.actionType" name="actionType" label="Action Type" id="actionType" :inlineform="false" :inlineinput="true" :radioData="actionTypeRadio" :formData="form" :handler="$v" />
              </b-col>
              <b-col md="12">
                <p-dropdown v-model="form.action" name="action" label="Select Game" :loading="gameloader" :formData="form" :handler="$v" id="games" :options="gameList" v-if="form.actionType===1"/>
                <p-dropdown v-model="form.action" name="action" label="Select Promotion" :loading="promoloader" :formData="form" :handler="$v" id="promotion" :options="promoList" v-else-if="form.actionType===2"/>
                <p-input label="Action" id="action" v-model="form.action" name="action" :handler="$v" :formData="form" :placeholder="form.actionType===0 ? 'Web URL' : 'URI'" type="text" v-else />
              </b-col>
              <b-col md="12">
                <p-input label="Button Code" id="button" v-model="form.button" name="button" :handler="$v" :formData="form" type="textarea"/>
              </b-col>
              <b-col md="12">
                <p-input label="CSS" id="css" v-model="form.css" name="css" :handler="$v" :formData="form" type="textarea"/>
              </b-col>
              <b-col md="12">
                <b-form-group label="Upload Background">
                  <croppa placeholder="Choose Image" @file-choose="addImage" v-model="image" ref="croppa"/>
                  <div class="invalid-feedback d-block" v-if="$v.form.background.$error && !$v.form.background.required">Background Image is required!</div>
                  <div class="invalid-feedback d-block" v-if="$v.form.background.$error && !$v.form.background.maxSize">Must be less than 500KB!</div>
                  <div class="invalid-feedback d-block" v-if="$v.form.background.$error && !$v.form.background.fileType">Must be an image!</div>
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
import { required } from "vuelidate/lib/validators";
import { PButton, PRadio, PInput, PSwitch, PDropdown } from "../../../components";

export default {
  name: 'CreatePosterAd', 
  data: () => {
    return {
      image: {},
      gameList: [],
      promoList: [],
      gameloader: false,
      promoloader: false,
      typeRadio: [
        { key: '0', value: "Web"},
        { key: '1', value: "APP"},
      ],
      actionTypeRadio: [
        { key: '0', value: 'Launch URL' },
        { key: '1', value: 'Launch Game' },
        { key: '2', value: 'Promotion URL' },
        { key: '3', value: 'Launch URI' }
      ],
      loading: false,
      form: {
        type: '0',
        order: '0',
        actionType: 0,
        status: 1,
        background: '',
        action: '',
        gameId: '',
        gameKindId: '',
        brand: '',
        button: '',
        css: '',
        errorMessages: {
          type: {
            required: "Please Select Type"
          },
          actionType: {
            required: 'Please select actionType'
          },
          action: {
            required: 'Please Enter action'
          },
          order: {
            required: "Please enter the order"
          }
        }
      }
    }
  },
  validations: {
    form: {
      type: { required },
      order: { required },
      actionType: { required },
      background: { 
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
      action: {
        required
      },
      button: {},
      css: {},
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
  watch:{
    'form.actionType': function (v) {
      var val = parseInt(v);
      this.form.actionType = val;
      this.actionType(val);
    }
  },
  methods: {
    addImage(e){
      this.form.background = e
    },
    actionType(v){
      if(v===1){
        if(Object.keys(this.gameList).length === 0) {
          this.gameloader = true;
          this.$http.post(this.API_ENDPOINT+'/service/v1/game/getGame?gameStatus=1&withTag=1').then(res => {
            this.gameloader = false;          
            let gamesList = res.data.map(x => {
              let val = `${x.GameId} | ${x.GameName} | ${x.Brand} | ${x.GameKindId}`
              return {'value':val, 'text':x.GameName}
            })
            this.gameList = gamesList
          }).catch(err => {
            this.gameloader = false;
            this.$notify.error({message: 'Failed to fetch game list from JeetWin'});
            console.log(err.response);
          });
        }
      } else if(v===2){
        if(Object.keys(this.promoList).length === 0) {
          this.promoloader = true
          this.$http.post(this.API_ENDPOINT+'/service/v1/promotion/getInfo?device=0').then(res => {
            this.promoloader = false;          
            let promotionList = res.data.map(x => {
              return {'value':x.Name, 'text':x.Name}
            })
            console.log(promotionList)
            this.promoList = promotionList
          }).catch(err => {
            this.promoloader = false;
            this.$notify.error({message: 'Failed to fetch promotion list from JeetWin'});
            console.log(err.response);
          });
        }
      }else{
        console.log('none');
      }
    },
    submit(){
      this.$v.form.$touch();
      if(this.$v.form.$error){
        return true;
      }else{
        this.loading = true;
        
        if(this.form.actionType===1){
          let arr = this.form.action.split(' | ');
          this.form.gameId = arr[0];
          this.form.action = arr[1];
          this.form.brand = arr[2];
          this.form.gameKindId = arr[3];
        }

        var formData = new FormData();
        formData.append('type', this.form.type)
        formData.append('order', this.form.order)
        formData.append('actionType', this.form.actionType)
        formData.append('status', this.form.status)
        formData.append('background', this.form.background)
        formData.append('css', this.form.css)
        formData.append('button', this.form.button)
        formData.append('action', this.form.action)
        formData.append('brand', this.form.brand)
        formData.append('gameId', this.form.gameId)
        formData.append('gameKindId', this.form.gameKindId)
        
        this.$http.post(this.API_ENDPOINT+'/admin/posterAd', formData).then((res) => {
          this.loading = false;

          this.$notify.success({message: 'PosterAd created successfully'})
          if(res.data.message==='posterAd.added.image.failed'){
            this.$notify.error({message: 'PosterAd background image failed to save.'});
          }

          this.image.remove();
          this.form.type = '0';
          this.form.order = '0';
          this.form.actionType = 0;
          this.form.status = 1;
          this.form.background = '';
          this.form.action = '';
          this.form.gameId = '';
          this.form.gameKindId = '';
          this.form.brand = '';
          this.form.button = '';
          this.form.css = '';
          this.image.remove();
          this.$v.$reset();

        }).catch(err => {
          console.log(err);
          this.loading = false;
          switch (err.response.data.message) {
            case 'background.required':
              this.$notify.error({message: "PosterAd Background image is required."});
              break;
            default:
              this.$notify.error({message: "Something went wrong"});
              break;
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
