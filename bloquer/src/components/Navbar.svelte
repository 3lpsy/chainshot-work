<script lang="ts">
  import NavbarItem from "$components/NavbarItem.svelte";
  import HeroIcon from "$components/ui/HeroIcon.svelte";
  import { account } from "$stores/account";
  let appname = "Bloquer";

  // let currentMetamaskAddress = account.metamaskAddress;
</script>

<nav class="navbar mb-2 shadow-lg bg-neutral text-neutral-content">
  <div class="flex-none px-2 mx-2">
    <span class="text-lg font-bold"> {appname} </span>
  </div>
  <div class="flex-1 px-2 mx-2">
    <div class="items-stretch hidden lg:flex">
      <NavbarItem labelText="Transactions" />
      <NavbarItem labelText="Blocks" />
      <NavbarItem labelText="Tokens" />
    </div>
  </div>
  <p>{$account.isMetamasked}</p>
  {#if !$account.isMetamasked}
    <div class="flex-none">
      <button
        class="btn btn-square btn-ghost w-full p-1"
        on:click={() => account.addMetamaskConnection()}
      >
        <img src="/metamask.svg" alt="metamask" />
        <span class="ml-1"> Connect Metamask</span>
      </button>
    </div>
  {:else}
    <div class="flex-none">
      <button
        class="btn btn-square btn-ghost w-full p-1"
        on:click={() => account.removeMetamaskConnection()}
      >
        <img src="/metamask.svg" alt="connected" />
        <span class="ml-1"> Connected {$account.metamaskAddress.substring(0, 8)}</span>
      </button>
    </div>
  {/if}
  <div class="divider divider-vertical text-primary" />
  {#if true}
    <div class="flex-none">
      <button class="btn btn-square w-full btn-ghost p-1" on:click={() => {}}>
        <HeroIcon
          class="inline-block w-6 h-6 stroke-current"
          name="plusCircle"
          extraProps={{ viewBox: "0 0 24 24" }}
        />
        <span class="ml-1"> Add RPC Connection </span>
      </button>
    </div>
  {:else}
    <div class="flex-none">
      <button class="btn btn-square w-full btn-ghost p-1">
        <HeroIcon
          class="inline-block w-6 h-6 stroke-current"
          name="minusCircle"
          extraProps={{ viewBox: "0 0 24 24" }}
        />
        <span class="ml-1"> RPC Connected </span>
      </button>
    </div>
  {/if}
</nav>

<style>
  button img {
    max-height: 30px;
  }
</style>
