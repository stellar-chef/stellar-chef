<script lang="ts">
  export let title: string;
  export let content: string = '';
  export let id: string = '';
</script>

<div {id} class="border-4 border-black p-5 w-72 mx-2 bg-white shadow-lg mt-4 overflow-auto" style="height: 550px;">
  <h1 class="text-xl font-bold mb-5">{title}</h1>
  <p>{content}</p>
  <slot />
</div>
