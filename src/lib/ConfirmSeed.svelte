<script lang="ts">
  import { Progress } from "$lib/types";

  let { bsf_seed, progress = $bindable() } = $props();

  let user_seed: String = $state("");

  function continue_to_payment() {
    if (user_seed.trim() === bsf_seed) {
      progress = Progress.Payment;
    } else {
      alert(`Seed doesn't match! Your seed is ${bsf_seed}`);
    }
  }
</script>

<p>Confirm the seed you just saved:</p>
<input type="text" bind:value={user_seed}/>
<br>
<br>
<button class="button" onclick={continue_to_payment}>Continue</button>

<style>
  p {
    margin-bottom: 15px;
  }
  input {
    min-width: 50vw;
  }
</style>

