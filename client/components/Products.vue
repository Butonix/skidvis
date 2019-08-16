<template>
  <div class="container container--long-offset" ref="start">
    <transition
      v-if="getItems.length"
      name="fade" mode="out-in">
      <div
        class="row position-relative">
        <div :class="{'active': loadingList}"
             class="loading-list"
        />
        <transition v-for="(item, index) in getItems"
                    :key="'product-'+index"
                    name="fade" mode="out-in">
          <div
            class="col-md-6 col-lg-4 mb-5"
          >
            <div
              class="card card--product w-100 h-100"
            >
              <router-link :to="{ name: 'products.show', params: { productId: item.id } }"
                           :class="{
                             'with-logo':item.organization_logo,
                             'error-logo':(errorsImages.logo)?errorsImages.logo[item.id]:false,
                             'error-cover':(errorsImages.cover)?errorsImages.cover[item.id]:false
                           }"
                           class="card-img-top d-block"
                           @click.native="onClickLinkScrollToBody">
                <div v-if="item.currency_id && item.value" class="card-img-top__label">
                  {{ item.value }}{{ (item.currency_id === 1)? '%' : '₽' }}
                </div>
                <div class="embed-responsive">
                  <div class="embed-responsive-item">
                    <div
                      v-lazy:background-image="{
                        src: item.images[0].src,
                        loading: '/placeholders/cover.jpg'
                      }"
                      v-if="item.images && item.images[0] && item.images[0].src"
                      data-loading="/placeholders/cover.jpg"
                      class="card-img-top__cover bg-cover"
                      role="img"/>
                    <div
                      v-else :style="{backgroundImage: '/placeholders/cover.jpg'}"
                      class="card-img-top__cover img-cover"
                      role="img"/>

                    <card-logo
                      v-if="item.organization_logo"
                      :img="item.organization_logo"
                      :color="item.organization_color"
                      :title="item.name"
                      :alt="item.name"
                      :id="item.id"
                    />
                  </div>
                </div>
              </router-link>
              <label class="card-body pb-2 pt-4"
                     v-html="((item.short_description)?item.short_description.replaceAll('\n', '<br>'):((item.name)?item.name.replaceAll('\n', '<br>'):''))"
              />
              <div class="card-footer">
                <div class="card-footer__address">
                  <div :title="(item.points[0])?((item.points[0].street)?item.points[0].street:item.points[0].full_street):''"
                       class="card-footer__address__wrapper"
                  >
                    <div class="card-footer__address__text"
                         v-text="(item.points[0])?((item.points[0].street)?item.points[0].street:item.points[0].full_street):''"
                    />
                  </div>
                  <div
                    v-if="item.points[1]"
                    class="card-footer__address__btn btn btn-sm btn-gray"
                    @click="(activeAddresses && activeAddresses === item.id)? activeAddresses = 0 : activeAddresses = item.id"
                  >
                    еще {{ item.points.length - 1 }}
                  </div>
                </div>
                <div class="card-footer__wishlist">
                  <flag v-if="wishlist.indexOf(item.id) !== -1" :active="true" class-box="ml-1" title="Удалить из избранного"
                        @click="removeFromWishlist(item.id)"
                  />
                  <flag v-else :active="false" class-box="ml-1" title="Добавить в избранное"
                        @click="pushInWishlist(item.id)"
                  />
                </div>
                <div
                  v-if="item.points[1]"
                  :class="{'active': activeAddresses === item.id}"
                  :style="{
                    maxHeight: (activeAddresses === item.id)? (3 + 2.5 * (item.points.length)) + 'rem': '3rem'
                  }"
                  class="card-footer__list-address__wrapper"
                >
                  <ul class="card-footer__list-address list-unstyled text-muted">
                    <li
                      v-for="(point, index) in item.points"
                      v-if="index !== 0"
                      :key="'list-address__item-'+index"
                      :title="(point.street)?point.street:point.full_street"
                      class="card-footer__list-address__item"
                    >
                      <div class="card-footer__list-address__link" v-text="(point.street)?point.street:point.full_street"/>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <transition
      v-else
      name="fade" mode="out-in">
      <div v-if="type === 'wishlist'" class="text-center py-5">
        <h5 class="mb-4">
          Пусто
        </h5>
        <h5>
          Чтобы отложить акцию,<br> кликаем по иконке закладки
        </h5>
        <flag :active="wishlistActive" class-box="mb-5" :title="(wishlistActive)?'Удалить из избранного':'Добавить в избранное'"
              @click="wishlistActive = !wishlistActive"
        />
        <p>
          Сохраняем избранное<br> даже если не зарегистрировались
        </p>
      </div>
      <h5 v-else class="text-center py-5">
        Ничего не нашлось :(
      </h5>
    </transition>
    <paginate
      v-if="pageCount && pageCount > 1"
      :page="page"
      :page-count="pageCount"
      :page-range="3"
      :margin-pages="1"
      :hide-prev-next="true"
      :container-class="'pagination'"
      :page-class="'page-item'"
      prev-class="d-none"
      next-class="d-none"
      @input="$emit('setpage', $event)"
      @click.native="onClickLink"
    />

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

export default {
  components: {
    'Flag': () => import('~/components/Flag'),
    'CardLogo': () => import('~/components/Product/CardLogo'),
    Paginate
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    loadingList: {
      type: Boolean,
      default: false
    },
    pageCount: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
    },
    items: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    wishlistActive: false,
    errorsImages: {},
    activeAddresses: 0
  }),
  computed: {
    ...mapGetters({
      wishlist: 'auth/wishlist',
      city: 'auth/city'
    }),
    getItems () {
      this.onGetItems()
      return this.items
    }
  },
  beforeMount () {
    this.$Lazyload.$off('error')
    this.$Lazyload.$on('error', this.onErrorImg)
  },
  methods: {
    ...mapActions({
      pushInWishlist: 'auth/pushInWishlist',
      removeFromWishlist: 'auth/removeFromWishlist'
    }),
    onGetItems () {
      this.activeAddresses = 0
    },
    onErrorImg ({ el }) {
      let id = el.getAttribute('data-id')
      let type = el.getAttribute('data-type')
      if (id) {
        if (!this.errorsImages[type]) {
          this.$set(this.errorsImages, type, { [Number(id)]: true })
        } else {
          this.$set(this.errorsImages[type], Number(id), true)
        }
      }
    },
    onClickLink () {
      this.$scrollTo(this.$refs.start, 500, {
        offset: -60,
        x: false,
        y: true
      })
    },
    onClickLinkScrollToBody () {
      this.$scrollTo(document.documentElement.getElementsByTagName('body')[0])
    }
  }
}
</script>

<style>
</style>
