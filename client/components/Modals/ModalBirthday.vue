<template>
  <modal name="ModalBirthday">
    <div class="basic-modal modal-birthday">
      <div class="btn btn-auditories btn-sm btn-block btn-time-picker mb-2">
        День рождения<br>{{ birthday[0] }}
        <div class="btn-time-picker__picker">
          <flat-pickr
            :value="birthday[0]"
            :config="config"
            @input="$emit('birthdayData', [0, $event])"
          />
        </div>
      </div>
      <div v-if="birthday[0]" class="btn btn-auditories btn-sm btn-block btn-time-picker mb-2">
        Праздную<br>{{ birthday[1] }}
        <div class="btn-time-picker__picker">
          <flat-pickr
            :value="birthday[1]"
            :config="config"
            @input="$emit('birthdayData', [1, $event])"
          />
        </div>
      </div>
      <div class="mt-4 d-flex justify-content-between">
        <div class="btn btn-gray btn-sm px-3" @click="$emit('birthdayClear')">
          Сбросить
        </div>
        <div class="btn btn-primary btn-sm px-3 ml-2" @click="$modal.pop()">
          Готово
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { Russian } from 'flatpickr/dist/l10n/ru'

export default {
  name: 'ModalBirthday',
  components: {
    'flatPickr': () => import('vue-flatpickr-component')
  },
  props: {
    birthday: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    config: {
      dateFormat: 'd.m.y',
      locale: Russian
    }
  })
}
</script>

<style scoped>
  .modal-birthday{
    max-width: 290px;
  }
</style>
