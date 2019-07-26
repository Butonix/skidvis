<template>
  <div class="text-center py-5">
    <h5 class="text-primary mb-4 pb-3">
      500
    </h5>
    <h5 class="mb-0">
      Ошибка сервера, <br>
      все ошибаются...
    </h5>
  </div>
</template>
<script>
export default {
  name: 'Error500',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
