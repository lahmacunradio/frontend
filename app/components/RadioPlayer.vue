<template>
  <div class="stations nowplaying altalanosinfok">
    <div class="radio-player-widget">
      <template v-if="is_playing">
        <audio id="lahmastream" ref="player" :title="np.now_playing.song.text" />
      </template>

      <div class="now-playing-details">
        <div class="radio-controls">
          <a class="bigplay-button" href="#" @click.prevent="toggle()">
            <img v-if="is_playing" src="@/assets/img/pause-gomb.svg" alt="Pause Lahmacun radio" class="pause-button">
            <img v-else src="@/assets/img/play_gomb.svg" alt="Play Lahmacun radio" class="play-button">
          </a>
          <div v-if="false">
            <!-- old show image -->
            <div v-if="showAlbumArt && np.now_playing.song.art" class="now-playing-art">
              <a class="cursor-pointer programimage" rel="playerimg" @click.stop="streamModal = !streamModal">
                <div v-if="show_check === true" class="onair">On air</div>
                <img class="progimg" :src="show_art_url" :alt="'album_art_alt'">
              </a>
              <Modal :media="show_art_url" :title="show_title" :description="show_subtitle" :visibility="streamModal" @close="closeModal" />
            </div>
          </div>

          <div class="play-volume-controls">
            <div v-if="false">
              <!-- old play button -->
              <div v-if="is_playing" class="radio-control-play-button">
                <a href="#" role="button" :title="'pause_btn'" :aria-label="'pause_btn'" @click.prevent="toggle()">
                  <i class="material-icons lg" aria-hidden="true">pause_circle_outline</i>
                </a>
              </div>
              <div v-else class="radio-control-play-button">
                <a href="#" role="button" :title="'play_btn'" :aria-label="'play_btn'" @click.prevent="toggle()">
                  <i class="material-icons lg" aria-hidden="true">play_circle_outline</i>
                </a>
              </div>
            </div>

            <div class="now-playing-main" :class="{ 'player-no-volume-touch': isTouchEnabled }">
              <div class="media-body">
                <div v-if="np.now_playing.song.title !== ''">
                  <h4 :title="show_title" class="now-playing-title">
                    <nuxt-link v-if="show_check === true" :to="show_url">
                      <span>{{ show_title }}&nbsp;</span>
                      <i class="fa fa-link" aria-hidden="true" />
                    </nuxt-link>

                    <a
                      v-if="check_offairlink === true"
                      :href="np.now_playing.song.custom_fields.offairlink"
                      target="_blank"
                    >
                      <span>{{ show_title }}&nbsp;</span>
                      <i class="fa fa-link" aria-hidden="true" />
                    </a>

                    <span v-if="show_check === false && check_offairlink === false">{{ show_title }}</span>
                  </h4>
                  <h5 :title="show_subtitle" class="now-playing-artist">
                    {{ show_subtitle }}
                  </h5>
                </div>
                <div v-else>
                  <h4 class="now-playing-title">
                    {{ show_title }}
                  </h4>
                </div>
              </div>
              <div v-if="!isTouchEnabled" id="radio-player-controls" class="hidden radio-controls-standalone volumecontrolos sm:block">
                <i class="fa fa-volume-off" />
                <div class="radio-control-volume-slider">
                  <vue-slider
                    v-model="volume"
                    :height="16"
                    tooltip="none"
                    :dot-size="16"
                  />
                </div>
                <i class="fa fa-volume-up" />
              </div>
            </div>

            <div v-if="time_display_played" class="time-display" style="display:none;">
              <div class="time-display-played text-secondary">
                {{ time_display_played }}
              </div>
              <div class="time-display-progress">
                <div class="progress">
                  <div class="progress-bar bg-secondary" role="progressbar" :style="{ width: time_percent+'%' }" />
                </div>
              </div>
              <div class="time-display-total text-secondary">
                {{ time_display_total }}
              </div>
            </div>
          </div>
        </div>

        <div class="radio-control-select-stream" style="display:none;">
          <div v-if="streams.length > 1" class="dropdown">
            <button
              id="btn-select-stream"
              class="btn btn-sm btn-outline-primary dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {{ current_stream.name }}
            </button>
            <div class="dropdown-menu" aria-labelledby="btn-select-stream">
              <a v-for="stream in streams" :key="stream.name" class="dropdown-item" href="javascript:;" @click="switchStream(stream)">
                {{ stream.name }}
              </a>
            </div>
          </div>
        </div>
        <div v-if="false" class="hidden sand-clock sm:block">
          <IconSandclock :progress="time_percent" :live="!!np.live.is_live.length" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
