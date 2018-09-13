<template>
  <b-form-group
    :label="label"
    :label-for="id"
    :horizontal="inlineform">
    <b-form-radio-group
      :id="id"
      :name="name">
      <div class="custom-control custom-radio" :class="{'custom-control-inline': inlineinput}" v-for="v in radioData" :key="v.key">
        <input v-model="state" type="radio" :id="'customRadio'+name+v.key" :name="name" class="custom-control-input" :value="v.key" @change="change()">
        <label class="custom-control-label" :for="'customRadio'+name+v.key">{{ v.value }}</label>
      </div>
    </b-form-radio-group>
    <div v-if="formHandle.$error">
      <div class="invalid-feedback d-block" v-for="error in errors" :key="error">{{ errorMessage[error] }}</div>
    </div>
  </b-form-group>
</template>

<script>
export default {
  data: () => {
    return {
      state: '',
    }
  },
  props: [
    'label',
    'radioData',
    'name',
    'id',
    'inlineform',
    'model',
    'handler',
    'formData',
    'disabled',
    'inlineinput'
  ],
  model: {
    prop: 'model',
    event: 'updateModel'
  },
  created(){
    this.state = this.model;
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

<style lang="scss" scoped>

</style>
