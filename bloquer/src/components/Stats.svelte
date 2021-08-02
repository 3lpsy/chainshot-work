<script lang="ts">
  import { account } from "$stores/account";
</script>

<div class="w-full shadow stats">
  <div class="stat bg-neutral-content">
    <div class="stat-figure text-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="inline-block w-8 h-8 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </div>
    <div class="stat-title text-secondary">Block Height</div>
    {#if $account.chain.height > 0}
      <div class="stat-value text-primary">{$account.chain.height}</div>
    {:else}
      <div class="stat-value text-primary">Much High. Wow</div>
    {/if}
  </div>
  <div class="stat bg-neutral-content">
    <div class="stat-figure text-info">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="inline-block w-8 h-8 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    </div>
    <div class="stat-title text-secondary">Block Transactions</div>
    {#if $account.chain.lastTxCount > 0}
      <div class="stat-value text-primary">{$account.chain.lastTxCount}</div>
    {:else}
      <div class="stat-value text-primary">Tooo many</div>
    {/if}
  </div>
  <div class="stat bg-neutral-content">
    <div class="stat-figure text-info">
      <div class="avatar online">
        <div class="w-16 h-16 p-1 mask mask-squircle bg-base-100">
          <img src="/metamask.png" alt="Authenticate with Metamask" class="mask mask-squircle" />
        </div>
      </div>
    </div>
    <div class="stat-title text-secondary">Account</div>
    {#if $account.isMetamasked}
      <div class="stat-value text-primary">{$account.metamaskBalance.substring(0, 6)} Eth</div>
      <div class="stat-desc text-info">{$account.metamaskAddress}</div>
    {:else}
      <div class="stat-value text-primary">...</div>
      <div class="stat-desc text-info">0x0000</div>
    {/if}
  </div>
</div>
