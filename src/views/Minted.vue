<template>
  <div class="hello">
    <h1>Congratulations!</h1>
    <p>You have minted the world's first Carbonized NFT.</p>
    <br /><br /><br/>
    <h2>Genesis Stone #{{ tokenId }}</h2>
    <br/>
    <div class="row"><div class="col-8 offset-2">
      <img src="/images/rock_lowmoss.png" class="rounded headimg img-thumbnail" title="" />
      
    </div></div>
    <br /><br/>
    <h7>
      <a v-bind:href="polygonscanURL()"
      target="_target">View Transaction on Polygonscan</a>
    </h7>
      <br /><br/>  
    <h7>
      <a v-bind:href="openseaURL()"
      target="_eth">View on Opensea (doesn't populate immediately)</a>
    </h7>
    <br/><br/>
    <br/><br/>
    <br/><br/>
  </div>
</template>
<script>
// writing a bunch of code here, is that OK?
  export default {
    name: "Minted",
    props: {
    },
    data() {
      return {
        tokenId: 0, //this.$router.params.id,
      };
    },
    mounted() {
      this.tokenId = this.$route.params.id;
    },
    methods: {
      openseaURL() {
        return `${this.$store.state.opensea_url}${this.$store.state.nft_address}/${this.tokenId}`;
      },
      polygonscanURL() {
        return `${this.$store.state.polygonscan_url}/tx/${this.$store.state.mint_txn}`;
      },

    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
