<template>
  <div>
    <div class="container items-container">
      <header v-if="isFilter" class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <div class="input-container">
          <input
            type="search"
            :placeholder="placeholder"
            @input="onChange"
          >
        </div>
      </header>
      <article class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <div v-for="(item, index) in items" :key="`${item.id}-${index}`">
          <ItemBlock :item="item" />
        </div>
      </article>
      <Pagination
        :items-count="items.length"
        :total-count="totalCount"
        :is-loading="isLoading"
        @click="callback"
      />
    </div>
  </div>
</template>

<script>

export default {
  props: {
    items: {
      type: Array,
      request: true
    },
    isLoading: {
      type: Boolean
    },
    totalCount: {
      type: Number,
      required: true
    },
    callback: {
      type: Function,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Search'
    },
    isFilter: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onChange (event) {
      this.$emit('search', event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  padding: 1rem 0
}

.items-container {
  max-width: 100%;
}

.input-container {
  width: 100%;
  padding: 0 calc(1rem + 4px);
}

input {
  display: block;
  width: 100%;
  @media (max-width: $mobile-width) {
    width: 100%;
  }
  height: 30px;
  border-radius: 0.25rem;
  outline: none;
  padding: 1rem;
}
</style>
