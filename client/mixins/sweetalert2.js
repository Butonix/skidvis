const swal = {
  methods: {
    $toast (data) {
      let typeClass = ' toast-alert--' + data.type

      return this.$swal({
        animation: false,
        customClass: {
          container: 'toast-alert' + typeClass,
          popup: 'animated fadeInDown faster',
          icon: 'd-none'
        },
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        ...data
      })
    },
    configSwal () {
      return {
        confirm: {
          customClass: {
            container: 'confirm-modal',
            confirmButton: 'btn btn-outline-primary btn-sm mb-2 px-4',
            cancelButton: 'confirm-modal__btn-link'
          },
          buttonsStyling: false,
          text: 'Удалить?',
          confirmButtonText: 'Да',
          cancelButtonText: 'Нет',
          showCancelButton: true

        }
      }
    }
  }
}

export default swal
