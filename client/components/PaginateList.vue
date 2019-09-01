<template>
  <div
    class="pt-4 text-center container">
    <div
      v-if="params.showLoadMore"
      :class="{'btn-loading':params.isLoading}"
      class="btn btn-outline-primary px-5 mb-4"
      @click="params.loadMore"
    >
      <span class="px-4">Еще</span>
    </div>
    <paginate
      v-if="params.showPaginate"
      :value="params.page"
      :page-count="params.pages"
      :page-range="3"
      :margin-pages="1"
      :hide-prev-next="true"
      :container-class="'pagination'"
      :page-class="'page-item'"
      prev-class="d-none"
      next-class="d-none"
      @input="params.goPage($event)"
      @click.native="$sTB(60)"
    />
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'
export default {
  components: {
    Paginate
  },
  props: {
    params: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
</style>
