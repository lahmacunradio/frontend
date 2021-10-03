<template>
  <div class="container">
    <input
      v-model="value"
      class="input"
      :class="{'open': isOpen}"
      type="search"
      :placeholder="placeHolder"
      @input="listChange"
      @keydown.enter="onEnter"
    >
    <ul
      v-show="isOpen"
      class="suggestions"
    >
      <li
        v-for="(suggestion, i) in suggestions"
        :key="suggestionAttribute ? suggestion.id : suggestion + i"
        :ref="i === itemCounter ? `focusItem` : null"
        class="suggestion"
        :class="{ 'is-active': i === itemCounter }"
        @click="onClick(suggestion)"
      >
        {{ suggestionAttribute ? suggestion[suggestionAttribute] : suggestion }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'items',
    event: 'change'
  },
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
    },
    placeHolder: {
      required: false,
      type: String
    }
  },
  data () {
    return {
      value: '',
      itemCounter: -1,
      isOpen: false,
      suggestions: []
    }
  },
  mounted () {
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed () {
    document.removeEventListener('click', this.handleClickOutside)
  },
  updated () {
    if (this.$refs.focusItem) {
      if (this.$refs.focusItem.length) {
        this.$refs.focusItem[0].scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
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
      this.suggestions = this.defaultItems.filter(item => (
        this.suggestionAttribute
          ? this.withAttribute(item)
          : this.withoutAttribute(item)
      ))
    },
    emitResult (result) {
      this.isOpen = false
      this.$emit('update', result)
    },
    onClick (item) {
      this.value = this.suggestionAttribute ? item[this.suggestionAttribute] : item
      this.emitResult([item])
    },
    onEnter () {
      if (this.itemCounter >= 0) {
        this.value =
          this.suggestionAttribute
            ? this.suggestions[this.itemCounter][this.suggestionAttribute]
            : this.suggestions
      }
      this.emitResult(this.itemCounter >= 0
        ? [this.suggestions[this.itemCounter]]
        : this.suggestions)
    },
    onChange () {
      this.getSuggestions()
      this.isOpen = Boolean(this.value) && this.suggestions.length > 0
      this.itemCounter = -1
    },
    listChange () {
      this.getSuggestions()
      this.isOpen = Boolean(this.value) && this.suggestions.length > 0
      this.itemCounter = -1

      if (this.itemCounter >= 0) {
        this.value =
          this.suggestionAttribute
            ? this.suggestions[this.itemCounter][this.suggestionAttribute]
            : this.suggestions
      }
      this.emitResult(this.itemCounter >= 0
        ? [this.suggestions[this.itemCounter]]
        : this.suggestions)
    },
    handleClickOutside (event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false
        this.itemCounter = -1
      }
    }
  }
}
</script>
<style scoped>
  .input {
    position: relative;
    width: 350px;
    height: 30px;
    border-radius: 0.25rem;
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
    padding: 0 10px 10px 10px;
    background: #ffffff;
    border-radius: 0 0 0.25rem 0.25rem;
    border-top-style: solid;
    border-top-color: #7f828b;
    border-top-width: 2px;
  }
  .suggestion {
    cursor: pointer;
    border-radius: 0.25rem;
    padding: 3px;
  }
  .suggestion:hover {
    background: #e7e7e7;
  }
  .is-active {
    background: #e7e7e7;
  }
</style>
