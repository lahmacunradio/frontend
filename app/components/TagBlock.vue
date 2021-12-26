<template>
  <NuxtLink :to="tag.link" class="tag-item">
    {{ tag.name }}
  </NuxtLink>
</template>

<script>
export default {
  props: {
    tag: {
      type: Object,
      required: true
    },
  },
}
</script>

<style lang="scss" scoped>
.tag-item {
  background-color: #FFFFFF;
  display: inline-block;
  padding: 0.25rem 0.75rem;
}

.tag-item:hover {
  color: $lahma-pink;
}
</style>
