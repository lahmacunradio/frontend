<template>
  <label class="pv-radio">
    <input
      type="radio"
      :name="name"
      :id="id"
      :value="option"
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
    // Vue 2 legacy prop name (kept for backward compatibility)
    value: { required: false },
    // Vue 3 v-model uses modelValue + update:modelValue
    modelValue: { required: false },
    option: { required: true }, // this radio's value
    name: { type: String, default: null },
    id: { type: String, default: null },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    isChecked() {
      // Prefer modelValue (Vue 3) falling back to value (Vue 2 style)
      const current = this.modelValue !== undefined ? this.modelValue : this.value;
      return current === this.option;
    }
  },
  methods: {
    onChange() {
      // Emit both Vue 3 and legacy events so v-model works across migration
      this.$emit('update:modelValue', this.option);
      this.$emit('input', this.option); // legacy
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
