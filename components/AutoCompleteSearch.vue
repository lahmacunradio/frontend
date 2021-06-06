<template>
  <div>
    <TextInput v-model='value' />
    <ul class='suggestions'>
      <li
        v-for='(suggestion, i) in suggestions'
        :key='suggestionAttribute ? suggestion.id : suggestion + i'
        class='suggestion'
      >
        {{ suggestionAttribute ? suggestion[suggestionAttribute] : suggestion }}
      </li>
    </ul>
    <p>{{value}}</p>
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
  data () {
    return {
      value: ''
    }
  },
  computed: {
    suggestions () {
      return [{ id: '1', name: 'name1' }, { id: '2', name: 'name2' }]
    }
  }
}
</script>
