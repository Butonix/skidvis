const swal = {
  methods: {
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
