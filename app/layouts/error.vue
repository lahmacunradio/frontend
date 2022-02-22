<template>
  <div>
    <h2 class="title-block">
      Error page
    </h2>
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
        <img src="@/assets/img/lahma_citrom_transparent.png" alt="" class="w-full py-8 mx-auto md:w-96">
        Try the Home page
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'bare',
  props: ['error'],
  data () {
    return {
      tryReloadInterval: null,
      isClient: typeof window !== 'undefined' && window.document
    }
  },
  mounted () {
    if (this.isClient) {
      this.tryReloadInterval = setInterval(() => {
        window.location.reload()
      }, 30000)
    }
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
