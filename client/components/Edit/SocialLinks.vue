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
      </a>
    </div>
    <div class="d-flex align-items-start">
      <material-input
        v-model="value"
        form-class="flex-grow-1"
        name="li1nk"
        placeholder="Ссылка на социальную сеть"
      />
      <div class="btn btn-outline-primary btn-sm material-input__btn ml-3" @click="add">
        Добавить
      </div>
    </div>
    <div v-if="error" class="text-danger small">
      {{ errors[error] }}
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
  },
  data: () => ({
    value: '',
    errors: {
      empty: 'Поле не может быть пустым',
      noParsed: 'Соц сеть не опознана'
    },
    error: undefined
  }),
  watch: {
    value () {
      this.error = undefined
    }
  },
  methods: {
    add () {
      if (this.value.isEmpty()) {
        this.error = 'empty'
        return
      }
      let value = this.value.parseSocial()
      if (value.length === 0) {
        this.error = 'noParsed'
        return
      }
      this.$emit('add', {
        link: this.value,
        type: value[0].type
      })
      this.value = ''
    }
  }
}
</script>

<style>
</style>
