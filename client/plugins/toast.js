import Vue from 'vue'

import Toast from 'vue-easy-toast'
import { $callToast } from '~/utils'

Vue.use(Toast)

Vue.use({
  /*
  * install function
  * @param  {Vue} Vue
  * @param  {object} options  lazyload options
  */
  install (Vue) {
    Vue.prototype.$callToast = $callToast

    Vue.prototype.$confirmDelete = function (data) {
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

    window.__VUE_GLOBAL_HOOK_TOAST__ = {
      $callToast: Vue.prototype.$callToast,
      $confirmDelete: Vue.prototype.$confirmDelete
    }
  }
})
