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
    @import '~vuetify/src/components/VStepper/_variables.scss';

    .v-banner{
        position:fixed;
        bottom:50px;        
    }
</style>