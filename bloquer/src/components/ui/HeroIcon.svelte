<script>
  import * as solids from "./HeroIconSolid.js";
  import * as outlines from "./HeroIconOutline.js";
  let _class = "";

  export let icon = {};
  export let size = "1em";
  export { _class as class };
  export let name = "";
  export let variant = "outline";
  export let extraProps = {};

  function getVariant(name) {
      let pool;
      if (variant === "solid") {
        pool = solids; 
      } else if (variant === "outline") {
        pool = outlines;
      }
      else {
        throw new Error ("invalid variant name for icon");
      }
      if (Object.keys(pool).includes(name)) {
        return pool[name];
      }
      else {
        throw new Error("name not found in pool");
      }
  }

  function getVariantProps(name) {
      return Object.assign(getVariant(name).svg, extraProps);
    }

  function hasIcon(name) {
      return getVariant(name);
  }

  //let width = size || "1em";
  //let height = size || "1em";
  $: svgProps = icon["svg"] || {};
  $: paths = icon["paths"] || [];
</script>

{#if icon && !name}
  <svg
    class={_class}
    {...svgProps}
    xmlns="http://www.w3.org/2000/svg"
  >
    {#each paths as pathProps}
      <path {...pathProps} />
    {/each}
  </svg>
{:else if name && hasIcon(name)}
  <svg
    class={_class}
    {...getVariantProps(name)}
    xmlns="http://www.w3.org/2000/svg"
  >
    {#each getVariant(name).paths as pathProps}
      <path {...pathProps} />
    {/each}
  </svg>
{/if}

<style>
  svg, path {
    display:block;
    margin: auto;
  }
</style>
