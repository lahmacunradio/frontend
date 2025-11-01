<template>
  <label class="pv-radio">
    <input
      type="radio"
      :name="name"
      :id="id"
      :disabled="disabled"
      :checked="isChecked"
      @change="onChange"
      class="pv-radio-input"
    />
    <span class="pv-radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
export default {
  name: 'RadioButton',
  props: {
    value: { required: false }, // v-model current value
    option: { required: true }, // this radio's value
    name: { type: String, default: null },
    id: { type: String, default: null },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    isChecked() {
      return this.value === this.option;
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.option);
      this.$emit('change', this.option);
    }
  }
}
</script>

<style scoped>
.pv-radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.pv-radio-input {
  width: 1rem;
  height: 1rem;
}
.pv-radio-label {
  font-family: inherit;
}
</style>
