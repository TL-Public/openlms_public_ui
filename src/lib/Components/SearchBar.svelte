<script>
	import SearchSvg from '$lib/svgComponents/SearchSvg.svelte';
	import { createEventDispatcher } from 'svelte';
	import {_} from 'svelte-i18n'

	let dispatch = createEventDispatcher();
	export let searchBoxValue = '';
	export let placeholder = "Search by title or topic"
	export let searchButton = true
	export let debounceDelay = 500; // 500ms delay
	let searchTimeout;
	
	
	// debounce function to prevent multiple calls to the function
	const debouncedHandleSearchValue = (searchBoxValue, delay) => {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() =>{
					dispatch('handleSearchValue', searchBoxValue);
			}, delay);
		};

	function handleSearchValue() {
		debouncedHandleSearchValue(searchBoxValue, debounceDelay);
	}

	function clearSearch() {
        searchBoxValue = '';
        handleSearchValue(); // Dispatch empty value to clear the search results
    }
</script>

<div class="rounded-lg w-full">
	<div class="relative flex gap-8">
		<!-- <input
			type="text"
			class=" rounded-md sm:rounded-lg shadow-sm sm:px-12 px-3 py-3 flex-1 lg:py-2  border border-accent"
			placeholder={placeholder}
			bind:value={searchBoxValue}
			on:input={handleSearchValue}
			
			
		/>
		<svg
			class="absolute top-3 left-3 stroke-accent hidden sm:block"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M17.1428 17.1428L14.2856 14.2856"
				stroke-width="1"
				stroke-miterlimit="10"
				stroke-linecap="square"
			/>
			<path
				d="M8.57146 14.2857C11.7274 14.2857 14.2857 11.7274 14.2857 8.57146C14.2857 5.41555 11.7274 2.85718 8.57146 2.85718C5.41555 2.85718 2.85718 5.41555 2.85718 8.57146C2.85718 11.7274 5.41555 14.2857 8.57146 14.2857Z"
				stroke-width="1"
				stroke-miterlimit="10"
				stroke-linecap="square"
			/>
			<path
				d="M5.71436 8.5715C5.71436 7.81374 6.01537 7.08701 6.55119 6.55119C7.08701 6.01537 7.81374 5.71436 8.5715 5.71436"
				stroke-width="1"
				stroke-miterlimit="10"
			/>
		</svg> -->
		<input
		type="text"
		class=" border border-accent rounded-md sm:rounded-lg shadow-sm px-12 py-2 w-full text-xs sm:text-base  focus:ring-0.5  focus:ring-primary  "
		{placeholder}
		bind:value={searchBoxValue}
		on:input={handleSearchValue}
	/>

	<SearchSvg strokeColor={'stroke-accent'} />

	<!-- Clear Button -->
	{#if searchBoxValue}
	<button
		class="absolute right-4 top-1/2 transform -translate-y-1/2  hover:text-accent-hover text-sm text-accent"
		on:click={clearSearch}
	>
	&#x2715;
	</button>
	{/if}
	
	{#if searchButton}
	<button class="px-6 py-2 font-semibold text-white bg-primary rounded-[4px] sm:inline-block hidden"> {$_("Search")} </button>
	{/if}
	</div>
</div>
