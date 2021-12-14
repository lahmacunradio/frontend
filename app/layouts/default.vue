<template>
  <div class="flex flex-col min-h-screen" :class="{ 'pb-12': arcsiVisible }">
    <HeaderBlock />
    <nuxt class="flex-grow pb-12" />
    <FooterHome v-if="$route.name === 'index'" />
    <FooterBottom v-else />
    <BottomArcsiPlayer />
  </div>
</template>

<script>
export default {
  name: 'Default',
  computed: {
    arcsiVisible () {
      return this.$store.state.player.isArcsiVisible
    }
  }
}
</script>
