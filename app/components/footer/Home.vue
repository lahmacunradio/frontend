<template>
  <div class="mt-8 homefooter">
    <div class="container">
      <div class="image">
        <div class="gradient">
          <p>Lahmacun.hu is an online music & more radio from Budapest.</p>
          <p>Lahmacun is listener supported. If you enjoy what we do, please consider donating to us.</p>
        </div>
        <img src="@/assets/img/Lahmacun-Team-2020.jpg" alt="">
      </div>
    </div>
    <FooterBottom />
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.homefooter {
    background: url('@/assets/img/footer-back-home.png') no-repeat bottom center;
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
            color: $black-color;
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
}
</style>
