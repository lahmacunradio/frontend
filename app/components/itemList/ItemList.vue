<template>
  <div>
    <div class="container items-container">
      <article class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <div v-for="(item, index) in items" :key="`${item.id}-${index}`">
          <ItemBlock :item="item" />
        </div>
      </article>
    </div>
  </div>
</template>

<script>

export default {
  props : {
    items: {
      type: Array,
      request: true
    },
  },
}
</script>

<style lang="scss" scoped>
.items-container {
  max-width: 100%;
}
</style>
