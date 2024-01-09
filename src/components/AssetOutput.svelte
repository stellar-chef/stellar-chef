<script lang="ts">
  import CopyButton from './CopyButton.svelte';
  export let value: string | number;
  export let id: string;
  export let type: string = 'text';
</script>

<CopyButton textToCopy={value} />
<div
  {id}
  contenteditable="false"
  class={type === 'text'
    ? 'mb-2 w-full p-1 font-bold overflow-hidden whitespace-nowrap overflow-ellipsis'
    : 'mb-1 font-bold overflow-hidden whitespace-nowrap overflow-ellipsis'}
>
  {value}
</div>
