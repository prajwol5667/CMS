<template>
  <b-form-group
    :label="label"
    :label-for="id"
  >
    <datetime
      class="datetime-wrapper"
      :id="id"
      :value="model"
      @input="input()"
      v-model.trim="state"
      @blur.native="handler.form[name].$touch"
      :type="type"
      :placeholder="placeholder"
      input-class="form-control"
      :format="getFormat()"
      :phrases="{ok: 'Set', cancel: 'Cancel'}"
      use12-hour
      auto
      :disabled="disabled"
    />
    <div v-if="formHandle.$error">
      <div class="invalid-feedback d-block" v-for="error in errors" :key="error">{{ errorMessage[error] }}</div>
    </div>
  </b-form-group>
</template>

<script>
export default {
  data: () => {
    return {
      state: ''
    }
  },
  props: [
    'type',
    'label',
    'id',
    'model',
    'name',
    'handler',
    'formData',
    'disabled',
    'placeholder'
  ],
  model: {
    prop: 'model',
    event: 'updateModel'
  },
  created(){
    console.log(this.model);
    this.state = this.model;
  },
  methods: {
    input(){
      this.$emit('updateModel', this.state);
    },
    getFormat(){
      if(this.type==='date'){
        return 'yyyy-MM-dd'
      }else{
        return 'yyyy-MM-dd HH:mm:ss'
      }
    }
  },
  watch: {
    'model': function () {
      console.log(this.state);
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


<style lang="scss">
.datetime-wrapper{
  .vdatetime-popup{
    position: absolute;
    top: 30px;
    left: 0;
    transform: translate(0, 0);
  }
}
</style>

<style lang="scss" scoped>
.datetime-wrapper{
  position: relative;
}
</style>
