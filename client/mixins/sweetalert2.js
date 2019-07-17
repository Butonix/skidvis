const swal = {
  methods: {
    $callToast (data) {
      let typeClass = ' toast-alert--' + data.type
      let message = ''
      if (data.title) {
        message += `<h4>${data.title}</h4>`
      }
      if (data.text) {
        message += `<p>${data.text}</p>`
      }
      return this.$toast(message, {
        transition: 'slide-down',
        horizontalPosition: 'center',
        className: typeClass,
        duration: 300000,
        ...data
      })

      // return this.$swal({
      //   animation: false,
      //   customClass: {
      //     container: 'toast-alert' + typeClass,
      //     popup: 'animated fadeInDown faster',
      //     icon: 'd-none'
      //   },
      //   toast: true,
      //   position: 'top',
      //   showConfirmButton: false,
      //   timer: 3000,
      //   ...data
      // })
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
}

export default swal
