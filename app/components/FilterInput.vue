<template>
  <div class="search-container">
    <header class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      <div class="input-container">
        <input
          type="search"
          :placeholder="placeholder"
          @input="onChange"
        >
      </div>
    </header>
  </div>
</template>

<script>

export default {
  props: {
    placeholder: {
      type: String,
      default: 'Search'
    },
  },
  methods: {
    onChange(event) {
      this.$emit('search', event.target.value)
    }
  }
}

</script>

<style lang="scss" scoped>

.search-container {
  width: 100%;
}

header {
  padding: 1rem 0
}

.input-container {
  width: 100%;
  padding: 0 calc(1rem + 4px);
}

input {
  display: block;
  width: 100%;
  height: 30px;
  border-radius: 0.25rem;
  outline: none;
  padding: 1rem;
}
</style>
