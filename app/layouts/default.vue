<template>
  <div :class="arcsiVisible && 'pb-16'">
    <HeaderBlock />
    <nuxt :class="$route.name === 'index' ? '' : 'pb-8'" />
    <FooterHome v-if="$route.name === 'index'" />
    <BottomArcsiPlayer />
  </div>
</template>

<script>
export default {
  computed: {
    arcsiVisible () {
      return this.$store.state.player.isArcsiVisible
    }
  }
}
</script>

<style>

</style>
