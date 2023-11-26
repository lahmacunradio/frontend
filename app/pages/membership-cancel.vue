<template>
  <div>
    <SubTitle title="Lahmacun membership" :maintitle="true" />
    <div class="container my-8">
      <h2>Cancel membership</h2>
      <p>Do you really want to cancel your Membership?</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  head() {
    return {
      title: 'Cancel Lahmacun Membership',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Cancel Lahmacun Membership'
        },
      ]
    }
  },
}
</script>

<style lang="sass" scoped>

</style>
