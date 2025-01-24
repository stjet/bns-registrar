<script lang="ts">
  import { page } from "$app/stores";
  import { browser } from "$app/environment";

  import { Progress } from "$lib/types";
  import Seed from "$lib/Seed.svelte";
  import ConfirmSeed from "$lib/ConfirmSeed.svelte";
  import Payment from "$lib/Payment.svelte";
  import Declare from "$lib/Declare.svelte";

  let progress: Progress = $state(Progress.Seed);
  let message: String = $state(undefined); //error
  let payment_address: String = $state(undefined);

  let domain = $page.url.searchParams.get("domain");

  let wallet, send_to_pub_key, bsf_seed;
  if (browser) {
    wallet = window.bns.banani.Wallet.gen_random_wallet();
    send_to_pub_key = wallet.public_key;
    bsf_seed = window.bns.hex_to_bns_seed_format(wallet.seed);
  }

  $effect(async () => {
    if (progress === Progress.Payment) {
      ({ payment_address, message } = await (await fetch("/api/start_payment", {
        method: "POST",
        body: JSON.stringify({
          domain,
          send_to_pub_key,
        }),
      })).json());
      if (!payment_address) {
        progress = Progress.Failed;
      }
    }
  });
</script>

<div id="main">
  <div class="middle">
    {#if progress === Progress.Seed}
      <Seed bind:progress {bsf_seed}/>
    {:else if progress === Progress.ConfirmSeed}
      <ConfirmSeed bind:progress {bsf_seed}/>
    {:else if progress === Progress.Payment}
      <Payment bind:progress {domain} {payment_address} {send_to_pub_key}/>
    {:else if progress === Progress.Declare}
      <Declare bind:progress {domain} seed={wallet.seed} {bsf_seed}/>
    {:else if progress === Progress.Done}
      <p>You are all set! Try your new domain out by sending yourself a Banano or two in Bananostand at {domain}.ban!</p>
      <p>You can make further changes to your BNS domain by entering the seed and clicking the "Create Domain Account" in the <a href="https://bns.prussia.dev/browser_test">BNS Web Wallet</a>.</p>
      <p>As a reminder, the seed you need to save is <code>{bsf_seed}</code></p>
    {:else if progress === Progress.Failed}
      <span class="error">{message}</span>
    {/if}
  </div>
</div>

<style>
  #main {
    min-height: 100vh;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    background-color: var(--green);
  }
</style>
