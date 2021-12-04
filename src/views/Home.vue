<template>
  <div class="home container">
    <div class="row">
      <div class="col"></div>
      <div class="col-10">
        <h1 class="display-2 headline">The Genesis Stone</h1>
        <p class="lead">The World's First Carbonized NFT</p>
        <br/>
        <br/>
    <!--    <img src="/images/carbonized_genesis_collection.jpg" class="rounded headimg img-thumbnail" title="" /> -->
        <img src="/images/rock_lowmoss_low.png" class="rounded headimg img-thumbnail" title="" />
        <br/>
        <br/>
        <div class="row">
          <div class="col-8 offset-2 text-left">
          <p>
            The Genesis Stone is the world’s first NFT that consumes tokenized carbon offsets when minted, specifically BCT.
          </p>
          <p>
            We chose a rock for the first carbonized NFT in existence as a nod to the controversial EtherRock NFT, which many critiqued in context of the greater question surrounding the value of NFTs. Were they simply jpegs? We believe carbonized NFTs offer a new argument to be considered in that debate.
          </p>
          <p>
            The surface of the Genesis Stone was modeled to resemble basalt - a carbon capturing rock that contains high concentrations of calcium and magnesium ions that react with CO2. The diamond-like shape of the Genesis Stone loosely imitates the Ethereum logo, as an acknowledgment of the technological innovation of the Ethereum blockchain.
          </p>
          <p>
            The Genesis Stone is limited to 100 Pieces. <span v-if="mint_count">Currently, {{ mint_count }} Genesis Stones are available for minting.</span>
          </p>
          </div>
        </div>
        <div class="row">
          <div class="col-8 offset-2">  
        <br/><br/><br/><br/>
        <h5>
          Mint the Genesis Stone by Infusing BCT into the NFT <br />
          <small><router-link to="/about" class="nav-link">How do Carbonized NFTs work?</router-link></small>
        </h5>
        <i class="fa fa-arrow-down arrow"></i>
        <br/><br/>
        <div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Bridge Funds to Polygon</h5>
                  <p class="card-text">Unless you already have funds on Polygon, bridge funds from another chain like Ethereum or Avalanche in 2 mins.</p>
                  <a href="https://synapseprotocol.com/?inputCurrency=USDC&outputCurrency=USDC&outputChain=137"  target="_blank" class="card-link">Synapse Bridge</a>
                </div>
              </div>
            </div>
          </div>
          <br/>    
          <i class="fa fa-arrow-down arrow"></i>
          <br/><br/>

          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Swap to get BCT</h5>
                  <p class="card-text">Once you have funds on Polygon, use Sushiswap to get BCT.</p>
                  <a href="https://app.sushi.com/swap?inputCurrency=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&outputCurrency=0x2f800db0fdb5223b3c3f354886d907a671414a7f" target="_blank" class="card-link">SushiSwap</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br/>
        

        <br/>
            <i class="fa fa-arrow-down arrow"></i>
            
        <br/><br/>
        <div class="connect-wallet-container" v-if="!account">
          <button class="btn btn-primary btn-lg" @click="connect">
            <strong>Connect Wallet To Get Started</strong>
          </button>
        </div>
        <div v-else>
          <button class="btn btn-lg btn-secondary">
            <span class="oi oi-check"></span> Connected as {{accountShortname}}
          </button>
        </div>
        <br/>    
        <!--
        <i class="fa fa-arrow-down arrow"></i>
        <br/><br/>
        <div>
          <a target="usdc_bct_pool" href="https://app.sushi.com/swap?inputCurrency=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&outputCurrency=0x2f800db0fdb5223b3c3f354886d907a671414a7f"
          class="btn btn-primary btn-lg"><strong>Get 100 BCT (Polygon Network)</strong></a>
        </div>
        <br/>
        -->
        <i class="fa fa-arrow-down arrow"></i>
        <br/><br/>
        <div v-if="!approve_loading">
          <button class="btn btn-primary btn-lg" @click="approveBCTAction"><strong>Approve Transacting with the NFT Contract</strong></button>
        </div>
        <div v-else>
          <button class="btn btn-primary btn-lg" type="button" disabled>

            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <strong>
            &nbsp;Approving...
            </strong>
          </button>
        </div>
        <br/>
        <i class="fa fa-arrow-down arrow"></i>
        <br/><br/>
        <div v-if="!mint_loading">
          <button class="btn btn-primary btn-lg" @click="mintNFT"><strong>Submit 20 BCT to Mint the Carbonized NFT</strong></button>
        </div>
        <div v-else>
          <button class="btn btn-primary btn-lg" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <strong> &nbsp;Minting...</strong>
          </button>
        </div>


      </div>
    </div>  




      </div>  
      <div class="col"></div>
    </div>
    
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />

  </div>
</template>

<script>
export default {
  data() {
    return {
      approve_loading: false,
      mint_loading: false,
      mint_count: undefined,
    };
  },
  components: {
  },
  methods: {
    async connect() {
      await this.$store.dispatch("connect", true);
      
    },
    async approveBCTAction() {
      if (this.approve_loading) return;
      this.approve_loading = true;
      await this.$store.dispatch("approveBCT", this.$store.getters.account);
      this.approve_loading = false;
    },
    async mintNFT() {
      if (this.mint_loading) return;
      this.mint_loading = true;
      await this.$store.dispatch("mintNFT", this.$store.getters.account);
      this.mint_loading = false;
    },
    async getMintCount() {
      await this.$store.dispatch("mintCount", this.$store.getters.mint_count);
    },

  },
  async mounted() {
    await this.$store.dispatch("connect", false);
    this.mint_count = 100 - this.$store.getters.mint_count;
  },
  computed: {
    account() {
      return this.$store.getters.account;
    },
    accountShortname() {
      let address = this.$store.getters.account;
      return address.substring(0,6) + "..." + address.substring(address.length - 5 , address.length)
    },
  }
};
</script>
<style scoped>
.headimg {
  border: 2px solid#ccc;
  width: 600px;
}
.headline {
  font-family: system-ui;
  font-weight: 700;
  color: #444;
}
.arrow {
  font-size: 5em;
  color: rgba(196, 196, 196, 0.678);
}

loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 75px;
}
.loading .indicator {
  display: flex;
}
.loading .indicator p {
  font-weight: bold;
  font-size: 28px;
  padding-left: 5px;
}
.loading img {
  width: 450px;
  padding-top: 25px;
}
</style>