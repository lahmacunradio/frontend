<template>
  <nav class="container mb-4">
    <ul>
      <li>
        <NuxtLink to="/shows/">
          Shows
        </NuxtLink>
      </li>
      <li>Photos</li>
      <li>Sponsors</li>
      <li>
        <NuxtLink to="/about/">
          About Us
        </NuxtLink>
      </li>
      <li>Donate</li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
  nav {
      border-bottom: 1px solid grey;
      font-size: 1.2rem;
      ul {
        padding:0;
        margin: 0;
        li {
            display: inline-block;
            margin-right: 1rem;
        }
      }
  }
</style>
