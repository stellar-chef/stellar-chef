<script lang="ts">
  export let textToCopy: string | number;
  let copied = false;

  async function copyToClipboard() {
    await navigator.clipboard.writeText(textToCopy.toString());
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<button
  on:click={copyToClipboard}
  class="ml-2 p-1 text-xs rounded text-black hover:bg-gray-200 transform translate-y-[-2px]"
>
  {copied ? 'Copied!' : 'Copy'}
</button>
