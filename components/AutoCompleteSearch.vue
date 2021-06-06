<template>
  <div>
    <TextInput v-model='value' />
    <ul
      class='suggestions'
      v-show='value'
    >
      <li
        v-for='(suggestion, i) in suggestions'
        :key='suggestionAttribute ? suggestion.id : suggestion + i'
        class='suggestion'
        @click='onClick(suggestion)'
      >
        {{ suggestionAttribute ? suggestion[suggestionAttribute] : suggestion }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    items: {
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
      return this.items.filter(item => (
        this.suggestionAttribute
          ? item[this.suggestionAttribute].toLowerCase().includes(this.value.toLowerCase())
          : item.toLowerCase().includes(this.value.toLowerCase())
      ))
    }
  },
  methods: {
    onClick (item) {
      this.$emit('change', item)
    }
  }
}
</script>
