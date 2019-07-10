const swal = {
  methods: {
    configSwal () {
      return {
        confirm: {

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
