<template>
    <v-app>
        <div v-bind:style="{ display: isRemembered }">
        <v-banner
          single-line
          color="yellow"
          rounded>
         <v-icon
            icon="mdi-cookie"
            color="black">
                mdi-cookie
        </v-icon>
        Használunk sütiket, részletek <NuxtLink to="/cookies/">itt</NuxtLink>. 
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
export default {
    name: 'Banner',
    methods: {
        dismiss_remember: function (event) {
            // `this` inside methods points to the Vue instance
            window.localStorage.lahma_cookie_info_banner_status = 'none';
            this.isRemembered = 'none'
        }
    },
    data () {
        return {
            //Note: as window object is not available in early phases in the instance creation, we need to update the value when the component is mounted
            isRemembered: 'none'
        }
    },
    mounted () {            
            this.isRemembered = window.localStorage.lahma_cookie_info_banner_status
    }
};
</script>

<style lang="scss" scoped>
    @import '@/assets/css/banner.css'; //for Vuetify style overrides; probably not needed here, but it's a good placeholder too see where overrides styles can be defined

    .v-banner{
        position:fixed;
        bottom:50px;        
        opacity:0.9;
    }    
</style>