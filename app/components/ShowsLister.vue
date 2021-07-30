<template>
  <div class="container grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8">
    <div v-for="show in shows" :key="show.id" class="max-w-sm overflow-hidden bg-white rounded shadow-lg cursor-pointer">
      <NuxtLink :to="'/shows/' + show.archive_lahmastore_base_url">
        <div class="show-image">
          <img
            class="w-full"
            :src="show.cover_image_url"
            :alt="show.name"
          >
        </div>
        <div class="px-6 py-4">
          <div class="mb-2 text-xl font-bold">
            {{ show.name }}
          </div>
          <div class="showdescription">
            {{ truncate(show.description, 300) }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shows: {
      required: true,
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>
.show-image {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  align-content: center;
  img {
    min-height: 300px;
    min-width: 300px;
    object-fit: cover;
  }
}
</style>
