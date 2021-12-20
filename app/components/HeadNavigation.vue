<template>
  <nav class="">
    <ul>
      <li :class="baseRoute === '/schedule/' && 'selected'">
        <NuxtLink to="/schedule/">
          Schedule
        </NuxtLink>
      </li>
      <li :class="baseRoute === '/shows/' && routeArray.length < 4 && 'selected'">
        <NuxtLink to="/shows/">
          Shows
        </NuxtLink>
      </li>
      <li :class="(baseRoute === '/arcsive/' || (baseRoute === '/shows/' && routeArray.length === 4)) && 'selected'">
        <NuxtLink to="/arcsive/">
          Arcsive
        </NuxtLink>
      </li>
      <li :class="baseRoute === '/news/' && 'selected'">
        <NuxtLink to="/news/">
          News
        </NuxtLink>
      </li>
      <li :class="baseRoute === '/community/' && 'selected'">
        <NuxtLink to="/community/">
          Community
        </NuxtLink>
      </li>
      <li :class="baseRoute === '/photos/' && 'selected'">
        <NuxtLink to="/photos/">
          Photos
        </NuxtLink>
      </li>
      <li :class="baseRoute === '/donate/' && 'selected'">
        <NuxtLink to="/donate/">
          Donate
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  computed: {
    routeArray () {
      return this.$route.path.split('/')
    },
    baseRoute () {
      const basicRoute = this.routeArray[1]
      return `/${basicRoute}/`
    }
  }
}
</script>

<style lang="scss" scoped>
  nav {
      font-size: 0.9rem;
      font-weight: 500;
      ul {
        padding:0;
        margin: 0;
        @media (max-width: $tablet-width) {
          margin: 0.5rem 0;
        }
        @media (max-width: $mobile-width) {
          text-align: center;
        }
        li {
          display: inline-block;
          margin: 0.5rem 0.5rem 0.25rem;
          text-transform: uppercase;
          position: relative;
          padding: 0;
          border-bottom: 0.25rem solid transparent;
          @media (max-width: $notebook-width) {
            margin: 0 0.5rem;
          }
          &.selected {
            border-bottom-color: $lahma-pink;
          }
          a {
            z-index: 5;
            position: relative;
          }
        }
      }
  }
</style>
