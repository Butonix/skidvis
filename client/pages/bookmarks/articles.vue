<template>
  <div>
    <div class="container mb-5">
      <search-input
        v-model="artes.urlQuery.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
    </div>
    <div
      v-if="artesItems[0]">
      <div
        class="container blog__container--long-offset position-relative">
        <div :class="{'active': artesIsLoading}"
             class="loading-list"
        />
        <div class="row">
          <card
            v-for="(item, index) in artesItems"
            :key="'article-'+index"
            :article="item"
            class="col-md-6 col-lg-4"
          />
        </div>
      </div>
      <paginate-list
        :params="artesParams"
      />
    </div>
    <div v-else class="text-center py-5">
      <h5 class="mb-4">
        Пусто
      </h5>
      <h5>
        Чтобы отложить статью,<br> кликаем по иконке закладки
      </h5>
      <flag :active="bookmarksActive" :title="(bookmarksActive)?'Удалить из закладок':'Добавить в закладоки'" class-box="mb-5 simple"
            @click="bookmarksActive = !bookmarksActive"
      />
      <p>
        Сохраняем закладки,<br> даже если не зарегистрировались
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BuildList from '~/mixins/list'
import { getFavicon } from '~/utils'
import axios from 'axios'

const globalNamespace = 'artes'

const List = BuildList({
  axios,
  globalNamespace,
  apiUrl: 'articles',
  pathResponse: 'list.data',
  pathTotal: 'list.total',
  allowedParams: ['whereIn'],
  apiQuery: {
    ordering: 'created_at',
    orderingDir: 'desc'
  },
  urlQuery: {
    perPage: 12
  },
  buildWatchers ({ beforeTypes, getWatcher, gN }) {
    return {
      'bookmarks': async function (v) {
        if (!this.check) {
          this.$set(this[gN].apiQuery, 'responseTypeId', 3)
          if (v.length === 0) {
            this.$set(this[gN].apiQuery, 'whereIn', [0])
          } else {
            this.$set(this[gN].apiQuery, 'whereIn', [...v])
          }
        } else {
          this.$set(this[gN].apiQuery, 'responseTypeId', 1)
          if (this[gN].apiQuery.whereIn) {
            this.$delete(this[gN].apiQuery, 'whereIn')
          }
        }
        await getWatcher({ type: beforeTypes.SEARCH }).call(this)
      },
      'check': async function (v) {
        if (v) {
          this.$set(this[gN].apiQuery, 'responseTypeId', 1)
          this[gN].apiUrl = 'user/bookmarks'
          if (this[gN].apiQuery.whereIn) {
            this.$delete(this[gN].apiQuery, 'whereIn')
          }
        } else {
          this.$set(this[gN].apiQuery, 'responseTypeId', 3)
          this[gN].apiUrl = 'articles'
          if (this.bookmarks.length === 0) {
            this.$set(this[gN].apiQuery, 'whereIn', [0])
          } else {
            this.$set(this[gN].apiQuery, 'whereIn', [...this.bookmarks])
          }
        }
        await getWatcher({ type: beforeTypes.SEARCH }).call(this)
      }
    }
  }
})

export default {
  components: {
    'PaginateList': () => import('~/components/PaginateList'),
    'Flag': () => import('~/components/Flag'),
    'SearchInput': () => import('~/components/SearchInput'),
    'Card': () => import('~/components/Blog/Card')
  },
  mixins: [List.mixin],
  head () {
    return {
      title: this.$route.meta.title,
      bodyAttrs: {
        class: 'theme-blog'
      },
      ...getFavicon()
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let check = app.store.getters['auth/check']
    let bookmarks = app.store.getters['auth/bookmarks']
    let data

    if (check) {
      data = await List.getStartData({
        error,
        query,
        defaultData: {
          apiUrl: 'user/bookmarks'
        },
        defaultApiQuery: {
          responseTypeId: 1
        }
      })
    } else {
      if (bookmarks.length === 0) {
        bookmarks = [0]
      }
      data = await List.getStartData({
        error,
        query,
        defaultData: {
          apiUrl: 'articles'
        },
        defaultApiQuery: {
          responseTypeId: 3,
          whereIn: [...bookmarks]
        }
      })
    }

    return data
  },
  data: () => ({
    bookmarksActive: false,
    loadingList: false
  }),
  computed: mapGetters({
    bookmarks: 'auth/bookmarks',
    check: 'auth/check'
  })
}
</script>

<style>
</style>
