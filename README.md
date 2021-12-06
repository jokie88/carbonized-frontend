# vueclient
npm run serve

to deploy on netlify
git push origin to github -> netlify will automatically pick up the push and deploy it (probably should create prod branch at some point)


# Implementation details
This frontend currently points to the contracts deployed on polygon's mumbai testnet. The good thing about this is that you can see the entire process from start to finish onto opensea's testnet instance. The bad thing is that there are some subtleties to be aware of. For example, the metadata.json file is being pulled by opensea from the actual production website and not from the dev instance you are running locally. 

Most variables are declared in store.js. At some point we will want to clean these up and use some sort of environment variable management system to make things more organized. For now, you can point to new contracts by changing the NFT_ADDRESS variable there to point to the latest deployed contract on the mumbai testnet. 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
