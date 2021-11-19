<template>
  <div class="container pt-8 text-center error-page">
    <h1 v-if="error.statusCode === 404">
      Page not found
    </h1>
    <h1 v-else-if="error.statusCode === 500">
      {{ error.message || 'Server error' }}
    </h1>
    <h1 v-else>
      An error occurred
    </h1>
    <NuxtLink to="/">
      <img src="@/assets/img/lahmacun-logo.png" alt="" class="h-48 py-8 mx-auto">
      Try the Home page
    </NuxtLink>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: ['error'],
  data () {
    return {
      tryReloadInterval: null
    }
  },
  mounted () {
    this.tryReloadInterval = setInterval(() => {
      window.location.reload()
    }, 5000)
  },
  beforeDestroy () {
    clearInterval(this.tryReloadInterval)
  }
}
</script>

<style lang="scss" scoped>
.error-page {
  background: $lahma-pink;
  @apply flex flex-col align-middle justify-items-center;
}
</style>
