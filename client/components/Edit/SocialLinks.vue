<template>
  <div>
    <div v-for="(link, index) in links" :key="index">
      {{ link.link }}
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

export default {
  components: {
    MaterialInput
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
