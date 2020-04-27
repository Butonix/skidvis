<template>
  <div class="share-box">
    <div class="mb-3">
      Поделиться статьей
    </div>
    <social-sharing
      :url="url"
      :title="title"
      :description="description"
      class="d-flex flex-wrap justify-content-center align-items-center"
      inline-template>
      <div>
        <network network="facebook">
          <social
            mode="outline"
            type="facebook"
            size="lg"
            class="mx-1"
          />
        </network>
        <network network="vk">
          <social
            mode="outline"
            type="vk"
            size="lg"
            class="mx-1"
          />
        </network>
        <network network="odnoklassniki">
          <social
            mode="outline"
            type="ok"
            size="lg"
            class="mx-1"
          />
        </network>
      </div>
    </social-sharing>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script>

<style>

</style>
