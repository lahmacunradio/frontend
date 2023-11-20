<template>
  <div>
    <SubTitle title="Lahmacun Stripe" :maintitle="true" />
    <div class="container my-8">
      <div class="product">
        <img src="@/assets/img/lahma_logo_1.svg" alt="Lahmacun Radio" class="w-24 logo">
        <div class="description">
          <h3>Lahmacun show membership</h3>
          <p>DAILY RECURRING PAYMENT</p>
          <h5>0.1 EUR</h5>
        </div>
      </div>

      <form action="https://cms.lahmacun.hu/wp-json/stripe/return_checkout_session_recurring_membership" method="GET">
        <div>
          <label for="show_name">Show name:</label>
          <input name="show_name" id="show_name" value="MMN radio" />
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
    }
  },
  mounted() {
    let stripeScript = document.createElement('script')
    stripeScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.head.appendChild(stripeScript)
  },
  head () {
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
    arcsiShowsList () {
      if (this.allShows) {
        return this.allShows.filter(show => (
          !(show.archive_lahmastore_base_url === 'off-air' || !show.active)
        )).sort((a, b) => a.name.localeCompare(b.name))
      }
      return null
    },
  },

}
</script>
