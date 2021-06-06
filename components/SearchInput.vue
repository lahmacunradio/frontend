<template>
  <div>
    <input type='text'/>
    <ul class='suggestions'>
      <li
        v-for='(suggestion) in suggestions'
        :key='suggestion.id'
        class='suggestion'
      >
        {{suggestion[suggestionAttribute]}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    suggestions: {
      required: true,
      type: Array
    },
    suggestionAttribute: {
      required: true,
      type: String
    }
  }
}
</script>
