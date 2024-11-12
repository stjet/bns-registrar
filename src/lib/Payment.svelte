<script lang="ts">
  import { browser } from "$app/environment";

  import { toDataURL } from "qrcode";

  import { Progress } from "$lib/types";
  import { get_price, seconds_to_time, ALLOWED } from "$lib/utils";

  let { domain, payment_address, send_to_pub_key, progress = $bindable() } = $props();

  let time_left: number = $state(5 * 60);
  let payment_qr_promise: Promise<String> = $derived(toDataURL(`ban:${payment_address}?amount=${String(window.bns.banani.whole_to_raw(String(price)))}`));
  let error: String = $state(undefined);

  let price = $state(undefined);

  if (domain.length > 3 && domain.split("").every((c) => ALLOWED.includes(c)) && domain !== undefined) {
    price = get_price(domain.length);
  }

  setInterval(() => time_left -= 1, 1000);

  async function check_for_payment() {
    let { send_hash, message } = await (await fetch("/api/check_payment", {
      method: "POST",
      body: JSON.stringify({
        domain,
        send_to_pub_key,
      }),
    })).json();
    if (!send_hash) {
      error = "Have you sent the payment?";
    } else {
      console.log(send_hash);
      progress = Progress.Declare;
    }
  }
</script>

{#if error}
  <span class="error">{error}</span>
{/if}
{#if isNaN(price)}
  <p>Invalid domain name (too short / disallowed characters)</p>
{:else}
  <p>Send {price} BAN to <code>{payment_address}</code></p>
  <p><a href="https://thebananostand.com?request=send&address={payment_address}&amount={price}" target="_blank">Open in Bananostand</a></p>
  <p><a href="ban:{payment_address}?amount={String(window.bns.banani.whole_to_raw(String(price)))}" target="_blank">Open in Kalium</a></p>
  {#await payment_qr_promise}
    <p>Loading QR...</p>
  {:then payment_qr}
    <img alt="Payment QR code" src="{payment_qr}">
  {/await}
  <br>
  <p>{seconds_to_time(time_left)}</p>
  <br>
  <button onclick={check_for_payment} class="button">I've sent the payment</button>
{/if}

<style>
  p {
    margin-bottom: 15px;
  }
</style>

