<template>
  <div class="stations nowplaying altalanosinfok">
    <div class="radio-player-widget">
      <template v-if="is_playing">
        <audio ref="player" :title="np.now_playing.song.text" />
      </template>

      <div class="now-playing-details">
        <div class="radio-controls">
          <div v-if="showAlbumArt && np.now_playing.song.art" class="now-playing-art">
            <a class="cursor-pointer programimage" rel="playerimg" @click.stop="streamModal = !streamModal">
              <div v-if="show_check == true" class="onair">On air</div>
              <img class="progimg" :src="show_art_url" :alt="'album_art_alt'">
            </a>
            <Modal :media="show_art_url" :title="show_title" :description="show_subtitle" :visibility="streamModal" @close="closeModal" />
          </div>

          <div class="play-volume-controls">
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

            <a href="#" class="text-secondary volumeshower" @mouseenter="showVolumeSlider = !showVolumeSlider">
              <i class="material-icons" aria-hidden="true">volume_down</i>
            </a>

            <div v-show="showVolumeSlider" id="radio-player-controls" class="radio-controls-standalone volumecontrolos" @mouseleave="showVolumeSlider = !showVolumeSlider">
              <div class="radio-control-mute-button">
                <a href="#" class="text-secondary" :title="'mute_btn'" @click.prevent="volume = 0">
                  <i class="material-icons" aria-hidden="true">volume_mute</i>
                </a>
              </div>
              <div class="radio-control-volume-slider">
                <input
                  id="jp-volume-range"
                  v-model="volume"
                  type="range"
                  :title="'volume_slider'"
                  class="custom-range jp-volume-range"
                  min="0"
                  max="100"
                  step="1"
                >
              </div>
              <div class="radio-control-max-volume-button">
                <a href="#" class="text-secondary" :title="'full_volume_btn'" @click.prevent="volume = 100">
                  <i class="material-icons" aria-hidden="true">volume_up</i>
                </a>
              </div>
            </div>
          </div>

          <div class="now-playing-main">
            <div class="media-body">
              <div v-if="np.now_playing.song.title !== ''">
                <h4 :title="show_title" class="now-playing-title">
                  <a v-if="show_check == true" :href="show_url">
                    <span>{{ show_title }}&nbsp;</span>
                    <i class="fa fa-link" aria-hidden="true" /></a>

                  <a v-if="check_offairlink == true" :href="this.np.now_playing.song.custom_fields.offairlink" target="_blank">
                    <span>{{ show_title }}&nbsp;</span>
                    <i class="fa fa-link" aria-hidden="true" /></a>

                  <span v-if="show_check == false && check_offairlink == false">{{ show_title }}</span>
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
          <div v-if="this.streams.length > 1" class="dropdown">
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
      </div>
    </div>
  </div>
</template>

<script>
import store from 'store'

