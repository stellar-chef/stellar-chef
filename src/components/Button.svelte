<script>
  export let label = '';
  export let onClick = () => {};
  export let id = '';
  export let disabled = false;
</script>

<button
  {id}
  {disabled}
  class="bg-white hover:bg-gray-200 text-black py-2 px-4 border border-black w-full mx-2"
  on:click={onClick}
  style="box-shadow: 5px 5px 0px 0px black;"
>
  {label}
</button>
