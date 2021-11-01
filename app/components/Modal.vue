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
              <div v-if="title" class="modal-header">
                <h3>{{ title }}</h3>
              </div>

              <div v-if="media" class="modal-body">
                <img :src="media">
              </div>

              <div v-if="description" class="modal-footer">
                {{ description }}
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
    media: {
      type: String,
      required: false,
      default: null
    },
    title: {
      type: String,
      required: false,
      default: null
    },
    description: {
      type: String,
      required: false,
      default: null
    },
    visibility: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
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
}

.modal-header {
    margin-top: -1rem;
    h3 {
        margin-top: 0;
        color: white;
        text-align: center;
    }
}

.modal-body {
  margin: 0;
    padding: 1rem;
  img {
    max-width: 70vw;
    max-height: 70vh;
    margin: auto;
  }
}

.modal-footer {
    padding: 0 3rem;
    text-align: center;
    font-size: 0.9rem;
    color: white;
    overflow: auto;
    max-height: 4rem;
}

.modal-default-button {
  position: fixed;
  right: 0;
  color: white;
  font-size: 2rem;
  padding: 0.5rem;
}

</style>