// import theme
import 'vue-slider-component/theme/default.css'

export default {
  components: {
    VueSlider
  },
  props: {
    nowPlayingUri: {
      type: String,
      required: true
    },
    showAlbumArt: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      streamModal: false,
      np: {
        live: {
          is_live: 'Is Live',
          streamer_name: 'Streamer Name'
        },
        station: {
          listen_url: '',
          mounts: [],
          remotes: []
        },
        now_playing: {
          song: {
            title: 'Title',
            artist: 'Artist',
            text: 'Lahmacun Radio',
            art: '',
            custom_fields: {
              offairlink: null
            }
          },
          is_request: false,
          elapsed: 0,
          duration: 0
        },
        song_history: {}
      },
      is_playing: false,
      volume: 55,
      current_stream: {
        name: '',
        url: ''
      },
      audio: null,
      np_timeout: null,
      np_interval: null,
      clock_interval: null,
      timeOutHelper: null,

      // rework the checks
      default_art_url: require('@/assets/img/stream/defaultshowart.jpg'),
      default_azuracast_art_url: require('@/assets/img/stream/generic_song.jpg'),
      docTitleSetter: null
    }
  },
  computed: {
    streams () {
      const allStreams = []
      this.np.station.mounts.forEach(function (mount) {
        allStreams.push({
          name: mount.name,
          url: mount.url
        })
      })
      this.np.station.remotes.forEach(function (remote) {
        allStreams.push({
          name: remote.name,
          url: remote.url
        })
      })
      return allStreams
    },
    arcsiList () {
      return [...this.$store.getters.returnArcsiShows]
    },
    currentShowArcsi () {
      if (this.np.live.is_live) { // live show
        return this.arcsiList.find(show => this.slugify(show.name) === this.slugify(this.np.live.streamer_name))
      } else { // pre-recorded show
        return this.arcsiList.find(show => this.slugify(show.name) === this.slugify(this.np.now_playing.song.artist))
      }
    },
    time_percent () {
      const timePlayed = this.np.now_playing.elapsed
      const timeTotal = this.np.now_playing.duration
      if (!timeTotal) {
        return 0
      }
      if (timePlayed > timeTotal) {
        return 100
      }
      return (timePlayed / timeTotal) * 100
    },
    time_display_played () {
      let timePlayed = this.np.now_playing.elapsed
      const timeTotal = this.np.now_playing.duration
      if (!timeTotal) {
        return null
      }
      if (timePlayed > timeTotal) {
        timePlayed = timeTotal
      }
      return this.formatTime(timePlayed)
    },
    time_display_total () {
      const timeTotal = this.np.now_playing.duration
      return (timeTotal) ? this.formatTime(timeTotal) : null
    },
    show_title () {
      if (this.np.live.is_live) { return this.np.live.streamer_name } else { return this.np.now_playing.song.artist }
    },
    show_subtitle () {
      if (this.np.live.is_live) { return this.np.now_playing.song.title } else { return this.np.now_playing.song.title }
    },
    show_check () {
      return !!(this.np.live.is_live || (this.np.now_playing.playlist !== 'OFF AIR' && this.np.now_playing.playlist !== 'Off Air Ambient' && this.np.now_playing.playlist !== 'Jingle' && this.np.now_playing.playlist !== 'Jingle AFTER SHOW' && this.np.now_playing.playlist !== ''))
    },
    check_offairlink () {
      return this.np.now_playing.song.custom_fields.offairlink !== null && this.np.now_playing.song.custom_fields.offairlink.length > 3
    },
    show_url () {
      const url = this.currentShowArcsi ? this.currentShowArcsi.archive_lahmastore_base_url : ''
      return '/shows/' + url
    },
    show_art_url () {
      if (this.np.live.is_live) {
        // check if this method is valid with streams
        return this.currentShowArcsi ? this.currentShowArcsi.cover_image_url : this.default_art_url
      } else {
        // const songTitleJSON = this.np.now_playing.song.title
        const songArtistJSON = this.np.now_playing.song.artist
        const artworkJSON = this.np.now_playing.song.art // art work url in json

        if (artworkJSON === this.default_azuracast_art_url) { // default url by azuracast (must be returning off air music with art work)
          if (this.currentShowArcsi.cover_image_url === undefined) { // show not found
            let artworkHistoryJSON = '';
            (this.np.song_history).some((el) => { // check song in history one by one; check by artist not by title!
              if (el.song.artist === songArtistJSON && el.song.art !== this.default_azuracast_art_url) {
                artworkHistoryJSON = el.song.art
                return true
              } else {
                return false
              }
            })
            if (artworkHistoryJSON !== '') { return artworkHistoryJSON } else { return this.default_art_url } // fallback to default art URL
          } else {
            return this.currentShowArcsi.cover_image_url // return show art work
          }
        } else { // it's a valid art work url by azuracast
          return artworkJSON
        }
      }
    },
    isTouchEnabled () {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
    }
  },
  watch: {
    volume (volume) {
      if (isNaN(volume)) {
        volume = this.$store.getters['player/getStreamVolume'] || 50
      }
      this.audio.volume = Math.min((Math.exp(volume / 100) - 1) / (Math.E - 1), 1)
      this.$store.commit('player/setStreamVolume', volume)
    },
    '$store.state.player.isArcsiPlaying': {
      handler () {
        if (this.$store.getters['player/getArcsiPlayState']) {
          this.stop()
        }
      },
      deep: true
    }
  },
  created () {
    this.audio = document.createElement('audio')
    this.clock_interval = setInterval(this.iterateTimer, 1000)
    // Handle audio errors.
    this.audio.onerror = (e) => {
      if (e.target.error.code === e.target.error.MEDIA_ERR_NETWORK && this.audio.src !== '') {
        this.$sentry.captureException(new Error('Stream interrupted ', e))
        this.timeOutHelper = setTimeout(this.play, 5000)
      }
    }
    this.audio.onended = () => {
      if (this.is_playing) {
        this.stop()
        this.$sentry.captureException(new Error('Stream interrupted '))
        this.timeOutHelper = setTimeout(this.play, 5000)
      } else {
        this.stop()
      }
    }
    // Check webstorage for existing volume preference.
    if (this.volume !== this.$store.getters['player/getStreamVolume']) {
      this.volume = this.$store.getters['player/getStreamVolume']
    }
    // Check the query string if browser supports easy query string access.
    if (typeof URLSearchParams !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('volume')) {
        this.volume = parseInt(urlParams.get('volume'))
      }
    }
    this.checkNowPlaying()
  },
  beforeDestroy () {
    clearInterval(this.np_interval)
    clearInterval(this.clock_interval)
    clearInterval(this.docTitleSetter)
    clearTimeout(this.np_timeout)
    clearTimeout(this.timeOutHelper)
    this.np_interval = null
    this.np_timeout = null
    this.clock_interval = null
    this.timeOutHelper = null
  },
  methods: {
    play () {
      this.audio.src = this.current_stream.url
      if (!this.is_playing) {
        this.audio.play()
      }
      this.is_playing = true
      this.showCurrentMetadata()

      document.title = `🔈 ${this.show_title} - ${this.show_subtitle}`
      this.docTitleSetter = setInterval(() => {
        if (this.is_playing) {
          document.title = `🔈 ${this.show_title} - ${this.show_subtitle}`
        } else {
          clearInterval(this.docTitleSetter)
        }
      }, 3000)

      this.$store.commit('player/isArcsiPlaying', false)
      this.$store.commit('player/isStreamPlaying', true)

      // Google Analytics 3 play
      if (this.show_check) {
        // eslint-disable-next-line no-undef
        gtag('event', 'Radio play', {
          event_category: this.show_title,
          event_label: this.show_subtitle,
          value: 1
        })
      }

      this.np_interval = setInterval(this.showCurrentMetadata, 15000)
      // Allow pausing from the mobile metadata update.
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('pause', () => {
          this.stop()
        })
      }
    },
    showCurrentMetadata () {
      // Update the browser metadata for browsers that support it (i.e. Mobile Chrome)
      if ('mediaSession' in navigator && this.is_playing) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.np.now_playing.song.title,
          artist: this.np.now_playing.song.artist,
          artwork: [
            { src: this.np.now_playing.song.art }
          ]
        })
      }
    },
    stop () {
      this.is_playing = false
      if (this.is_playing) {
        this.audio.pause()
      }
      this.audio.src = ''
      this.$store.commit('player/isStreamPlaying', false)

      clearInterval(this.docTitleSetter)
      const ogTitle = document.querySelector("meta[property='og:title']")
      document.title = ogTitle ? ogTitle.getAttribute('content') : 'Lahmacun radio'

      clearInterval(this.np_interval)
      this.np_interval = null
      // Allow pausing from the mobile metadata update.
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('pause', () => null)
      }
    },
    toggle () {
      if (this.is_playing) {
        this.stop()
      } else {
        this.play()
      }
    },
    switchStream (newStream) {
      this.current_stream = newStream
      this.play()
    },
    checkNowPlaying () {
      this.$axios.get(this.nowPlayingUri).then((response) => {
        const npNew = response.data
        this.np = npNew
        // Set a "default" current stream if none exists.
        if (this.current_stream.url === '' && npNew.station.listen_url !== '' && this.streams.length > 0) {
          let currentStream = null
          this.streams.forEach(function (stream) {
            if (stream.url === npNew.station.listen_url) {
              currentStream = stream
            }
          })
          this.current_stream = currentStream
        }
        // Vue.prototype.$eventHub.$emit('np_updated', npNew);
      }).catch((error) => {
        this.$sentry.captureException(new Error('Stream interrupted ', error))
        this.np_timeout = setTimeout(this.checkNowPlaying, 15000)
      }).then(() => {
        clearTimeout(this.np_timeout)
        this.np_timeout = setTimeout(this.checkNowPlaying, 15000)
      })
    },
    iterateTimer () {
      const npElapsed = this.np.now_playing.elapsed
      const npTotal = this.np.now_playing.duration
      if (npElapsed < npTotal) {
        this.np.now_playing.elapsed = npElapsed + 1
      }
    },
    formatTime (time) {
      const secNum = parseInt(time, 10)
      let hours = Math.floor(secNum / 3600)
      let minutes = Math.floor((secNum - (hours * 3600)) / 60)
      let seconds = secNum - (hours * 3600) - (minutes * 60)
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds
    },
    closeModal () {
      this.streamModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-player-widget {
    min-width: 300px;
  @media (max-width: $small-width) {
    min-width: auto;
  }
    max-width: 400px;
    width: 100%;
    .now-playing-details {
        display: flex;
        align-items: center;
        .now-playing-art {
          margin-right: 0.7rem;
        }
        .now-playing-main {
            flex: 1;
            min-width: 0;
            position: relative;
            height: 70px;
            .media-body {
              overflow: auto;
            }
          &.player-no-volume-touch {
            @media (max-width: $mobile-width) {
              max-width: 60vw;
              .now-playing-title, .now-playing-artist {
                  white-space: normal;
              }
            }
          }
        }
        h4, h5 {
            line-height: 1.3;
        }
        h4 {
            font-size: 0.9rem;
        }
        h5 {
            font-size: 0.8rem;
            font-weight: normal;
        }
        .now-playing-title,
        .now-playing-artist {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            &:hover {
                /* text-overflow: clip;
                white-space: normal;
                word-break: break-all; */
            }
            a {
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
            }
        }
        .time-display {
            font-size: 10px;
            flex-direction: row;
            align-items: center;
            display: flex;
            width: 200px;
            height: 1.2rem;
            position: absolute;
            bottom: 0;
            .time-display-played {
                margin-right: .5rem;
                width: 2rem;
            }
            .progress {
              @apply bg-gray-300;
            }
            .time-display-progress {
                flex: 1 1 auto;
                .progress-bar {
                    -webkit-transition: width 1s; /* Safari */
                    transition: width 1s;
                    transition-timing-function: linear;
                    background: $lahma-pink;
                    height: 0.5rem;
                }
            }
            .time-display-total {
                margin-left: .5rem;
            }
        }
    }
    hr {
        margin-top: .5rem;
        margin-bottom: .5rem;
    }
    i.material-icons {
        line-height: 1;
        &.lg {
          font-size: 2rem;
        }
    }
    .radio-controls {
        display: flex;
        flex-direction: row;
        width: 100%;
        min-width: 300px;
        @media (max-width: $mobile-width) {
          margin-right: 0;
          min-width: auto;
        }
        .radio-control-play-button {
            margin-right: 0.5em;
        }
        .radio-control-select-stream {
            flex: 1 1 auto;
        }
        .radio-control-mute-button,
        .radio-control-max-volume-button {
            flex-shrink: 0;
        }
    }
}

/* player overrides */

.radio-control-play-button {
  margin-right: 0.5em;
  margin-top: 0;
  font-size: 1.1em;
}

@keyframes pulseonair {
  from { opacity: 0; }
  45% { opacity: 1; }
  50% { opacity: 1; }
  to { opacity: 0; }
}

a.programimage {
    width: 70px;
    height: 70px;
    display: block;
    overflow: hidden;
    position: relative;
    img {
        object-fit: cover;
        height: 100%;
        width: 100%;
        max-width: 70px;
        max-height: 70px;
    }
    .onair {
      position: absolute;
      bottom: 0;
      background: #da1313;
      padding: 0.2em;
      font-size: 0.8em;
      color: white;
      width: 100%;
      text-align: center;
      text-transform: uppercase;
      font-weight: 500;
      animation-name: pulseonair;
      animation-duration: 4s;
      animation-iteration-count: infinite;
    }
}

.media-body {
    max-height: 70px;
    display: block;
    h4, h5 {
      text-overflow: initial;
      overflow: unset;
      cursor: default;
      word-break: inherit;
      text-transform: none;
      white-space: normal;
    }
    h5 {
      font-size: 0.9em;
      text-transform: none;
    }
}

.play-volume-controls {
  position: relative;
  width: 250px;
  @media (max-width: $notebook-width) {
    width: auto;
  }
  @media (max-width: $mobile-width) {
    width: auto;
  }
}
#radio-player-controls.radio-controls-standalone {
    position: absolute;
    background: white;
    bottom: 3px;
    padding-left: 3px;
    line-height: 1;
    white-space: nowrap;
    > div {
        display: inline-block;
        vertical-align: top;
    }
    .radio-control-volume-slider {
        width: 8rem;
        height: 0.5rem;
        margin: 0.25rem 0.4rem;
        overflow: hidden;
        border-radius: 0.25rem;
    }
}

