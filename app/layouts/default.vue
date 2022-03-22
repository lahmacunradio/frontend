<template>
  <div class="flex flex-col min-h-screen" :class="{ 'pb-12': arcsiVisible }">
    <HeaderBlock />
    <nuxt class="flex-grow pb-12 min-h-64" />
    <FooterHome v-if="$route.name === 'index'" />
    <FooterBottom v-else />
    <BottomArcsiPlayer />
    <Banner />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DefaultLayout',
  computed: {
    ...mapGetters('player', {
      arcsiVisible: 'getArcsiVisibility'
    })
  }
}
</script>
