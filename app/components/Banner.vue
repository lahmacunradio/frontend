<template>
    <v-app>
        <v-banner
          single-line
          color="yellow"
          rounded>
         <v-icon
            icon="mdi-cookie"
            color="black">
                mdi-cookie
        </v-icon>
        Használunk stüiket, részletek <NuxtLink to="/cookies/">itt</NuxtLink>. 
        <template v-slot:actions="{ dismiss }">
            <v-btn
                text
                color="primary"
                @click="dismiss">
                Dismiss
            </v-btn>
        </template>
    </v-banner>
  </v-app>
</template>
  
<script>
export default {
    name: 'Banner'
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