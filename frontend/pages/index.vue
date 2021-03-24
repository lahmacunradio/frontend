<template>
  <div class="container">
    <div class="m-4 text-center title">
      <h1>Lahmacun Radio Home</h1>
    </div>
    <section class="flex flex-row">
      <div>
        <h3>News</h3>
      </div>
      <div>
        <h3>Schedule</h3>
        <div v-for="show in sortShowsForSchedule" :key="show.id">
          <div>
            {{ show.name }} - {{ show.start }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
    }
  },
  apollo: {
  },
  computed: {
    sortShowsForSchedule () {
      return [...this.arcsishows].sort((a, b) => parseInt(a.start) - parseInt(b.start)).sort((a, b) => a.day - b.day)
    },
    arcsishows () {
      return this.$store.state.arcsiShows
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
