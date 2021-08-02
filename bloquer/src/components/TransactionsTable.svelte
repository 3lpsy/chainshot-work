<script lang="ts">
  import { account } from "$stores/account";
</script>

<div class="overflow-x-auto">
  <table class="table w-full table-compact border-gray-100">
    <thead>
      <tr>
        <th />
        <th>Hash</th>
        <th>From</th>
        <th>To</th>
        <th>Value</th>
        <th>Nonce</th>
      </tr>
    </thead>
    <tbody>
      {#if $account.chain.blockTxs}
        {#each $account.chain.blockTxs as tx}
          <tr>
            <th>{tx.transactionIndex}</th>
            <td>{tx.hash}</td>
            <td>{tx.from}</td>
            <td>{tx.to}</td>
            <td>{tx.value.toString()}</td>
            <td>{tx.nonce}</td>
          </tr>
        {/each}
      {/if}
    </tbody>
    <tfoot>
      <tr>
        <th />
        <th>Hash</th>
        <th>From</th>
        <th>To</th>
        <th>Value</th>
        <th>Nonce</th>
      </tr>
    </tfoot>
  </table>
</div>
