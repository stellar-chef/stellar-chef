<script>
  import { onMount } from 'svelte';
  import { thresholds } from '../../store/thresholds';
  import Label from '../base/Label.svelte';
  import Span from '../base/Span.svelte';
  import Title from '../base/Title.svelte';

  onMount(() => {
    $thresholds.low = undefined;
    $thresholds.med = undefined;
    $thresholds.high = undefined;
  });
</script>

<div class="flex flex-col gap-3">
  <Title tag="h3">Thresholds</Title>

  <div class="flex flex-col gap-3">
    <Label>
      <Span class="text-sm">Low threshold</Span>
      <input type="number" placeholder="0 - 255" bind:value={$thresholds.low} />
    </Label>

    <Label>
      <Span class="text-sm">Medium threshold</Span>
      <input type="number" placeholder="0 - 255" bind:value={$thresholds.med} />
    </Label>

    <Label>
      <Span class="text-sm">High threshold</Span>
      <input type="number" placeholder="0 - 255" bind:value={$thresholds.high} />
    </Label>
  </div>
</div>
