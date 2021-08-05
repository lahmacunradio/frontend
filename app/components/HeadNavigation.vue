<template>
  <nav class="">
    <ul>
      <li>
        <NuxtLink to="/schedule/">
          Schedule
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/shows/">
          Shows
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/archive/">
          Archive
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/news/">
          News
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/community/">
          Community
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/photos/">
          Photos
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about/">
          About
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
