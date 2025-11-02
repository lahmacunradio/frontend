<template>
  <div class="flex flex-col min-h-screen" :class="{ 'pb-12': arcsiVisible }">
    <HeaderBlock />
    <BannerDonate />
    <nuxt class="flex-grow pb-12" />
    <FooterHome v-if="$route.name === 'index'" />
    <FooterBottom v-else />
    <BottomArcsiPlayer />
    <client-only>
      <Banner />
    </client-only>
  </div>
</template>

<script>
import { usePlayerStore } from '~/stores/player'

export default {
  name: 'DefaultLayout',
  computed: {
    arcsiVisible () { return this.player ? this.player.getArcsiVisibility : false }
  }
  ,created () {
    this.player = usePlayerStore()
  }
}
</script>
