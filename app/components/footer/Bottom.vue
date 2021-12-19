<template>
  <footer class="bg-black">
    <div class="container justify-between py-8 md:flex">
      <div class="infos">
        <div class="mb-4">
          <h5>FOLLOW</h5>
          <ul>
            <li>
              <a href="https://www.facebook.com/lahmacunradio" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a href="http://instagram.com/lahmacunradio" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.mixcloud.com/LahmacunRadio/" target="_blank" rel="noopener noreferrer">
                Mixcloud
              </a>
            </li>
            <li>
              <a href="https://lahmacunradio.bandcamp.com/" target="_blank" rel="noopener noreferrer">
                Bandcamp
              </a>
            </li>
          </ul>
        </div>
        <div class="mb-4">
          <h5>Contact</h5>
          <p>
            <a href="mailto:contact@lahmacun.hu">contact@lahmacun.hu</a>
          </p>
          <h5 class="mt-4">
            <NuxtLink to="/impressum/">
              Impressum
            </NuxtLink>
          </h5>
        </div>
      </div>
      <div v-if="false" class="py-8 md:py-4 logos">
        {{ /* no sponsors for now */ }}
        <a href="http://golyapresszo.hu/" target="_blank">
          <img src="@/assets/img/golyalogo-1.png" alt="">
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Bottom'
}
</script>

<style lang="scss" scoped>
.infos {
  color: white;
  > div {
    display: inline-block;
    margin-right: 3rem;
    vertical-align: top;
  }
  a {
    transition: all 0.5s;
    color: white;
    &:hover {
      color: $lahma-pink;
    }
  }
}
.logos {
  img {
    display: inline-block;
    vertical-align: middle;
    margin-left: 3rem;
    @media (max-width: $mobile-width) {
      margin: 0;
    }
  }
}
</style>
