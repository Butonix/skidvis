<template>
  <div class="social-links-edit">
    <div
      v-for="(link, index) in links"
      :key="index"
      class="social-links-edit__item"
    >
      <social
        :type="link.type"
        class-box="mr-2"
      />
      <a :href="link.link" target="_blank" class="social-links-edit__item__link">
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
        {{ link.link }}
      </a>
    </div>
    <div class="d-flex align-items-start">
      <material-input
        form-class="flex-grow-1"
        name="li1nk"
        placeholder="Ссылка на социальную сеть"
        @input="$emit(input, $event)"
      />
      <div class="btn btn-outline-primary btn-sm material-input__btn ml-3">
        Добавить
      </div>
    </div>
  </div>
</template>

<script>
import MaterialInput from '~/components/Edit/Inputs/MaterialInput'
import Social from '~/components/Icons/Social'

export default {
  components: {
    MaterialInput,
    Social
  },
  props: {
    links: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<style>
</style>
