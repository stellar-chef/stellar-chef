<script lang="ts">
  import CheckCircle from './icons/CheckCircle.svelte';
  export let assetCodeForCoinInfo: string;
  export let issuerPublicKey: string;
  export let dataCy: string;
</script>

<div class="flex items-center">
  <CheckCircle fill="#34D399" />
  <span class="font-bold">{assetCodeForCoinInfo} </span>
  <a
    data-cy={dataCy}
    href="https://stellar.expert/explorer/testnet/asset/{assetCodeForCoinInfo}-{issuerPublicKey}"
    target="_blank"
    class="text-blue-500 hover:text-blue-800 underline ml-1">see details</a
  >
</div>
