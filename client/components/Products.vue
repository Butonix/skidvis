<template>
  <div class="position-relative">
    <transition
      v-if="false"
      name="fade" mode="out-in">
      <div class="animated-circles__wrapper">
        <div v-for="n in (Math.ceil(getItems.length/12))" :key="'block-a-c-'+n" class="animated-circles">
          <div v-if="getItems.length >= (3 * n)"><div/></div>
          <div v-if="getItems.length >= (6 * n)"><div/></div>
          <div v-if="getItems.length >= (9 * n)"><div/></div>
          <div v-if="getItems.length >= (12 * n)"><div/></div>
        </div>
      </div>
    </transition>
    <div class="position-relative z-index-2 container container--long-offset">
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
                      <template v-if="item.currency_id === 1">
                        {{ item.value }}%
                      </template>
                      <template v-else-if="item.currency_id === 2">
                        {{ item.value }}₽
                      </template>
                      <template v-else-if="item.currency_id === 4">
                        {{ item.value }} <bonus/>
                      </template>
                      <template v-else-if="item.currency_id === 5">
                        {{ item.value }} <cashback/>
                      </template>
                      <template v-else>
                        {{ item.value }}₽
                      </template>
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
                <div class="card-body pb-2 pt-4 mb-2">
                  <div v-if="item.caption && item.organization_is_caption" class="card-caption">
                    {{ item.caption }}
                  </div>
                  <span v-html="(item.name)?splitReplaceShort(item.name, 94):''"/>
                </div>
                <div :class="{'active': activeAddresses === item.id}"
                     class="card-footer">
                  <div class="card-footer__address">
                    <div :title="(item.points[0])?((item.points[0].street)?item.points[0].street:item.points[0].full_street):''"
                         class="card-footer__address__wrapper"
                    >
                      <div class="card-footer__address__text"
                      >
                        <metro v-if="item.points[0]" :color="item.points[0].metro_line_color" :station="item.points[0].metro_station_name" :line="item.points[0].metro_line_name" :distance="item.points[0].metro_distance"/>
                        {{ (item.points[0])?((item.points[0].street)?item.points[0].street:item.points[0].full_street):'' }}
                      </div>
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
                    <div class="card-footer__list-address">
                      <ul class="card-footer__list-address__list list-unstyled text-muted">
                        <li
                          v-for="(point, index) in item.points"
                          v-if="index !== 0"
                          :key="'list-address__item-'+index"
                          :title="(point.street)?point.street:point.full_street"
                          class="card-footer__list-address__item"
                        >
                          <div class="card-footer__list-address__link">
                            <metro :color="point.metro_line_color" :station="point.metro_station_name" :line="point.metro_line_name" :distance="point.metro_distance"/>
                            {{ (point.street)?point.street:point.full_street }}
                          </div>
                        </li>
                      </ul>
                    </div>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

export default {
  components: {
    'Metro': () => import('~/components/MetroWithTooltip'),
    'PaginateList': () => import('~/components/PaginateList'),
    'PresentCard': () => import('~/components/Icons/PresentCard'),
    'Bonus': () => import('~/components/Icons/Bonus'),
    'Cashback': () => import('~/components/Icons/Cashback'),
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

<style lang="scss">
  .animated-circles{
    position: relative;
    flex-grow: 1;
    &__wrapper{
      position: absolute;
      z-index: 1;
      /*overflow: hidden;*/
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    div{
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(525.88px at 100% 0%, rgba(22, 217, 227, 0.5) 0%, rgba(70, 174, 247, 0.5) 100%);
      filter: blur(19px);
      display: block;
      width: 100%;
      padding: 0;
      overflow: hidden;
      transform: translateX(-50%) translateY(-50%);
      &:before{
        display: block;
        content: "";
        padding-top: 100%;
      }
      >div{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      &:nth-child(1){
        background: radial-gradient(525.88px at 100% 0%, rgba(22, 217, 227, 0.5) 0%, rgba(70, 174, 247, 0.5) 100%);
        top: 20%;
        left: 6%;
        width: 30%;
      }
      &:nth-child(2){
        background: radial-gradient(337.22px at 100% 0%, rgba(22, 217, 227, 0.5) 0%, rgba(70, 174, 247, 0.5) 100%);
        top: 46%;
        left: 67%;
        width: 19%;
      }
      &:nth-child(3){
        background: radial-gradient(86.16px at 100% 0%, rgba(22, 217, 227, 0.5) 0%, rgba(70, 174, 247, 0.5) 100%);
        top: 60%;
        left: 36%;
        width: 5%;
      }
      &:nth-child(4){
        background: radial-gradient(252.54px at 100% 0%, rgba(22, 217, 227, 0.5) 0%, rgba(70, 174, 247, 0.5) 100%);
        top: 83%;
        left: 39%;
        width: 14.5%;
      }
    }
  }
</style>
