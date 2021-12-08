
import { createStore } from 'vuex'
import { ethers } from "ethers";
import NFTArtifact from "./assets/abi/Carbon.json";
import ERC20abi from "./assets/abi/erc20.json"; //this is already an abi
import router from "./router/index.js"
//polygon
//const NETWORK_ID = "0x89"; 
//const NFT_ADDRESS = "";
//const BCT_ADDRESS = "0x2f800db0fdb5223b3c3f354886d907a671414a7f";
//const BOND_AMOUNT = '20000000000000000000';
//const OPENSEA_URL = 'https://www.opensea.io/assets/matic/';
//const POLYGONSCAN_URL = 'https://www.polygonscan.com/';

//polygon test deploy
// const NETWORK_ID = "0x89"; 
// const NFT_ADDRESS = "0x2b67e50F4CA46FdDD4C272d817E2CfabD51b4818";
// const BCT_ADDRESS = "0x2f800db0fdb5223b3c3f354886d907a671414a7f";
// const BOND_AMOUNT = '20000000000000000'; //0.02BCT for test
// const OPENSEA_URL = 'https://www.opensea.io/assets/matic/';
// const POLYGONSCAN_URL = 'https://www.polygonscan.com/';

//mumbai
const NETWORK_ID = "0x13881"; 
const NFT_ADDRESS = "0x625B8819810B763A6E908bC1819b2F9184fE104b";
const BCT_ADDRESS = "0xe07d7b44d340216723ed5ea33c724908b817ee9d"; //subbing in usdt
const BOND_AMOUNT = '20000000000000000000';
const OPENSEA_URL = 'https://testnets.opensea.io/assets/mumbai/';
const POLYGONSCAN_URL = 'https://mumbai.polygonscan.com/'


//same for everything
const APPROVAL_AMOUNT = '1000000000000000000000'; //BOND_AMOUNT * 10;

const store = createStore({
  state () {
    return {
      account: null,
      account_balance: 0,
      error: null,
      mining: false,
      nft_address: NFT_ADDRESS,
      nft_contract: null,
      opensea_url: OPENSEA_URL,
      polygonscan_url: POLYGONSCAN_URL,
      mint_txn: null,
      count: 0,
      user: undefined,
      network_id: "0x4",
      mint_count: null,
      approved: false,
      erc20_contract: null,
    }
  },
  getters: {
    account: (state) => state.account,
    account_balance: (state) => state.account_balance,
    error: (state) => state.error,
    mint_count: (state) => state.mint_count,
    approved: (state) => state.approved,
    erc20_contract: (state) => state.erc20_contract,
    nft_contract: (state) => state.nft_contract,
    mint_txn: (state) => state.mint_txn,
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
    setAccountBalance(state, accountBalance){
      state.account_balance = accountBalance;
    },
    setError(state, error) {
      state.error = error;
    },
    incrementCount (state) {
      state.count++
    },
    setMintCount(state, mintCount) {
      state.mint_count = mintCount;
    },
    setApprovalState (state, approval){
      state.approved = approval;
    },
    setERC20Contract (state, contract){
      state.erc20_contract = contract;
    },
    setNFTContract (state, contract){
      state.nft_contract = contract;
    },
    setMintTxn (state, txnid){
      state.mint_txn = txnid;
    },
  },
  actions: {
    async connect({ commit, dispatch }, connect) {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          commit("setError", "Metamask not installed!");
          return;
        }
        if (!(await dispatch("checkIfConnected")) && connect) {
          await dispatch("requestAccess");
        }
        await dispatch("checkNetwork");
        await dispatch("setupEventListeners");
      } catch (error) {
        console.log(error);
        commit("setError", "Account request refused.");
      }
    },
    async checkNetwork({ commit, dispatch }) {
      let chainId = await ethereum.request({ method: "eth_chainId" });
      if (chainId !== NETWORK_ID) {
        if (!(await dispatch("switchNetwork"))) {
          commit(
            "setError",
            "You are not connected to the Polygon Network!"
          );
        }
      }
    },
    async switchNetwork() {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: NETWORK_ID }],
        });
        return 1;
      } catch (switchError) {
        return 0;
      }
    },
    async checkIfConnected({ commit, dispatch }) {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        commit("setAccount", accounts[0]);

        // Check approval status of ERC20 contract
        const BCTContract = await dispatch("getBCTContract");
        let approval = await (await BCTContract.allowance(accounts[0], NFT_ADDRESS)).gt(0);
        commit("setApprovalState", approval);
        return 1;
      } else {
        return 0;
      }
    },
    async requestAccess({ commit }) {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      commit("setAccount", accounts[0]);
    },

    async getNFTContract({ state, commit }) {
      try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          state.nft_address,
          NFTArtifact.abi,
          signer
        );
        commit("setNFTContract", connectedContract);

        // Get account_balance for current account, if exists
        if (this.state.account){
          let accountBalance = await connectedContract.balanceOf(this.state.account);
          if (accountBalance.gt(0)) {
            commit("setAccountBalance", accountBalance.toNumber());
          }
        }

        return connectedContract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },
    async mintNFT({ commit, dispatch, state }, account) {
      try {
        let NFTContract;
        if (this.state.nft_contract){
          NFTContract = this.state.nft_contract;
        } else {
          NFTContract = await dispatch("getNFTContract");
        }
        const mintTxn = await NFTContract.safeMint(account);
        await mintTxn.wait();
        console.log(mintTxn);
        commit("setMintTxn", mintTxn['hash']); 
      } catch (error) {
        console.log(error);
        commit("setError", error.data.message);
        if (error.code == 4001) { window.location.reload(); } // Force reload of webpage when user cancels Metamask transaction
      }
    },
    async getBCTContract({ commit }) {
      try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          BCT_ADDRESS,
          ERC20abi,
          signer
        );
        commit("setERC20Contract", connectedContract);
        return connectedContract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },
    async approveBCT({ state, commit, dispatch }, account) {
      try {
        let BCTContract;
        if (state.erc20_contract){
          BCTContract = state.erc20_contract;
        } else {
          BCTContract = await dispatch("getBCTContract");
        }
        const mintTxn = await BCTContract.approve(NFT_ADDRESS, APPROVAL_AMOUNT);
        await mintTxn.wait();
        let approval = await (await BCTContract.allowance(account, NFT_ADDRESS)).eq(APPROVAL_AMOUNT);
        commit("setApprovalState", approval);
      } catch (error) {
        console.log(error);
      }
    },
    async setupEventListeners({ state, commit, dispatch }) {
      try {
        const connectedContract = await dispatch("getNFTContract");
        if (!connectedContract) return;
        commit("setNFTContract", connectedContract);
        let mintcount = await connectedContract.totalSupply();
        commit("setMintCount", mintcount.toNumber());
        connectedContract.on(
          "Transfer",
          async (from, to, tokenId) => {
            console.log(
              `NFT Minted - sender: ${from} to: ${to} tokenId: ${tokenId.toNumber()}`
            );
            let nonchecksummed_to = to.toLowerCase();
            // console.log(this.state.account);
            // console.log(state.account);
            // console.log(to === state.account.toLowerCase());
            // console.log(to == state.account.toLowerCase());
            let newAccountBalance = await connectedContract.balanceOf(state.account);
            if (nonchecksummed_to == state.account.toLowerCase() && newAccountBalance.eq(state.account_balance + 1)) {
              router.push("/minted/"+tokenId);  
            }
          }
        );
    
      } catch (error) {
        console.log(error);
      }
    },
  }
})

export default store