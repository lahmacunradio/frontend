<template>
  <header class="container flex-row-reverse py-4 md:flex md:flex-row">
    <div>
      <client-only>
        <radio-player :show_album_art="true" :now_playing_uri="streamServer" />
      </client-only>
    </div>
    <div class="flex items-center cursor-pointer" @click="$router.push('/')">
      <h1>Lahmacun Radio</h1>
      <img src="/img/lahmacun-logo.png" alt="" class="h-16">
    </div>
  </header>
</template>

<script>
export default {

  components: {
  },

  data () {
    return {
      streamServer: 'https://streaming.lahmacun.hu/api/nowplaying/1'
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style scoped>
  header {
      justify-content: space-between;
      align-content: center;
  }
</style>
