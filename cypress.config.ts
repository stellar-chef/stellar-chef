import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:5173/stellar-chef',
    testIsolation: false
  },
  env: {
    ISSUER_PUBLIC_KEY: 'GANFMU7SHOFXUM6OF32BGKADD6QSEEP25E2ZVJ6PTJUKI4WORZY6Y6SI',
    ISSUER_SECRET_KEY: 'SB2RZHC7JIUBYHYV45VEHEYVANDY5AWHYS3IJYZHPVNJ6TJ5YPEK7OQE',
    HOLDER_PUBLIC_KEY: 'GDAM4TVOXH5RA36KIQLG6JZBM5LB2LMWTTHHJMXCZIPVORNHV4AFPQW3',
    ASSET_CODE: 'testCoin',
    EXPECTED_STELLAR_EXPERT_ASSET_URL: 'https://stellar.expert/explorer/testnet/asset/testCoin',
    EXPECTED_STELLAR_EXPERT_ACCOUNT_URL: 'https://stellar.expert/explorer/testnet/account',
    EXPECTED_STATUS_LINK:
      'https://stellar.expert/explorer/testnet/tx/9fa82582516534232e7a9a2ccc391908790d9a2d7da6cce0a13c34e457d381dd'
  }
});