.creditswrap {
    display:none;
}

.now-playing-title {
  font-weight: 500;
  margin-bottom: 0.2rem;
  a i {
    color: #8d769f;
    -webkit-transition: 0.7s all linear;
    -moz-transition: 0.7s all linear;
    transition: 0.7s all linear;
    transform: rotate(90deg);
  }
  a:hover i {
    color: $black-color;
  }
}

/* Finish player overrides */

/* New Player styles */
.bigplay-button {
  min-width: 5.5rem;
  height: 4rem;
  display: flex;
  align-content: center;
  align-items: center;
  @media (max-width: $mobile-width) {
      width: 5rem;
    }
  @media (max-width: $small-width) {
    min-width: auto;
    width: 4.5rem;
  }
  img {
    padding: 0 0.75rem;
    max-height: 65px;
    @media (max-width: $mobile-width) {
      height: 65px;
      padding: 0 1rem 0 0;
    }
    @media (max-width: $small-width) {
      height: 55px;
      padding: 0 0.5rem 0 0;
    }
  }
}

.sand-clock {
  position: relative;
  min-width: 43px;
  img {
    height: 80px;
    @media (max-width: $mobile-width) {
      height: 55px;
    }
    z-index: 10;
    position: relative;
  }
}

</style>

<style lang="scss">
.radio-control-volume-slider {
  .vue-slider {
    padding: 0 !important;
    .vue-slider-rail {
      @apply bg-black;
      border-radius: 0;
      .vue-slider-process {
          background-color: $lahma-pink;
          border-radius: 0;
      }
      .vue-slider-dot {
        opacity: 0;
      }
    }
  }
}
</style>
