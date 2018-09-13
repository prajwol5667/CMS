<template>
  <b-form-group
    :label="label" :label-for="id">
    <c-switch 
      class="mx-1" 
      color="primary" 
      variant="3d" 
      :value="1" 
      @change="change()"
      :uncheckedValue="0"
      v-model="state"
      :id="id"
      @blur.native="handler.form[name].$touch"
    />
    <div v-if="formHandle.$error">
      <div class="invalid-feedback d-block" v-for="error in errors" :key="error">{{ errorMessage[error] }}</div>
    </div>
  </b-form-group>
</template>

<script>
import { Switch as cSwitch } from '@coreui/vue'

export default {
  data: () => {
    return{
      state: ''
    }
  },
  components: {
    cSwitch
  },
  props: [
    'label',
    'id',
    'model',
    'name',
    'handler',
    'formData',
  ],
  model: {
    prop: 'model',
    event: 'updateModel'
  },
  created() {
    this.state = this.model
  },
  methods: {
    change(){
      this.$emit('updateModel', this.state);
    }
  },
  watch: {
    'model': function () {
      this.state = this.model
    }
  },
  computed: {
    errors: function(){
      return Object.getOwnPropertyNames(this.formHandle).filter(x => {
        return this.formHandle[x]===false&&x[0]!=='$';
      });
    },
    formHandle: function () {
      let data = this.name.split('.').reduce((acc, curr) => {
        return acc[curr];
      }, this.handler.form);
      return data;
    },
    errorMessage: function(){
      let data = this.name.split('.').reduce((acc, curr) => {
        return acc[curr];
      }, this.formData.errorMessages);
      return data;
    }
  }
}
</script>

<style>

</style>
