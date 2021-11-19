<template>
  <div>
    <transition name="modal">
      <div v-if="showModal" id="modal-template">
        <div class="modal-mask" @click="$emit('close')">
          <button class="modal-default-button" @click="$emit('close')">
            ×
          </button>

          <div class="modal-wrapper">
            <div class="modal-container">
              <div v-if="gallery[galleryPosition].title" class="modal-header">
                <h3>{{ gallery[galleryPosition].title }}</h3>
              </div>

              <div class="relative z-50 w-full modal-body">
                <a v-if="galleryPosition !== 0" href="#" class="previous" @click.prevent.stop="goToPrevious()">
                  <i class="fa fa-angle-left" aria-hidden="true" />
                </a>
                <img :src="gallery[galleryPosition].full_image_url" :srcset="gallery[galleryPosition].large_srcset">
                <a v-if="galleryPosition !== gallery.length - 1" href="#" class="next" @click.prevent.stop="goToNext()">
                  <i class="fa fa-angle-right" aria-hidden="true" />
                </a>
              </div>

              <div v-if="gallery[galleryPosition].caption" class="modal-footer">
                {{ gallery[galleryPosition].caption }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    visibility: {
      type: Boolean,
      required: true,
      default: false
    },
    gallery: {
      type: Array,
      required: false,
      default: null
    },
    galleryItemId: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data () {
    return {
      galleryPosition: 0
    }
  },
  computed: {
    showModal () {
      return this.visibility
    }
  },
  watch: {
    showModal (val) {
      val ? document.body.style.overflow = 'hidden' : document.body.style.overflow = ''
    }
  },
  destroyed () {
    document.removeEventListener('keydown', this.bindControls)
  },
  mounted () {
    if (this.gallery && this.galleryItemId) {
      this.galleryPosition = this.galleryItemId
    }
    document.addEventListener('keydown', (e) => {
      this.bindControls(e)
    })
  },
  methods: {
    bindControls (e) {
      if (e.key === 'Escape') {
        this.$emit('close')
      }
      if (e.key === 'ArrowLeft') {
        this.goToPrevious()
      }
      if (e.key === 'ArrowRight') {
        this.goToNext()
      }
    },
    goToPrevious () {
      if (this.galleryPosition !== 0) {
        this.galleryPosition--
      }
    },
    goToNext () {
      if (this.galleryPosition !== this.gallery.length - 1) {
        this.galleryPosition++
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  margin: 0px auto;
  padding: 3rem;
  transition: all 0.3s ease;
  @media (max-width: $mobile-width) {
    padding: 0.3rem;
  }
}

.modal-header {
    margin-top: -1rem;
    h3 {
        margin-top: 0;
        color: white;
        text-align: center;
        max-width: 95vw;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.modal-body {
  margin: 0;
  img {
    max-width: 80vw;
    max-height: 80vh;
    margin: auto;
    @media (max-width: $mobile-width) {
      max-width: 95%;
      max-height: 95%;
    }
  }
  a {
    color: white;
    position: absolute;
    top: 40%;
    font-size: 3rem;
    padding: 1rem;
    &.previous {
        left: 0;
    }
    &.next {
        right: 0;
    }
  }
}

.modal-footer {
    padding: 1rem 3rem;
    text-align: center;
    font-size: 0.8rem;
    color: white;
    overflow: auto;
    max-height: 4rem;
}

.modal-default-button {
    position: fixed;
    right: 0;
    color: white;
    font-size: 2rem;
    padding: 1.5rem 1rem;
    line-height: 0;
}

</style>
