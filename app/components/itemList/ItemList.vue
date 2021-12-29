<template>
  <div>
    <div class="items-container">
      <article class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <div v-for="(item, index) in items" :key="`${item.id}-${index}`">
          <ItemBlock :item="item" />
        </div>
        <p v-show="items.length <= 0 && !isLoading" class="italic text-container">
          {{ noFoundMessage }}
        </p>
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
    noFoundMessage: {
      type: String,
      default: 'No matching items found'
    },
    isLoading : {
      type: Boolean,
      request: true
    }
  },
}
</script>

<style lang="scss" scoped>
.items-container {
  max-width: 100%;
}

.text-container {
  padding: 0 calc(1rem + 4px);
}
</style>
