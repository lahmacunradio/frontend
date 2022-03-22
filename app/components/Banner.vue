<template>
        <v-app>
        <v-banner
          color="white">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent cursus nec sem id malesuada.
    Curabitur lacinia sem et turpis euismod, eget elementum ex pretium.
    <template v-slot:actions>
      <v-btn
        text
        color="primary"
      >
        Dismiss
      </v-btn>
      <v-btn
        text
        color="primary"
      >
        Retry
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
    }
</style>