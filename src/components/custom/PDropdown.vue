<template>
   <b-form-group>
      <label :for="id">{{label}}</label>
      <div class="relative">
        <b-form-select :id="id"
          :plain="true"
          v-model="state"
          @input="change"
          :disabled="loading"
          :options="options">
        </b-form-select>
        <i class="fa fa-circle-o-notch fa-lg mr-1 fa-spin spinnerloader" v-if="loading"></i>
      </div>
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
    'label',
    'id',
    'options',
    'model',
    'name',
    'handler',
    'formData',
    'selected',
    'loading'
  ],
  model: {
    prop: 'model',
    event: 'updateModel'
  },
  created() {
    this.state = this.model;
  },
  methods: {
    change() {
      this.$emit('updateModel', this.state);
      this.$emit('change')
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

<style lang="scss" scoped>
.relative{
  position: relative;
}
.spinnerloader{
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
}
</style>