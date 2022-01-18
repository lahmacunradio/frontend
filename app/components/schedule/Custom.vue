<template>
  <div class="dayblock">
    <div class="container">
      {{ show }}
    </div>
  </div>
</template>

<script>
export default {
    props: {
      show: {
        type: Object,
        required: true
      }
  },
}
</script>

<style>

</style>