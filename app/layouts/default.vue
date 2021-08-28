<template>
  <div>
    <HeaderBlock />
    <nuxt class="py-8" />
    <FooterHome v-if="$route.name === 'index'" />
    <BottomArcsiPlayer />
  </div>
</template>

<style>

</style>
