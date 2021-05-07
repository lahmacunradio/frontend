<template>
  <header class="container flex-row-reverse py-4 md:flex md:flex-row">
    <div>
      <client-only>
        <RadioPlayer :show-album-art="true" :now-playing-uri="streamServer" />
      </client-only>
    </div>
    <div class="flex items-center cursor-pointer" @click="$router.push('/')">
      <img src="/img/lahmacun-logo.png" alt="" class="h-16 mr-4">
      <h1>Lahmacun Radio</h1>
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
