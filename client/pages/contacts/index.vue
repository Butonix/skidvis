<template>
  <div>
    <div class="container mb-5">
      <h5 class="mb-2">
        Мои организации
      </h5>
      <search-input
        autofocus="autofocus"
        :value="search"
        @input="setSearch"
      />
    </div>

    <div class="container container--long-offset">
      <div class="row">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="col-lg-4 mb-5"
        >
          <div class="card w-100">
            <router-link :to="{ name: 'management.organizations.edit', params: { id: item.id } }" class="card-img-top d-block">
              <div class="embed-responsive embed-responsive-1by1">
                <div class="embed-responsive-item">
                  <img :src="item.logo.src" class="w-100 h-100 img-cover" alt="Card image cap">
                </div>
              </div>
            </router-link>
            <div class="card-body">
              <div class="d-flex justify-content-around mb-4">
                <a href="#" class="btn btn-gray btn-sm px-4">Точки</a>
                <a href="#" class="btn btn-gray btn-sm px-4">Акции</a>
              </div>
              <p class="card-text pt-3" v-text="item.description"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SearchInput from '~/components/SearchInput'

export default {
  middleware: 'auth',
  components: {
    SearchInput
  },
  computed: {
    ...mapGetters({
      search: 'organizations/getSearch',
      items: 'organizations/getItems'
    })
  },
  methods: {
    ...mapActions({
      setSearch: 'organizations/setSearch'
    })
  }

}
</script>

<style>
</style>
