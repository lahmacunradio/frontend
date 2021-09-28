<template>
  <footer class="mt-8 homefooter">
    <div class="container">
      <div class="image">
        <div class="gradient">
          <p>Lahmacun.hu is an online music & more radio from Budapest.</p>
          <p>Lahmacun is listener supported. If you enjoy what we do, please consider donating to us.</p>
        </div>
        <img src="/img/Lahmacun-Team-2020.jpg" alt="">
      </div>
      <div class="justify-between py-8 md:flex">
        <div class="infos">
          <div>
            <h5>FOLLOW</h5>
            <ul>
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Soundcloud</li>
              <li>Bandcamp</li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <p>
              <a href="mailto:contact@lahmacun.hu">contact@lahmacun.hu</a>
            </p>
          </div>
        </div>
        <div class="py-8 md:py-4 logos">
          <a href="http://golyapresszo.hu/" target="_blank">
            <img src="/img/golyalogo-1.png" alt="">
          </a>
          <a href="https://inclust.com/" target="_blank">
            <img src="/img/inclust_logo.png" alt="">
          </a>
          <a href="https://rogueamoeba.com/" target="_blank">
            <img src="/img/rogue-amoeba-logo.png" alt="">
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "/assets/css/variables";
.homefooter {
    background: url('/img/footer-back-home.png') no-repeat bottom center;
    background-size: cover;
    .container {
        color: white;
    }
    .image {
        position: relative;
        @media (max-width: $mobile-width) {
          overflow: hidden;
        }
        .gradient {
            position: absolute;
            bottom: 0;
            padding: 2rem;
            color: black;
            font-size: 1.4rem;
            background: linear-gradient(45deg, white 0%, #fff0 100%);
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            @media (max-width: $mobile-width) {
              padding: 1rem;
              font-size: 0.9rem;
            }
            p {
                max-width: 350px;
                margin-top: 1rem;
            }
        }
        @media (max-width: $mobile-width) {
          img {
            height: 50vh;
            width: auto;
            max-width: none;
            margin-left: -100%;
          }
        }
    }
    .infos {
        > div {
            display: inline-block;
            margin-right: 3rem;
            vertical-align: top;
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
}
</style>
