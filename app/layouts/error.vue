<template>
  <div class="error-page">
    <h1 v-if="error.statusCode === 404">
      Page not found
    </h1>
    <h1 v-else-if="error.statusCode === 500">
      Server error
    </h1>
    <h1 v-else>
      An error occurred
    </h1>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: ['error'] // you can set a custom layout for the error page
}
</script>

<style lang="scss" scoped>
.error-page {
  background: $lahma-pink;
  @apply flex flex-col align-middle justify-items-center;
}
</style>
