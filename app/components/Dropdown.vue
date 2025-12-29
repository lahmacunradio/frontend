<template>
  <div class="pv-dropdown">
    <select
      :value="valueToString(currentValue)"
      class="pv-select"
      :disabled="disabled"
      @change="onChange"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="(opt, idx) in options || []"
        :key="idx"
        :value="optionValueString(opt)"
      >
        {{ optionLabelText(opt) }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "DropDown",
  props: {
    // Vue 3 v-model uses modelValue + update:modelValue
    modelValue: { required: false, type: null, default: undefined },
    options: { type: Array, default: () => [] },
    optionLabel: { type: String, default: "label" },
    optionValue: { type: String, default: "value" },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    }
  },
  methods: {
    onChange(e) {
      const raw = e.target.value;
      // Try to match option by serialized value first to preserve original types
      const match = this.options.find((o) => this.optionValueString(o) === raw);
      if (match !== undefined) {
        const val = this.getOptionValue(match);
        this.$emit('update:modelValue', val);
        this.$emit('input', val);
        this.$emit('change', val);
        return;
      }
      // fallback: try to parse JSON, otherwise emit raw
      try {
        const parsed = JSON.parse(raw);
        this.$emit('update:modelValue', parsed);
        this.$emit('input', parsed);
        this.$emit('change', parsed);
      } catch (err) {
        this.$emit('update:modelValue', raw);
        this.$emit('input', raw);
        this.$emit('change', raw);
      }
    },
    getOptionValue(opt) {
      if (opt !== null && typeof opt === 'object') {
        if (this.optionValue in opt) return opt[this.optionValue];
        if (this.optionLabel in opt) return opt[this.optionLabel];
        return opt;
      }
      return opt;
    },
    optionValueString(opt) {
      const v = this.getOptionValue(opt);
      if (v === null || v === undefined) return '';
      if (typeof v === 'object') return JSON.stringify(v);
      return String(v);
    },
    optionLabelText(opt) {
      if (opt !== null && typeof opt === 'object') {
        if (this.optionLabel in opt) return opt[this.optionLabel];
        if ('label' in opt) return opt.label;
        return JSON.stringify(opt);
      }
      return String(opt);
    },
    valueToString(val) {
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    }
  }
}
</script>

<style scoped>
.pv-select {
  min-width: 160px;
  padding: 0.4rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #fff;
  font-family: inherit;
}
</style>
