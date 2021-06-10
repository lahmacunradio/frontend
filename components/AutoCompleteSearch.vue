<template>
  <div>
    <input
      type="search"
      v-model="value"
      @keydown.enter="onEnter"
    />
    <ul
      class="suggestions"
      v-show="value"
    >
      <li
        v-for="(suggestion, i) in suggestions"
        :key="suggestionAttribute ? suggestion.id : suggestion + i"
        class="suggestion"
        @click="onClick(suggestion)"
      >
        {{ suggestionAttribute ? suggestion[suggestionAttribute] : suggestion }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    defaultItems: {
      required: true,
      type: Array
    },
    suggestionAttribute: {
      required: false,
      type: String,
      default: null
    }
  },
  model: {
    prop: 'items',
    event: 'change'
  },
  data () {
    return {
      value: ''
    }
  },
  computed: {
    suggestions () {
      return this.getSuggestions()
    }
  },
  methods: {
    withAttribute (item) {
      return (
        item[this.suggestionAttribute]
          .toLowerCase()
          .includes(this.value.toLowerCase()) ||
        item.description.toLowerCase()
          .includes(this.value.toLowerCase())
      )
    },
    withoutAttribute (item) {
      return item.toLowerCase().includes(this.value.toLowerCase())
    },
    getSuggestions () {
      return this.defaultItems.filter(item => (
        this.suggestionAttribute
          ? this.withAttribute(item)
          : this.withoutAttribute(item)
      ))
    },
    emitResult (result) {
      this.$emit('update', result)
      this.value = ''
    },
    onClick (item) {
      this.emitResult([item])
    },
    onEnter () {
      this.emitResult(this.suggestions)
    }
  }
}
</script>
