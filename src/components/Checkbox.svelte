<script lang="ts">
  export let label = '';
  export let checked = false;
  export let id = '';
  export let disabled = false;
</script>

<label class="block mb-2">
  <input {id} type="checkbox" {disabled} bind:checked />
  {label}
</label>
