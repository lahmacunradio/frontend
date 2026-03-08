<template>
  <div>
    <div v-if="totalCount > itemsCount && !isLoading" class="p-4 text-center load-more-container">
      <a href="#" @click.prevent="onClick">
        <div class="load-more">
          LOAD MORE
        </div>
      </a>
    </div>
    <div v-show="isLoading" class="flex flex-col items-center justify-center py-4">
      <img src="@/assets/img/preloader.svg" class="h-8 mb-2">
      Loading...
    </div>
  </div>
</template>

<script>

export default {
  props: {
    itemsCount: {
      type: Number,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    }
  },
  methods: {
    async onClick () {
      this.$emit('click')
    }
  }
}

</script>

<style lang="scss" scoped>
.load-more-container {
  display: flex;
  justify-content: center;
}
.load-more {
  width: 184.81px;
  height: 88.03px;
  background: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px / 50px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  transform: rotate(-11.5deg);
}
</style>
