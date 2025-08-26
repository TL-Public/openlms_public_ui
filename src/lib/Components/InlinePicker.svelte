<script>
	import { createEventDispatcher, tick } from 'svelte';
	import { onMount } from 'svelte';
	export let pickerTitle = '';
	export let optionList = [];
	export let showDropdown = false;
	export let addClass = '';
	export let alignment = 'L'; //L- for left and R for right
	export let selectedItem = {};
	export let defaultSortItem = '';

	const dispatch = createEventDispatcher();
	let dropDownRef;

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	async function handlePicker(item) {
		selectedItem = item.name;
		await tick();
		dispatch('pickerSelection', item);
		closeDropdown();
	}

	function closeDropdown() {
		showDropdown = false;
	}

	onMount(() => {
		if (defaultSortItem) {
			selectedItem = defaultSortItem;
		}
		document.addEventListener('click', handleClickOnDocument);
		return () => {
			document.removeEventListener('click', handleClickOnDocument);
		};
	});

	function handleClickOnDocument(e) {
		if (dropDownRef && !dropDownRef.contains(e.target)) {
			closeDropdown();
		}
	}
</script>

<div class="relative inline-block text-right {addClass}" id="inline-picker" bind:this={dropDownRef}>
	<button
		type="button"
		class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
		id="menu-button"
		aria-expanded="false"
		aria-haspopup="true"
		on:click={toggleDropdown}
	>
		{pickerTitle}
		<svg
			class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
		>
			<path
				fill-rule="evenodd"
				d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	{#if showDropdown}
		<div
			class="absolute right-0 z-10 mt-2 min-w-9 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div role="none" class="w-full">
				{#each optionList as option, index}
					<button
						on:click={() => handlePicker(option)}
						class="block w-full break-keep text-nowrap {alignment == 'L'
							? 'text-left'
							: 'text-right'} px-2 py-2 text-sm text-gray-500 {selectedItem == option?.name
							? 'bg-gray-200 font-semibold text-gray-900'
							: ''}"
						role="menuitem"
						tabindex="-1"
						id="menu-item-{index}">{option?.displayName}</button
					>
				{/each}
			</div>
		</div>
	{/if}
</div>
