<template>
  <div ref="start" class="container container--long-offset">
    <transition
      v-if="getItems.length"
      name="fade" mode="out-in">
      <div
        class="row position-relative">
        <div :class="{'active': params.isLoading}"
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
                           @click.native="$sTB()">
                <div v-if="item.currency_id"
                     :class="{'card-img-top__label--present':item.currency_id === 3}"
                     class="card-img-top__label">
                  <present-card
                    v-if="item.currency_id === 3"/>
                  <span v-else-if="item.value">
                    {{ item.value }}{{ (item.currency_id === 1)? '%' : '₽' }}
                  </span>
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
                     v-html="(item.name)?splitReplaceShort(item.name, 94):''"
              />
              <div class="card-footer"
                   :class="{'active': activeAddresses === item.id}">
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
                  <flag v-if="wishlist.indexOf(item.id) !== -1" :active="true" class-box="ml-1" title="Удалить из закладок"
                        @click="removeFromWishlist(item.id)"
                  />
                  <flag v-else :active="false" class-box="ml-1" title="Добавить в закладки"
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
        <flag :active="wishlistActive" :title="(wishlistActive)?'Удалить из закладок':'Добавить в закладки'" class-box="mb-5 simple"
              @click="wishlistActive = !wishlistActive"
        />
        <p>
          Сохраняем закладки,<br> даже если не зарегистрировались
        </p>
      </div>
      <h5 v-else class="text-center py-5">
        Ничего не нашлось :(
      </h5>
    </transition>
    <paginate-list
      :params="params"
    />

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

export default {
  components: {
    'PaginateList': () => import('~/components/PaginateList'),
    'PresentCard': () => import('~/components/Icons/PresentCard'),
    'Flag': () => import('~/components/Flag'),
    'CardLogo': () => import('~/components/Product/CardLogo'),
    Paginate
  },
  props: {
    params: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'default'
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
      return this.params.items
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
    splitReplaceShort (str, length) {
      if (!str) {
        return str
      }
      let arrStr = str.split('\n')
      if (arrStr.length > 3) {
        str = arrStr[0] + ((arrStr[1]) ? '<br>' + arrStr[1] : '') + ((arrStr[2]) ? '<br>' + arrStr[2] : '') + '...'
      } else {
        if (str.length > length) {
          str = str.slice(0, length).trim()
          str += '...'
        }
        str.replaceAll('\n', '<br>')
      }
      return str
    },
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
    }
  }
}
</script>

<style>
</style>
