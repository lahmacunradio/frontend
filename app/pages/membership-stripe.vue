<template>
  <div>
    <SubTitle title="Lahmacun show membership" :maintitle="true" />
    <div class="container my-8">
      <div class="product mb-4">
        <p>DAILY RECURRING PAYMENT</p>
        <h5>0.1 EUR</h5>
      </div>

      <form action="https://cms.lahmacun.hu/wp-json/stripe/return_checkout_session_recurring_membership" method="GET">
        <div>
          <label for="show_name">Show name:</label>
          <div class="relative max-w-md bg-white rounded-sm">
            <select v-model="show_name" class="show-select" :class="{ showSelected: show_name.length > 1 }"
              @change="selectShow">
              <option disabled selected value="">Please select a show</option>
              <option v-for="(show) in arcsiShowsList" :value="show.archive_lahmastore_base_url"
                :key="show.archive_lahmastore_base_url">
                {{ show.name }}
              </option>
            </select>
            <div class="absolute right-2 top-2 z-0">
              <i class="fa fa-chevron-down" />
            </div>
          </div>

        </div>
        <button type="submit" id="checkout-button">Checkout</button>
      </form>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      show_name: "",
    }
  },
  mounted() {
    let stripeScript = document.createElement('script')
    stripeScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.head.appendChild(stripeScript)
  },
  head() {
    return {
      title: 'Lahmacun Membership',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lahmacun Membership'
        },
      ]
    }
  },
  computed: {
    ...mapGetters({
      allShows: 'returnArcsiShows'
    }),
    arcsiShowsList() {
      if (this.allShows) {
        return this.allShows.filter(show => (
          !(show.archive_lahmastore_base_url === 'off-air' || !show.active)
        )).sort((a, b) => a.name.localeCompare(b.name))
      }
      return null
    },
  },
  methods: {
    selectShow(showname) {
      this.show_name = showname.target.value
    },
  }

}
</script>

<style scoped lang="scss">
.show-select {
  @apply block p-2 my-2 border w-full text-gray-500 z-10 relative;
}

.show-select:focus {
  @apply outline-none;
}

.show-select.showSelected {
  @apply text-black;
}

#checkout-button {
  @apply bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-sm my-8;
}
</style>
