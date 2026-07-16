<template>
  <div>
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
        :ref="i === showCounter ? `focusShow` : null"
        class="suggestion"
        :class="{ 'is-active': i === showCounter }"
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
    defaultShows: {
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
      showCounter: -1,
      isOpen: false,
      suggestions: []
    }
  },
  mounted () {
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed () {
    document.removeEventListener('click', this.handleClickOutside)
    this.suggestions = []
  },
  updated () {
    if (this.$refs.focusShow) {
      if (this.$refs.focusShow.length) {
        this.$refs.focusShow[0].scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    }
  },
  methods: {
    withAttribute (show) {
      return (
        this.searchFields.some(field => (
          show[field].toLowerCase().includes(this.value.toLowerCase()))
        )
      )
    },
    withoutAttribute (show) {
      return show.toLowerCase().includes(this.value.toLowerCase())
    },
    getSuggestions () {
      this.suggestions = this.defaultShows.filter(show => (
        this.suggestionAttribute
          ? this.withAttribute(show)
          : this.withoutAttribute(show)
      ))
    },
    emitResult (result) {
      this.isOpen = false
      this.$emit('update', result)
    },
    onClick (show) {
      this.value = this.suggestionAttribute ? show[this.suggestionAttribute] : show
      this.emitResult([show])
    },
    onEnter () {
      if (this.showCounter >= 0) {
        this.value =
          this.suggestionAttribute
            ? this.suggestions[this.showCounter][this.suggestionAttribute]
            : this.suggestions
      }
      this.emitResult(this.showCounter >= 0
        ? [this.suggestions[this.showCounter]]
        : this.suggestions)
    },
    onChange () {
      this.getSuggestions()
      this.isOpen = Boolean(this.value) && this.suggestions.length > 0
      this.showCounter = -1
    },
    listChange () {
      this.getSuggestions()
      this.isOpen = Boolean(this.value) && this.suggestions.length > 0
      this.showCounter = -1

      if (this.showCounter >= 0) {
        this.value =
          this.suggestionAttribute
            ? this.suggestions[this.showCounter][this.suggestionAttribute]
            : this.suggestions
      }
      this.emitResult(this.showCounter >= 0
        ? [this.suggestions[this.showCounter]]
        : this.suggestions)
    },
    handleClickOutside (event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false
        this.showCounter = -1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .input {
    position: relative;
    width: 350px;
    @media (max-width: $mobile-width) {
      width: 100%;
    }
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
