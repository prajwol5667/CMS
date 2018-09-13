<template>
  <b-form-group
    :label="label"
    :label-for="id"
  >
    <b-form-textarea 
      :id="id"
      :value="model"
      @input="input()"
      v-model.trim="state"
      :state="handler.form[name].$error?false:null"
      @blur.native="handler.form[name].$touch"
      :rows="rows?rows:3"
      :max-rows="0"
      :disabled="disabled"
      v-if="type==='textarea'"
    />
    <vue-editor 
      :id="id"
      :value="model"
      @input="input()"
      v-model.trim="state"
      :state="handler.form[name].$error?false:null"
      @blur.native="handler.form[name].$touch"
      :rows="rows?rows:3"
      :max-rows="0"
      v-else-if="type==='editor'"
    />
    <b-form-input 
      :id="id"
      :value="model" 
      @input="input()"
      v-model.trim="state"
      :placeholder="placeholder" 
      :type="type"
      :state="handler.form[name].$error?false:null"
      @blur.native="handler.form[name].$touch"
      v-else
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
    'label',
    'type',
    'id',
    'placeholder',
    'model',
    'name',
    'handler',
    'formData',
    'disabled',
    'rows'
  ],
  model: {
    prop: 'model',
    event: 'updateModel'
  },
  created() {
    this.state = this.model;
  },
  methods: {
    input() {
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
