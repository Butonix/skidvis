<template>
  <div class="card-step border-primary">
    <div class="card-step__number text-primary">
      <slot name="number"/>
    </div>
    <div class="card-step__text">
      <slot/>
    </div>
  </div>
</template>

<script>

export default {
}
</script>

<style>
</style>
