<template>
  <nav class="">
    <ul>
      <li>
        <NuxtLink to="/about/">
          About Us
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/shows/">
          Shows
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/schedule/">
          Schedule
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
  nav {
      font-size: 1rem;
      ul {
        padding:0;
        margin: 0;
        li {
            display: inline-block;
            margin-right: 1rem;
            text-transform: uppercase;
        }
      }
  }
</style>
