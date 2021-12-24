<template>
  <div class="tag-list">
    <TagBlock
      v-for="(tag, index) in tags" :key="`${tag.id}-${index}`"
      :tag="tag"
      class="tag"
    />
  </div>
</template>

<script>

export default {
  props: {
    tags: {
      type: Array,
      required: true
    },
  },
}
</script>

<style lang="scss" scoped>
.tag-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
}
.tag {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
