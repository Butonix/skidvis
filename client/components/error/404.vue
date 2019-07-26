<template>
  <div class="error-404 text-center py-5">
    <div class="error-404__text">
      <h5 class="text-primary mb-4 pb-3">
        404
      </h5>
      <h5 class="mb-0">
        Этой страницы нет, <br>
        но есть много других
      </h5>
      <svg class="error-404__arrow" width="23" height="108" viewBox="0 0 23 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 107C19.5 95 31.5 45.5 12 1M12 1L9.5 10.5M12 1L20 7" stroke="black" stroke-width="0.5"/>
      </svg>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Error404',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss">
  .error-404{
    display: flex;
    justify-content: center;
    align-items: center;
    &__text{
      position: relative;
    }
    &__arrow{
      position: absolute;
      bottom: 10px;
      right: -35px;
    }
  }
</style>