export default {
  components: {
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
      showVolumeSlider: false,
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
      clock_interval: null,

      // rework the checks
      default_art_url: 'https://www.lahmacun.hu/wp-content/uploads/defaultshowart.jpg',
      default_azuracast_art_url: 'https://streaming.lahmacun.hu/static/img/generic_song.jpg',
      showsURLList_lookup: [],
      showsList_lookup: []
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
      return [...this.$store.state.arcsiShows]
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
      if (this.np.live.is_live || (this.np.now_playing.playlist !== 'OFF AIR' && this.np.now_playing.playlist !== 'Off Air Ambient' && this.np.now_playing.playlist !== 'Jingle' && this.np.now_playing.playlist !== 'Jingle AFTER SHOW' && this.np.now_playing.playlist !== '')) {
        return true
      } else {
        return false
      }
    },
    check_offairlink () {
      if (this.np.now_playing.song.custom_fields.offairlink !== null && this.np.now_playing.song.custom_fields.offairlink.length > 3) {
        return true
      } else {
        return false
      }
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
        const songTitleJSON = this.np.now_playing.song.title
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
    }
  },
  watch: {
    volume (volume) {
      this.audio.volume = Math.min((Math.exp(volume / 100) - 1) / (Math.E - 1), 1)
      if (store.enabled) {
        store.set('player_volume', volume)
      }
    }
  },
  created () {
    this.audio = document.createElement('audio')
    this.clock_interval = setInterval(this.iterateTimer, 1000)
    // Handle audio errors.
    this.audio.onerror = (e) => {
      if (e.target.error.code === e.target.error.MEDIA_ERR_NETWORK && this.audio.src !== '') {
        console.log('Network interrupted stream. Automatically reconnecting shortly...')
        setTimeout(this.play, 5000)
      }
    }
    this.audio.onended = () => {
      if (this.is_playing) {
        this.stop()
        console.log('Network interrupted stream. Automatically reconnecting shortly...')
        setTimeout(this.play, 5000)
      } else {
        this.stop()
      }
    }
    // Allow pausing from the mobile metadata update.
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('pause', () => {
        this.stop()
      })
    }
    // Check webstorage for existing volume preference.
    if (store.enabled && store.get('player_volume') !== undefined) {
      this.volume = store.get('player_volume', this.volume)
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
  methods: {
    play () {
      this.audio.src = this.current_stream.url
      this.audio.play()
      this.is_playing = true
      document.body.classList.add('Playing')

      /*
            if (this.show_check) {
                gtag('event', 'Radio play', {
                    'event_category': this.show_title,
                    'event_label': 'Play state',
                    'value': 1,
                });
            }
            */
    },
    stop () {
      this.is_playing = false
      this.audio.pause()
      this.audio.src = ''
      document.body.classList.remove('Playing')

      /*
            if (this.show_check) {
                gtag('event', 'Radio play', {
                    'event_category': this.show_title,
                    'event_label': 'Play state',
                    'value': 0,
                });
            }
            */
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
        // Update the browser metadata for browsers that support it (i.e. Mobile Chrome)
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: npNew.now_playing.song.title,
            artist: npNew.now_playing.song.artist,
            artwork: [
              { src: npNew.now_playing.song.art }
            ]
          })
        }
        // Vue.prototype.$eventHub.$emit('np_updated', npNew);
      }).catch((error) => {
        console.error(error)
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
        }
        h4, h5 {
            margin: 0;
            line-height: 1.3;
        }
        h4 {
            font-size: 15px;
        }
        h5 {
            font-size: 13px;
            font-weight: normal;
        }
        .now-playing-title,
        .now-playing-artist {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            &:hover {
                text-overflow: clip;
                /* white-space: normal; */
                word-break: break-all;
            }
            a {
              display: block;
            }
        }
        .time-display {
            font-size: 10px;
            margin-top: .25rem;
            flex-direction: row;
            align-items: center;
            display: flex;
            .time-display-played {
                margin-right: .5rem;
            }
            .time-display-progress {
                flex: 1 1 auto;
                .progress-bar {
                    -webkit-transition: width 1s; /* Safari */
                    transition: width 1s;
                    transition-timing-function: linear;
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
        .radio-control-volume-slider {

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
      color: #585858 !important;
      font-size: 0.9em;
      text-transform: none;
    }
}

.now-playing-main .media-body {
    overflow: auto;
}

#radio-player-controls.radio-controls-standalone {
    position: absolute;
    background: white;
    top: 65px;
    z-index: 500;
    padding-left: 3px;
    line-height: 1;
    > div {
        display: inline-block;
        vertical-align: top;
    }
    .radio-control-volume-slider {
        width: 200px;
    }
    input.jp-volume-range {
        width: 200px;
        height: 4px;
        @apply bg-gray-300;
    }
}

.volumeshower {
  margin: 10px 5px 0;
  display: block;
  -moz-transform: translateY(-1px);
}

/* volume control cursos */
/* these ones work for Safari and Chrome  */
.custom-range::-webkit-slider-thumb {
  transition-duration: .3s;
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #f5f5f5;
  border: 1px solid #9a9a9a;
  border-radius: 50%;
  height: 15px;
  margin-top: -6px;
  width: 15px;
}

.custom-range::-webkit-slider-progress {
  background-color: black;
}

.custom-range:focus::-webkit-slider-thumb {
    border: 1px solid grey;
    box-shadow: none;
    background: #e6e6e6;
}

.custom-range::-webkit-slider-thumb:active {
  box-shadow: none;
}

.custom-range::-webkit-slider-runnable-track {
  border-radius: 2px;
  height: 3px;
}

/* these ones work for Mozilla */

.custom-range::-moz-range-track {
  height: 3px;
}

.custom-range::-moz-range-thumb {
  transition-duration: .3s;
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #f5f5f5;
  border: 1px solid #9a9a9a;
  border-radius: 50%;
  height: 15px;
  margin-top: -6px;
  width: 15px;
}

.custom-range::-moz-range-progress {
  background-color: black;
}

.custom-range:focus::-moz-range-thumb {
    border: 1px solid grey;
    box-shadow: none;
    background: #e6e6e6;
}

.custom-range::-moz-range-thumb:active {
  box-shadow: none;
}

.custom-range::-moz-range-runnable-track {
  border-radius: 2px;
  height: 5px;
}

.creditswrap {
    display:none;
}

.now-playing-title {
  a i {
    color: #8d769f;
    -webkit-transition: 0.7s all linear;
    -moz-transition: 0.7s all linear;
    transition: 0.7s all linear;
    transform: rotate(90deg);
  }
  a:hover i {
    color: black;
  }
}

/* Finish player overrides */
</style>
