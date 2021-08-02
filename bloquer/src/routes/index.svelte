<script lang="ts">
  import Head from '$components/Head.svelte'
  import Navbar from '$components/Navbar.svelte'
  import HomeIndex from '$pages/HomeIndex.svelte'
</script>

<svelte:head>
  <Head />
</svelte:head>

<Navbar />
<main class="flex-grow block overflow-x-hidden bg-base-100 text-base-content">
  <div class="p-4 lg:p-10">
    <HomeIndex />
  </div>
</main>
