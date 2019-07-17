import Vue from 'vue'

import Toast from 'vue-easy-toast'

Vue.use(Toast)

Vue.mixin({
  methods: {
    $callToast (data) {
      let typeClass = 'toast-alert toast-alert--' + data.type
      let message = ''
      if (data.title) {
        message += `<div class="toast-alert-title">${data.title}</div>`
      }
      if (data.text) {
        message += `<div class="toast-alert-text">${data.text}</div>`
      }
      return this.$toast(message, {
        transition: 'slide-down',
        horizontalPosition: 'center',
        className: typeClass,
        duration: 2000,
        ...data
      })
    },
    $confirmDelete (data) {
      return this.$swal({
        customClass: {
          container: 'confirm-modal',
          confirmButton: 'btn btn-outline-primary btn-sm mb-2 px-4',
          cancelButton: 'confirm-modal__btn-link'
        },
        buttonsStyling: false,
        text: 'Удалить?',
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет',
        showCancelButton: true,
        ...data
      })
    }
  }
})
