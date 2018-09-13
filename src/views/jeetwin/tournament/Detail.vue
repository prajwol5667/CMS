<template>
  <div class="card-body">
    <div id="accordion" role="tablist">
      <div class="card" v-for="(val, index) in detail" :key="index">
        <div class="card-header" id="headingOne" role="tab">
          <h5 class="mb-0">
            <a data-toggle="collapse" href="javascript:void(0)" aria-expanded="true" aria-controls="collapseOne">{{val.d_title}}</a>
          </h5>
        </div>
        <div class="collapse show" id="collapseOne" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion">
          <div class="card-body" v-html="val.d_description"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['detail'],
}
</script>

<style lang="scss" scoped>

</style>
