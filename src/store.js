
import { createStore } from 'vuex'
import { ethers } from "ethers";
import NFTArtifact from "./assets/abi/Carbon.json";
import ERC20abi from "./assets/abi/erc20.json"; //this is already an abi
import router from "./router/index.js"
//polygon
//const NETWORK_ID = "0x89"; 
//const NFT_ADDRESS = "";
//const BCT_ADDRESS = "0x2f800db0fdb5223b3c3f354886d907a671414a7f";

//mumbai
const NETWORK_ID = "0x13881"; 
const NFT_ADDRESS = "0x625B8819810B763A6E908bC1819b2F9184fE104b";
const BCT_ADDRESS = "0xe07d7b44d340216723ed5ea33c724908b817ee9d"; //subbing in usdt

const BOND_AMOUNT     = '20000000000000000000';
const APPROVAL_AMOUNT = '1000000000000000000000'; //BOND_AMOUNT * 10;

const store = createStore({
  state () {
    return {
      account: null,
      error: null,
      mining: false,
      nft_address: NFT_ADDRESS,
      count: 0,
      user: undefined,
      network_id: "0x4",
      mint_count: null,
    }
  },
  getters: {
    account: (state) => state.account,
    error: (state) => state.error,
    mint_count: (state) => state.mint_count,
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
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
            "You are not connected to the Rinkeby Test Network!"
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
    async checkIfConnected({ commit }) {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        commit("setAccount", accounts[0]);
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

    async getNFTContract({ state }) {
      try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          state.nft_address,
          NFTArtifact.abi,
          signer
        );
        return connectedContract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },
    async mintNFT({ commit, dispatch }, account) {
      try {
        const NFTContract = await dispatch("getNFTContract");
        const mintTxn = await NFTContract.safeMint(account);
        await mintTxn.wait();
      } catch (error) {
        console.log(error);
        if (error.data.code == 3) {
          commit("setError", error.data.message);
          alert(error.data.message);
        }
        console.log(error.data.message)
      }
    },
    async getBCTContract({ state }) {
      try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          BCT_ADDRESS,
          ERC20abi,
          signer
        );
        return connectedContract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },
    async approveBCT({ commit, dispatch }, account) {
      try {
        const BCTContract = await dispatch("getBCTContract");
        const mintTxn = await BCTContract.approve(NFT_ADDRESS, APPROVAL_AMOUNT);
        await mintTxn.wait();
      } catch (error) {
        console.log(error);
      }
    },
    async setupEventListeners({ state, commit, dispatch }) {
      try {
        const connectedContract = await dispatch("getNFTContract");
        if (!connectedContract) return;
        let mintcount = await connectedContract.totalSupply();
        commit("setMintCount", mintcount.toNumber());
        connectedContract.on(
          "Transfer",
          async (from, to, tokenId) => {
            console.log(
              `NFT Minted - sender: ${from} to: ${to} tokenId: ${tokenId.toNumber()}`
            );
            //const owner = await connectedContract.ownerOf(tokenId);
            let nonchecksummed_to = to.toLowerCase();
            console.log(state.account);
            console.log(to === state.account);
            console.log(to == state.account);
            if (nonchecksummed_to == state.account) {
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