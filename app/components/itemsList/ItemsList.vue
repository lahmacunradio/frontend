<template>
  <div>
    <div class="container">
      <header class="flex flex-row items-center justify-between">
        <input
          type="search"
          :placeholder="placeholder"
          @input="onChange"
        >
<!--        <input-->
<!--          v-model="search"-->
<!--          class="input"-->
<!--          type="search"-->
<!--          :placeholder="placeholder"-->
<!--          @input="onChange"-->
<!--        >-->
      </header>
      <article class="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <div v-for="item in items" :key="items.id" class="items-container">
          <ItemBlock :item="item" />
        </div>
      </article>
      <Pagination
        :itemsCount="items.length"
        :totalCount="totalCount"
        :isLoading="isLoading"
        @click="callback"
      />
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
    isLoading: {
      type: Boolean
    },
    totalCount: {
      type: Number
    },
    callback: {
      type: Function,
      required: true
    },
    searchText: {
      type: String
    },
    placeholder: {
      type: String
    }
  },
  data () {
    return {
      numberOfItems: 12,
    }
  },
  methods: {
    onChange(event) {
      event.preventDefault()
      this.$emit('search', event.target.value)
    }
  },
  beforeDestroy () {
    // this.isLoading = true
  },
}
</script>

<style lang="scss" scoped>
.items-container {
  max-width: 100%;
}
input {
  display: block;
  width: 350px;
  @media (max-width: $mobile-width) {
    width: 100%;
  }
  height: 30px;
  border-radius: 0.25rem;
  outline: none;
  padding: 0 10px;
}
</style>
