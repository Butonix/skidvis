<template>
  <div :class="{
    'product__sidebar': true,
    [boxClass]: !!boxClass,
    ['product__sidebar--'+boxMod]: !!boxMod,
  }">
    <list-item-icon class="mb-0">
      <template slot="text">
        <v-checkbox :value="form.is_perpetual" @input="$emit('setIsPerpetual', $event)">
          Без срока действия
        </v-checkbox>
      </template>
    </list-item-icon>

    <list-item-icon v-if="organization.is_advertisement">
      <template slot="text">
        <v-checkbox :value="form.is_advertisement" @input="$emit('setIsAdvertisement', $event)">
          Рекламировать
        </v-checkbox>
      </template>
    </list-item-icon>

    <list-item-icon>
      <template slot="icon">
        <hourglass />
      </template>
      <template slot="text">
        <template v-if="form.is_perpetual">
          Акция действует бессрочно
        </template>
        <template v-else-if="timeHuman">
          Акция действует
          <div v-html="timeHuman"/>
        </template>
        <template v-if="!form.is_perpetual">
          <div class="btn btn-outline-gray btn-sm btn-block btn-time-picker mb-2">
            <span v-text="timeHuman?'+ изменить время':'+ добавить время'"/>
            <div class="btn-time-picker__picker">
              <flat-pickr
                :value="getDate"
                :config="config"
                @input="onInputDate"
              />
            </div>
          </div>
          <client-only>
            <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('start_at') }">
              <has-error :form="form" field="start_at"/>
            </div>
          </client-only>
        </template>
      </template>
    </list-item-icon>

    <list-item-icon v-if="operationModeText">
      <template slot="icon">
        <clock />
      </template>
      <template slot="text">
        Режим работы
        <div v-html="operationModeText.replaceAll('00:00-00:00', 'круглосуточно')"/>
      </template>
    </list-item-icon>

    <list-item-icon>
      <template slot="text">
        <v-checkbox :value="form.is_birthday" @input="$emit('setIsBirthday', $event)">{{ form.is_birthday?'На день рождения':'Не касается для рождения' }}</v-checkbox>

        <material-input
          v-if="form.is_birthday"
          :value="form.birthday_before"
          :form="form"
          type="number"
          field="birthday_before"
          placeholder="Дней до ДР"
          data-align="left"
          form-class="my-4"
          size="sm"
          @input="$emit('onInputBirthdayBefore', $event)"
        />
        <material-input
          v-if="form.is_birthday"
          :value="form.birthday_after"
          :form="form"
          type="number"
          field="birthday_after"
          placeholder="Дней после ДР"
          data-align="left"
          form-class="my-4"
          size="sm"
          @input="$emit('onInputBirthdayAfter', $event)"
        />
      </template>
    </list-item-icon>

    <list-item-icon v-if="form.currency_id !== 3">
      <template slot="icon">
        <percent />
      </template>
      <template slot="text">
        <span v-if="form.origin_price">
          <span class="text-line-through text-muted">{{ getFullPrice }}&nbsp;₽</span> <span v-html="getPrice"/>
        </span>
        <span v-else>
          Цена не указана
        </span>
        <material-input
          :value="form.origin_price"
          :form="form"
          type="number"
          field="origin_price"
          placeholder="Цена"
          data-align="left"
          form-class="my-4"
          size="sm"
          @input="$emit('onInputOriginPrice', $event)"
        />
      </template>
    </list-item-icon>

    <list-item-icon v-if="form.id" class-box="mb-4">
      <template slot="icon">
        <relations />
      </template>
      <template slot="text">
        <social-sharing
          :url="baseUrl + '/products/' + form.id"
          :title="form.name || form.short_description"
          :description="form.short_description"
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

    <categories v-if="categories.length">
      <category
        v-for="(category, key) in categories"
        :key="'categories-selected-'+key"
        :label="category.name"
        :active="(form.main_category_id && category.id === form.main_category_id)"
        :src-active="category.images.business.active || '/img/categories/entertainment/entertainment-default-active.svg'"
        :src="category.images.business.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
        @click="$emit('onClickCategory', category.id)"
      />
    </categories>

    <div class="text-center">
      <div class="btn btn-outline-primary btn-sm px-4"
           @click="$emit('onEditSelect', 'categories')" v-text="(categories.length)?'Изменить категории':'Выбрать категории'"/>
    </div>

    <client-only>
      <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('categories') }">
        <has-error :form="form" field="categories"/>
      </div>
    </client-only>

  </div>
</template>

<script>
import SidebarMixin from './mixins/sidebar'
import ListItemIcon from '~/components/ListItemIcon'
import { Russian } from 'flatpickr/dist/l10n/ru'

export default {
  components: {
    'VCheckbox': () => import('~/components/Edit/Checkboxes/v-checkbox'),
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput'),
    'flatPickr': () => import('vue-flatpickr-component'),
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
    boxMod: {
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
    boxClass: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => ({})
    },
    organization: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    date: null,
    config: {
      mode: 'range',
      locale: Russian
    }
  }),
  methods: {
    onInputDate (value) {
      this.$emit('onInputDate', value)
    }
  }
}
</script>
