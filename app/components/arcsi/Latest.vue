<template>
  <div>
    <h3>Arcsi's Latest</h3>
    <div class="container py-8">
      <div v-for="(episode, i) in arcsiEpisodesListSortedLatest" :key="i">
        {{ episode.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      startIndex: 0,
      numberOfEpisodes: 9
    }
  },
  computed: {
    arcsiEpisodes () {
      return this.$store.state.arcsiEpisodes
    },
    arcsiEpisodesListSortedLatest () {
      if (this.arcsiEpisodes) {
        const showslist = [...this.arcsiEpisodes]
        return showslist.sort((a, b) => new Date(b.play_date) - new Date(a.play_date)).slice(this.startIndex, this.numberOfEpisodes)
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
@import "/assets/css/variables";
h3 {
    width: 100%;
    padding: 0.5rem;
    margin: 0;
    text-transform: uppercase;
    background: $black-color;
    color: white;
    font-weight: 400;
    text-align: center;
}
</style>
