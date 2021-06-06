<template>
  <input
    type='text'
    :value='value'
    @input='onChange'
  />
</template>

<script>
export default {
  props: {
    value: String
  },
  methods: {
    onChange (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>
