<template>
  <b-button :variant="type" class="btn" :disabled="loading || disabled">
    <i class="fa fa-circle-o-notch fa-lg mr-1 fa-spin" v-if="loading"></i>
    <slot></slot>
  </b-button>
</template>

<script>
export default {
  props: [
    'type',
    'disabled',
    'loading'
  ]
}
</script>
<style lang="scss" scoped>
.btn{
  margin-right: 10px;
}
</style>

