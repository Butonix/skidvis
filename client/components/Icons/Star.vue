<template>
  <div
    :class="{
      'active':active,
      ['star--'+type]: !!type
    }"
    class="star"
    @click="$emit('click', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mouseleave="$emit('mouseleave', $event)"
  >
    <svg
      width="30" height="29" viewBox="0 0 30 29" fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class="star-path" d="M15.2283 1.35441L18.7766 9.3145C19.0309 9.88506 19.57 10.2768 20.1913 10.3423L28.8582 11.2571C29.0734 11.2798 29.1601 11.5466 28.9993 11.6914L22.5253 17.5258C22.0613 17.944 21.8553 18.5778 21.9849 19.1889L23.7932 27.7143C23.8381 27.926 23.6112 28.0908 23.4237 27.9827L15.8743 23.6285C15.3332 23.3164 14.6668 23.3164 14.1257 23.6285L6.57627 27.9827C6.38884 28.0908 6.16191 27.926 6.20681 27.7143L8.01507 19.1889C8.14468 18.5778 7.93873 17.944 7.47469 17.5258L1.00065 11.6914C0.839925 11.5466 0.926605 11.2798 1.14178 11.2571L9.80873 10.3423C10.43 10.2768 10.9691 9.88505 11.2234 9.3145L14.7717 1.35441C14.8597 1.15679 15.1403 1.15679 15.2283 1.35441Z"
            fill="transparent" stroke="#FF2E00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="star-path--3" fill-rule="evenodd" clip-rule="evenodd" d="M15.001 0.774414C14.6321 0.774113 14.2631 0.971735 14.0868 1.36728L10.6211 9.1421C10.4758 9.46813 10.1677 9.69197 9.81272 9.72944L1.34749 10.6229C0.486808 10.7137 0.140086 11.7808 0.782999 12.3602L7.10635 18.0588C7.37152 18.2977 7.4892 18.6599 7.41514 19.0091L5.64896 27.3361C5.46939 28.1828 6.37712 28.8423 7.12683 28.4099L14.5005 24.1569C14.6554 24.0676 14.8282 24.023 15.001 24.0232V0.774414Z" fill="transparent"/>
    </svg>
  </div>
</template>

<script>

export default {
  props: {
    type: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
</style>
