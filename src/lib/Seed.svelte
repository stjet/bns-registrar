<script lang="ts">
  import { Progress } from "$lib/types";

  let { bsf_seed, progress = $bindable() } = $props();

  function continue_to_confirm() {
    progress = Progress.ConfirmSeed;
  }
</script>

<p>Save the seed and continue.</p>
<p>Seed (in BNS Seed Format): <code>{bsf_seed}</code></p>
<button class="button" onclick={continue_to_confirm}>Continue</button>

<style>
  p {
    margin-bottom: 15px;
  }
</style>

