<script lang="ts">
  import { goto } from "$app/navigation";

  import { get_price, ALLOWED } from "$lib/utils";

  let domain_content: String = $state("");
  let error: String = $state("");
  let price: String = $state("");

  function domain_keydown(event: KeyboardEvent) {
    let key = event.key.toLowerCase();
    if (!ALLOWED.includes(key)) {
      event.preventDefault();
    } else {
      price = "";
      if (domain_content.length > 3) {
        price = `Price: ${get_price(domain_content.length)} BAN`;
      }
    }
  }

  function domain_keyup() {
    domain_content = domain_content.toLowerCase();
  }

  async function domain_next() {
    domain_content = domain_content.toLowerCase();
    if (domain_content.length < 4) {
      error = "Domain name must be more than 3 characters";
    } else {
      const resp = await (await fetch("/api/domain_issued?domain=" + domain_content)).json();
      if (resp.issued) {
        error = "Domain name already issued, choose another one";
      } else {
        error = "";
        goto("/register?domain=" + domain_content);
      }
    }
  }
</script>

<svelte:head>
  <title>Get your .ban</title>
</svelte:head>

<div>
  <div id="front">
    <div id="pitch" class="half">
      <h1>.ban: It's Healthy</h1>
      <div id="nutrition">
        <h2><b>Nutrition Facts</b></h2>
        <hr>
        <span>1 serving per domain</span>
        <br>
        <span><b>Serving size</b></span> <span class="right"><b>starting at 190 $BAN (or 1 kg of bananas)</b></span>
        <hr class="thickest">
        <span><b>Amount per serving</b></span>
        <br>
        <span class="calories"><b>Calories</b></span> <span class="right calories"><b>0</b></span>
        <hr class="thick">
        <span> </span> <span class="right"><b><small>% Daily Value</small></b></span>
        <hr>
        <span><b>Decentralisation</b> 25g</span> <span class="right"><b>100%</b></span>
        <hr>
        <span class="stagger">On-chain?</span> <span class="right"><b>Yep</b></span>
        <hr>
        <span class="stagger">Censorable?</span> <span class="right"><b>Nope</b></span>
        <hr>
        <span class="stagger">Revocable?</span> <span class="right"><b>Hell no</b></span>
        <hr>
        <span><b>Utility</b> 17g</span> <span class="right"><b>100%</b></span>
        <hr>
        <span class="stagger">Fast and Feeless?</span> <span class="right"><b>Duh</b></span>
        <hr>
        <span class="stagger">Wait, no renewal fees?</span> <span class="right"><b>Yesss</b></span>
        <hr>
        <span class="stagger">Mine, forever?</span> <span class="right"><b>Bingo</b></span>
        <hr>
        <span class="stagger">Transferable?</span> <span class="right"><b>Si</b></span>
        <hr>
        <span class="stagger">Resolves to Banano address?</span> <span class="right"><b>Correct</b></span>
        <hr>
        <span class="stagger">Can be associated with arbitrary metadata?</span> <span class="right"><b>Yeah...</b></span>
        <hr class="thickest">

        <span>Potassium 190g 55882%</span> - <span class="right">Thorium 0g 0%</span>
        <hr>
        <span>Unicorn Horn powder 10mg 41%</span> - <span class="right">Typescript 1kg 1%</span>
        <hr class="thick">
      </div>
      <p id="bottom-1">Have <code>yourname.ban</code> resolve to <code>ban_1area11yrea11yrea11y1ongdifficu1ttorememberaddress11hcd8a7c9</code>! Other usecases like decentralised websites coming soon™</p>
    </div>
    <div id="get" class="half">
      <div id="get-child">
        <h1 id="mobile-title">Buy a .ban Domain</h1>
        <div id="input-container">
          <input placeholder="Get your .ban on" maxlength="32" onkeydown={domain_keydown} onkeyup={domain_keyup} bind:value={domain_content} type="text"/><span>.ban</span><input onclick={domain_next} type="button" value="-->"/>
        </div>
        <span id="price">{price}</span>
        <span class="error">{error}</span>
        <div>
          <h2>Supported by:</h2>
          <div>
            <a href="https://thebananostand.com" target="_blank">Bananostand</a>
            <br>
            <a href="https://creeper.banano.cc" target="_blank">Creeper</a>
            <br>
            <a href="https://banano.nano.trade/b" target="_blank">Kuyumucu (banano.trade)</a>
            <br>
            <a href="https://www.banano-sports-pools.xyz" target="_blank">Banano Sports Pools</a>
            <br>
            <a href="https://gorillanation.cc" target="_blank">Gorilla Nation</a>
            <br>
            <a href="https://monke42.link" target="_blank">Monke42.link</a>
            <br>
            <a href="https://faucet.banxno.com/" target="_blank">BanXNO Faucet</a>
            <br>
            <a href="https://faucet.prussia.dev/" target="_blank">faucet.prussia.dev</a>
            <br>
            <a href="https://banfts.prussia.dev/explorer" target="_blank">Banfts (search)</a>
            <br>
            <span>And more in the near future!</span>
          </div>
        </div>
        <p id="bottom-2">.ban is the first publicly available top level domain (TLD) for the <a href="https://github.com/stjet/bns/blob/master/bns_protocol.md">Banano Name Service protocol (BNS)</a></p>
      </div>
    </div>
  </div>
</div>

<style>
  #front {
    display: grid;
    grid-template-columns: 50vw 50vw;
    height: 100vh;
  }

  #pitch {
    background-color: var(--green);
  }

  .half {
    padding: 2em;
  }

  .right {
    float: right;
  }

  .stagger {
    margin-left: 2em;
  }

  h1 {
    font-size: xxx-large;
  }

  h2 {
    font-size: xx-large;
  }

  .calories {
    font-size: x-large;
  }

  #bottom-1 {
    word-break: break-all;
  }

  hr {
    margin: 1px 0;
    border-style: solid;
    border-color: var(--grey1);
    width: 100%;
  }

  .thickest {
    border-width: 7px;
  }

  .thick {
    border-width: 4px;
  }

  #get {
    background-color: var(--yellow);
  }

  #get-child {
    width: 100%;
    height: 100%;
    position: relative;
  }

  #bottom-2 {
    position: absolute;
    bottom: 0;
  }

  #input-container {
    width: 100%;
    height: 30px;
    border: 1px solid gray;
    border-radius: 10px;
    margin: auto;
    background-color: white;
  }

  #input-container input {
    border: none;
    margin: 0;
    padding: 0;
    height: 100%;
  }

  #input-container input[type="text"] {
    padding-left: 3px;
    width: calc(63% - 3px);
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  
  #input-container span {
    display: inline-block;
    width: 12%;
    text-align: center;
  }

  #input-container input[type="button"] {
    width: 25%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: var(--grey2);
  }

  #logo {
    height: 16px;
    width: 16px;
    margin-top: 2px;
  }

  #mobile-title {
    display: none;
  }

  @media only screen and (max-width: 900px) {
    #pitch {
      display: none;
    }

    #front {
      grid-template-columns: 100vw;
    }

    #mobile-title {
      display: block;
      margin-bottom: 19px;
    }
  }
</style>
