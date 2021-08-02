<script lang="ts">
  import Stats from "$components/Stats.svelte";
  import TransactionsTable from "$components/TransactionsTable.svelte";
</script>

<Stats />
<div class="divider" />
<div>
  <h2 class="my-6 text-5xl font-bold">
    <span class="text-primary">Transactions</span>
  </h2>
  <div class="py-2">
    <TransactionsTable />
  </div>
</div>
