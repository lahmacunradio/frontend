<template>
    <v-app>
        <div v-bind:style="{ display: isNone }">
        <v-banner
          single-line
          color="yellow"
          rounded>
            <v-icon
                icon="mdi-cookie"
                color="black">
                    mdi-cookie
            </v-icon>
            <span v-sanitize="[sanitizeOptions, bannerText_computed]" />
            <v-btn
                text
                color="primary"
                @click="dismiss_remember">
                Dismiss
            </v-btn>
        </v-banner>
        </div>
  </v-app>
</template>
  
<script>
import { bannerTextURL } from '~/constants'

export default {
    name: 'Banner',
    methods: {
        dismiss_remember: function (event) {
            // `this` inside methods points to the Vue instance
            window.localStorage.lahma_cookie_info_banner_dismiss_date = new Date();
            this.isRemembered = true
        }
    },
    data () {
        return {
            //Note: as window object is not available in early phases in the instance creation, we need to update the value when the component is mounted
            //Initial value can be assumed to be true so that nothing is displayed when rendering
            isRemembered: false,
            //banner text from CMS
            bannertext_fetched: null,
            sanitizeOptions: {
                allowedTags: ['div', 'h4', 'b', 'i', 'em', 'strong', 'img', 'form', 'input', 'figure', 'hr', 'br','a'],
                allowedAttributes: {
                    a: ['*'],
                    img: ['*'],
                    div: ['style', 'class', 'id'],
                    form: ['*'],
                    input: ['*']
                }
            }     
        }
    },
     async fetch () {
        this.bannertext_fetched = await this.$axios.get(`${bannerTextURL}`)
            .then((res) => {
                if (res) {
                    return res.data
                }
            })
            .catch((error) => {
                this.$sentry.captureException(new Error('Banner text not available from CMS ', error))
                this.$nuxt.error({ statusCode: 404, message: 'Banner text not available from CMS' })
            })
  },

    mounted () {            
            var dismissalAge = (new Date() - new Date(window.localStorage.lahma_cookie_info_banner_dismiss_date))/1000/60/60/24; //convert from ms to days
            this.isRemembered = (dismissalAge < 30) ? true : false; //show banner again after 30 days of last dismissal
    },
    computed: {
        isNone () {
            return this.isRemembered ? 'none' : 'block'
        },
        bannerText_computed () {
            if (!this.bannertext_fetched?.content?.rendered) {
                return 'No banner text content'
            }
                return this.bannertext_fetched?.content?.rendered
        }
    }
};
</script>

<style lang="scss" scoped>
    @import '@/assets/css/banner.css'; //for Vuetify style overrides; probably not needed here, but it's a good placeholder too see where overrides styles can be defined

    .v-banner{
        position:fixed;
        bottom:50px;        
        opacity:0.9;
        z-index: 11;
    }    
</style>