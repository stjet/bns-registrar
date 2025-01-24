<script lang="ts">
  import { browser } from "$app/environment";

  import { Progress } from "$lib/types";

  let { seed, bsf_seed, domain, progress = $bindable() } = $props();

  let resolve_to: String = $state("");

  async function declare() {
    resolve_to = resolve_to.trim();
    if (browser && resolve_to.startsWith("ban_") && resolve_to.length === 64) {
      const rpc = new window.bns.banani.RPC("https://kaliumapi.appditto.com/api");
      const wallet = new window.bns.banani.Wallet(rpc, seed);
      const hashes = (await wallet.get_account_receivable()).blocks;
      const infos = (await rpc.get_blocks(hashes)).blocks;
      //in case registrar accidentally sends the domain twice, only the first send (with lowest height) will be valid, so receive that
      //BUT kalium rpc doesn't return height yet (augh) so we'll go for the one with the higher balance (since that was almost certainly sent first)
      let to_receive;
      for (const hash of hashes) {
        const balance = BigInt(infos[hash].balance);
        if (!to_receive || balance > to_receive?.balance) {
          to_receive = {
            hash,
            balance,
          };
        }
        console.log(to_receive, balance);
      }
      await wallet.receive(to_receive.hash);
      const domain_manager = new window.bns.DomainAccountManager(rpc, wallet);
      await domain_manager.declare_domain_resolve_to(resolve_to);
      progress = Progress.Done;
    }
  }
</script>

<p>One last step! Just enter your main Banano address below, so anyone sending to {domain}.ban can know to send it to you.</p>

<div>
  <input bind:value={resolve_to} type="text" placeholder="ban_..."/>
  <br><br>
  <button class="button" onclick={declare}>Declare Address to Resolve to</button>
</div>

<style>
  input {
    border: 1px solid gray;
    padding: 5px;
    min-width: 40%;
    border-radius: 10px;
  }
  div {
    margin: 15px 0;
  }
</style>

