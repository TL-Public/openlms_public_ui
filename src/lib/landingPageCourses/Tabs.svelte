<script>
	import { text } from '@sveltejs/kit';
	import { createEventDispatcher, onMount } from 'svelte';
	export let tabs;
	const despatch = createEventDispatcher();
	let activeTab = tabs?.[0]?.category ?? '';

	function handleTab(tabContent) {
		activeTab = tabContent.category;

		despatch('handleActiveTab', tabContent);
	}
</script>

<!-- <div class="sm:hidden">
      <label for="button" class="sr-only">Dropdown Menu</label>
    <div class="relative mt-2" bind:this={dropDownRef}>
    <button type="button" class="capitalize inline-flex w-full justify-between items-center gap-x-1.5 rounded-md border-darkGray bg-white  py-3 px-5 text-md  text-darkGray shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50  md:text-sm lg:text-sm" id="dropdownn" aria-expanded="true" aria-haspopup="true"
    on:focus={() => (showDropdown = true)}>
    {activeTab ? activeTab :'Select'}

      {#if showDropdown === false}
      <div class="">
      <svg class="-mr-1 h-6 w-6  text-darkGray" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
      </div>
      {/if}

    </button>
  </div>

 
  {#if showDropdown}
    <div class="py-1 shadow-md" role="none"  on:click={handleTab}>
    {#each tabs as tab}
      <a   href="#" class="cursor-pointer capitalize block px-4 py-2 text-sm text-darkGray hover:border-orange-60" role="menuitem" tabindex="-1" id="menu-item-0" >{tab.text}</a>
      {/each}
      </div>
      {/if}
 
    </div> -->

<div class="w-full">
	<nav class="sm:flex sm:flex-row sm:flex-wrap grid grid-cols-2">
		{#each tabs as tab, index (index)}
			<button
				on:click={() => handleTab(tab)}
				class=" whitespace-nowrap cursor-pointer border-b-2 px-4 py-3 text-sm text-white capitalize hover:border-accent-hover {tab.category ===
				activeTab
					? 'border-accent font-bold'
					: 'border-transparent font-medium'}">{tab.name}</button
			>
		{/each}
	</nav>
</div>
