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
      <label class="social-links-edit__item__link">
        <a v-if="edit.value === undefined" class="text-break" :href="link.link" target="_blank" v-text="link.link"/>
        <material-input
          v-if="edit.value !== undefined"
          v-model="edit.value"
          type-input="inline"
          form-class="flex-grow-1 m-0"
        />
        <span v-if="edit.value === undefined" class="social-links-edit__item__link__change" @click="editHandle(index)">
          <pain />
        </span>
        <span v-if="edit.value === undefined" class="social-links-edit__item__link__delete" @click="deleteHandle(index)">
          <fa :icon="['far', 'trash-alt']"/>
        </span>
        <span v-if="edit.value !== undefined" class="social-links-edit__item__link__save" @click="editSave">
          <fa icon="check"/>
        </span>
        <span v-if="edit.value !== undefined" class="social-links-edit__item__link__cancel" @click="editCancel">
          <fa icon="times"/>
        </span>
      </label>
      <div v-if="edit.error" class="text-danger small w-100 text-center">
        {{ errors[edit.error] }}
      </div>
    </div>
    <div class="d-flex flex-column flex-sm-row align-items-start">
      <material-input
        v-model="value"
        form-class="flex-grow-1 w-100 w-sm-auto"
        name="li1nk"
        placeholder="Ссылка на социальную сеть"
      />
      <div class="pt-sm-4 ml-auto ml-sm-3">
        <div class="btn btn-outline-primary btn-sm material-input__btn mt-sm-2" @click="add">
          Добавить
        </div>
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
import Pain from '~/components/Icons/Pain'
import mixinSwal from '~/mixins/sweetalert2'

export default {
  components: {
    MaterialInput,
    Social,
    Pain
  },
  mixins: [mixinSwal],
  props: {
    links: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    edit: {
      index: undefined,
      value: undefined,
      error: undefined
    },
    value: '',
    errors: {
      empty: 'Поле не может быть пустым',
      noParsed: 'Соц сеть не опознана',
      noParsedSave: 'Соц сеть не опознана и не будет сохранена'
    },
    error: undefined
  }),
  watch: {
    value () {
      this.error = undefined
    }
  },
  methods: {
    editHandle (index) {
      this.edit.index = index
      this.edit.value = this.links[index].link
    },
    editSave () {
      if (this.edit.value.isEmpty()) {
        this.edit.error = 'empty'
        return
      }
      let value = this.edit.value.parseSocial()
      if (value.length === 0) {
        this.edit.error = 'noParsed'
        return
      }
      console.log(value)
      this.$emit('change', {
        value: {
          link: this.edit.value,
          type: value[0].type,
        },
        index: this.edit.index
      })
      this.edit.index = undefined
      this.edit.value = undefined
      this.edit.error = undefined
    },
    editCancel () {
      this.edit.index = undefined
      this.edit.value = undefined
      this.edit.error = undefined
    },
    async deleteHandle (index) {
      let res = await this.$confirmDelete()
      if (res.value) {
        this.$emit('delete', index)
      }
    },
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
