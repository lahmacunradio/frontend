<template>
  <div class="grid gap-8 pb-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <div v-for="show in shows" :key="show.id" class="max-w-sm overflow-hidden bg-white rounded shadow-lg cursor-pointer">
      <NuxtLink :to="'/shows/' + show.archive_lahmastore_base_url">
        <div class="show-block relative">
          <div class="show-img aspect-ratio-1/1">
            <img
              class="block"
              :src="show.cover_image_url"
              :alt="show.name"
            >
          </div>
          <div class="show-title absolute bottom-0 z-10 w-full p-2 text-center text-white bg-black text-lg font-bold">
            {{ show.name }}
          </div>
          <div class="show-desc p-6">
            <div class="showdescription">
              {{ truncate(show.description, 200) }}
            </div>
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
  },
  data () {
    return {
      showDescription: false
    }
  }
}
</script>

<style lang="scss" scoped>
.show-block {
  overflow: hidden;
  .show-desc {
    display: none;
    position: absolute;
    top: 0;
    overflow-wrap: break-word;
    max-width: 100%;
  }
  .show-img {
    opacity: 1;
    transition: opacity 0.3s;
  }
  img {
    min-height: 100%;
    min-width: 100%;
    object-fit: cover;
  }
  &:hover {
    .show-img {
      opacity: 0;
    }
    .show-desc {
      display: block;
    }
  }
}

</style>
