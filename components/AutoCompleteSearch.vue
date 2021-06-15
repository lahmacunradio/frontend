<template>
  <div>
    <input
      class="input"
      :class="{'open': value}"
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
    },
    searchFields: {
      required: false,
      type: Array
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
        this.searchFields.some(field => (
          item[field].toLowerCase().includes(this.value.toLowerCase()))
        )
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
<style scoped>
  .input {
    position: relative;
    width: 350px;
    height: 30px;
    border-radius: 10px;
    outline: none;
    padding: 0 10px;
  }
  .open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .suggestions {
    position: absolute;
    width: 350px;
    height: max-content;
    max-height: 200px;
    overflow: scroll;
    padding: 0 10px;
    background: #ffffff;
  }
</style>
