<script lang="ts">
  import "../global.postcss";
  import { theme } from "$stores/theme";

  import { onMount } from "svelte";

  onMount(() => {
    if ($theme === "dark") {
      document.querySelector("html").classList.add("dark");
    }
  });
</script>

<slot />
