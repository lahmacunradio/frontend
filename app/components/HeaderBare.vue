<template>
  <header class="flex-row-reverse items-center px-4 py-4 bg-white md:flex md:flex-row">
    <div class="items-center md:flex">
      <div class="block mr-4 cursor-pointer" @click="$router.push('/')">
        <img src="@/assets/img/lahmacun-logo.png" alt="" class="w-24 logo">
      </div>
    </div>
    <h2>
      Lahmacun radio
    </h2>
  </header>
</template>

<script>

export default {
  data () {
    return {
    }
  }

}
</script>

<style lang="scss" scoped>
  header {
      .logo {
        min-width: 6rem;
      }
  }
</style>
