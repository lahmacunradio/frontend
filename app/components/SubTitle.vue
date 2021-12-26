<template>
  <div>
    <h2 class="title-block">
      <NuxtLink v-if="url" :to="url">
        {{title}}
      </NuxtLink>
      <span v-else>{{title}}</span>
    </h2>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.title-block {
  width: 100%;
  padding: 0.75rem;
  margin: 0;
  text-transform: uppercase;
  background: $black-color;
  color: white;
  font-weight: 500;
  text-align: center;
}
</style>
