<template>
  <nav class="">
    <ul>
      <li :class="baseRoute === '/schedule/' && 'selected'">
        <NuxtLink to="/schedule/">
          Schedule
        </NuxtLink>
      </li>
      <li :class="baseRoute === '/shows/' && 'selected'">
        <NuxtLink to="/shows/">
          Shows
        </NuxtLink>
      </li>
      <li :class="baseRoute === '/archive/' && 'selected'">
        <NuxtLink to="/archive/">
          Archive
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
      <li :class="baseRoute === '/about/' && 'selected'">
        <NuxtLink to="/about/">
          About
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  computed: {
    baseRoute () {
      const basicRoute = this.$route.path.split('/')[1]
      return `/${basicRoute}/`
    }
  }
}
</script>

<style lang="scss" scoped>
  nav {
      font-size: 1rem;
      ul {
        padding:0;
        margin: 0;
        li {
            display: inline-block;
            margin: -1.5rem;
            text-transform: uppercase;
            position: relative;
            padding: 1rem 2rem;
            &.selected {
                background: url('/img/selected-menu.svg') no-repeat center center;
                background-size: 7rem;
                z-index: 0;
            }
            a {
              z-index: 5;
              position: relative;
            }
        }
      }
  }
</style>
