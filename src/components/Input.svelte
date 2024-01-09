<script lang="ts">
  export let value: string | number;
  export let id: string;
  export let disabled: boolean = false;
  export let readonly: boolean = false;
  export let type: string = 'text';
  export let maxlength: number = 80;
  export let handleInput: (value: string) => string = (value) => value;

  const typeProp = {
    type
  };

  function updateValue(event: Event) {
    value = handleInput((event.target as HTMLInputElement).value);
  }
</script>

<input
  {id}
  bind:value
  {...typeProp}
  {disabled}
  {readonly}
  {maxlength}
  class={type === 'text' ? 'mb-4 border-4 w-full p-2 border-black' : 'mb-2 border-2 rounded'}
  on:input={updateValue}
/>
