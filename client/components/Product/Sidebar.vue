<template>
  <div :class="{
    'product__sidebar': true,
    [boxClass]: !!boxClass,
    ['product__sidebar--'+boxMod]: !!boxMod,
  }">

    <list-item-icon>
      <template slot="icon">
        <hourglass />
      </template>
      <template slot="text">
        <template v-if="product.is_perpetual">
          Акция действует бессрочно
        </template>
        <template v-else-if="timeHuman">
          Акция действует
          <div v-html="timeHuman"/>
        </template>
        <div v-if="product.is_birthday && product.birthday_before && product.birthday_after">
          <template v-if="product.birthday_before">{{ product.birthday_before }} {{ pluralize(product.birthday_before, pluralizeDays) }} до</template>
          <template v-if="product.birthday_before && product.birthday_after">и <br></template>
          <template v-if="product.birthday_after">{{ product.birthday_after }} {{ pluralize(product.birthday_after, pluralizeDays) }} после</template>
          дня рождения
        </div>
      </template>
    </list-item-icon>

    <list-item-icon v-if="operationModeText || product.organization_link || product.phone || product.email">
      <template slot="icon">
        <clock />
      </template>
      <template slot="text">
        <div v-if="operationModeText" class="mb-2">
          Режим работы
          <div v-html="operationModeText.replaceAll('00:00-00:00', 'круглосуточно')"/>
        </div>
        <p v-if="product.organization_link" class="mb-2">
          <a :href="product.organization_link" class="link-dashed text-black-50" target="_blank" v-text="getDomain(product.organization_link)"/>
        </p>
        <p v-if="product.phone" class="mb-2">
          <a :href="'tel:'+getLinkTel(product.phone)" class="link-dashed text-black-50" v-text="product.phone"/>
        </p>
        <p v-if="product.email" class="mb-0">
          <a :href="'mailto:'+product.email" class="link-dashed text-black-50" v-text="product.email"/>
        </p>
      </template>
    </list-item-icon>

    <list-item-icon v-if="product.origin_price && product.currency_id !== 3">
      <template slot="icon">
        <percent />
      </template>
      <template slot="text">
        <span class="text-line-through text-muted">{{ getFullPrice }}&nbsp;₽</span> <span v-html="getPrice"/>
      </template>
    </list-item-icon>

    <list-item-icon v-if="product" class-box="mb-4">
      <template slot="icon">
        <relations />
      </template>
      <template slot="text">
        <social-sharing
          :url="baseUrl + '/products/' + product.id"
          :title="product.name || product.short_description"
          :description="product.short_description"
          class="d-flex flex-wrap justify-content-start align-items-start"
          inline-template>
          <div>
            <network network="facebook" class="outline-none">
              <social
                mode="shadow"
                type="facebook"
                class="mx-1"
              />
            </network>
            <network network="vk" class="outline-none">
              <social
                mode="shadow"
                type="vk"
                class="mx-1"
              />
            </network>
            <network network="odnoklassniki" class="outline-none">
              <social
                mode="shadow"
                type="ok"
                class="mx-1"
              />
            </network>
          </div>
        </social-sharing>
      </template>
    </list-item-icon>

    <list-item-icon class-box="mb-4">
      <template slot="icon">
        <flag :active="wishlistActive" class-box="ml-1 simple" @click="$emit('wishlistchange')" />
      </template>
      <template slot="text">
        <span class="cursor-pointer no-select" @click="$emit('wishlistchange')" v-text="(wishlistActive)?'В закладках':'В закладки'"/>
      </template>
    </list-item-icon>

    <categories v-if="categories.length">
      <category
        v-for="(category, key) in categories"
        :key="'categories-selected-'+key"
        :label="category.name"
        :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
        :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
      />
    </categories>

  </div>
</template>

<script>
import SidebarMixin from './mixins/sidebar'
import { getDomain, getLinkTel } from '~/utils'
import ListItemIcon from '~/components/ListItemIcon'

export default {
  components: {
    'Hourglass': () => import('~/components/Icons/Hourglass'),
    'Clock': () => import('~/components/Icons/Clock'),
    'Flag': () => import('~/components/Flag'),
    'Category': () => import('~/components/Category'),
    'Categories': () => import('~/components/Categories'),
    'Relations': () => import('~/components/Icons/Relations'),
    'Percent': () => import('~/components/Icons/Percent'),
    ListItemIcon
  },
  mixins: [SidebarMixin],
  props: {
    product: {
      type: Object,
      default: null
    },
    wishlistActive: {
      type: Boolean,
      default: false
    },
    value: {
      type: String | Number,
      default: ''
    },
    currencyId: {
      type: String | Number,
      default: 1
    },
    operationModeText: {
      type: String,
      default: ''
    },
    startAt: {
      type: String,
      default: ''
    },
    endAt: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default: () => ([])
    },
    socials: {
      type: Array,
      default: () => ([])
    },
    boxMod: {
      type: String,
      default: ''
    },
    boxClass: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    pluralizeDays: ['день', 'дня', 'дней']
  }),
  methods: {
    getDomain (str) {
      return getDomain(str)
    },
    getLinkTel (str) {
      return getLinkTel(str)
    },
    pluralize (number, suffix) {
      let keys = [2, 0, 1, 1, 1, 2]
      let mod = number % 100
      let suffixKey = (mod > 7 && mod < 20) ? 2 : keys[Math.min(mod % 10, 5)]
      return suffix[suffixKey]
    }
  }
}
</script>
