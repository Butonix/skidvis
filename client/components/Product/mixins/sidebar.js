export default {
  data: () => ({
    baseUrl: process.env.baseUrl,
    monthRussian: {
      '01': 'января',
      '02': 'февраля',
      '03': 'марта',
      '04': 'апреля',
      '05': 'мая',
      '06': 'июня',
      '07': 'июля',
      '08': 'августа',
      '09': 'сентября',
      '10': 'октября',
      '11': 'ноября',
      '12': 'декабря'
    }
  }),
  computed: {
    getPrice () {
      let currencyId = Number(this.currencyId)
      let value = Number(this.value)

      if (currencyId === 1) {
        let price_ = this.getFullPrice * value / 100
        let price = this.getFullPrice - price_
        return price + '&nbsp;₽, экономия&nbsp;' + price_ + '&nbsp;₽'
      } else {
        if (value && !isNaN(value)) {
          return (this.getFullPrice - value) + '&nbsp;₽, экономия&nbsp;' + value + '&nbsp;₽'
        } else {
          return '0&nbsp;₽, экономия&nbsp;0&nbsp;₽'
        }
      }
    },
    getFullPrice () {
      return this.product.origin_price || 0
    },
    timeHuman () {
      return this.getTimeHuman(this.startAt, this.endAt, this.monthRussian)
    },
    getDate () {
      let res = (this.startAt) ? this.startAt : ''

      if (res && this.endAt && this.startAt !== this.endAt) {
        res += ' — ' + this.endAt
      }

      return res
    }
  },
  methods: {
    getTimeHuman (startAt, endAt, monthRussian) {
      if (!startAt) {
        return ''
      }
      let mR = monthRussian
      if (startAt === endAt || !endAt) {
        let arr = startAt.split('-')
        return `только ${arr[2]} ${mR[arr[1]]} ${arr[0]}`
      } else {
        let sArr = startAt.split('-')
        let eArr = endAt.split('-')
        let start = ''
        let end = ''
        if (sArr[0] !== eArr[0]) {
          start = `с ${sArr[2]} ${mR[sArr[1]]} ${sArr[0]}<br>`
          end = `по ${eArr[2]} ${mR[eArr[1]]} ${eArr[0]}`
        } else {
          start = `с ${sArr[2]} `
          if (sArr[1] !== eArr[1]) {
            start += `${mR[sArr[1]]} `
          }
          end = `по ${eArr[2]} ${mR[eArr[1]]} ${eArr[0]}`
        }
        return start + end
      }
    },
  }
}
