<template>
  <div>
    <SubTitle title="Error page" />
    <NuxtLink to="/">
      <img src="@/assets/img/lahma_citrom_transparent.png" alt="" class="w-full pt-8 mx-auto md:w-80">
      <div class="container py-8 text-center error-page">
        <h1 v-if="error.statusCode === 404">
          Page {{ $route && `"${$route.path}"` }} not found
        </h1>
        <h1 v-else-if="error.statusCode === 500">
          {{ error.message || 'Server error' }}
        </h1>
        <h1 v-else-if="error.statusCode === 401">
          {{ error.message || 'Arcsi unauthorized' }}
        </h1>
        <h1 v-else>
          An error occurred
        </h1>
        Try the Home page
      </div>
    </NuxtLink>
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
        if (this.error.statusCode !== 404) {
          window.location.reload()
        } else {
          window.location.href = '/'
        }
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
  h1 {
    @apply text-4xl mb-2;
  }
}
</style>
