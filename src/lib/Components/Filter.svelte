<script>
	import { createEventDispatcher, onMount } from 'svelte';

	export let addClass = '';
	export let itemSelected = 'Default Option';
	let selectState = false;
	let dropDownRef;
	let lastSelected = itemSelected;
	let highlightedIndex = -1;
	let inputRef;
	const dispatch = createEventDispatcher();

	// optionListConfigObject allows option list with custom key for option name
	// and custom key for id
	export let optionListConfigObject = {
		optionNameKey: 'name',
		optionIdKey: 'id'
	};
	export let optionList = [
		{ id: 1, name: 'option_1' },
		{ id: 2, name: 'option_2' },
		{ id: 3, name: 'option_3' }
	];
	let filteredOptionList = optionList;

	function toggleSelectState() {
		selectState = !selectState;
		if (selectState) {
			highlightedIndex = filteredOptionList?.findIndex(
				(option) => option[optionListConfigObject?.optionNameKey] === itemSelected
			);
			setTimeout(() => inputRef && inputRef?.focus(), 0);
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOnDocument);
		return () => {
			document.removeEventListener('click', handleClickOnDocument);
		};
	});

	function handleClickOnDocument(e) {
		if (dropDownRef && !dropDownRef.contains(e.target)) {
			filteredOptionList = optionList;
			selectState = false;
		}
	}

	// filters the options based on the value in the combo box
	function handleComboBoxChange(event) {
		selectState = true; // Keep the dropdown open while typing
		filteredOptionList = optionList?.filter((element) => {
			return element[optionListConfigObject?.optionNameKey]
				?.toLowerCase()
				.trim()
				.includes(event.target.value.toLowerCase().trim());
		});
		highlightedIndex = 0;
	}

	function handleOptionSelect(option) {
		itemSelected = option[optionListConfigObject?.optionNameKey];
		lastSelected = itemSelected; 
		selectState = false; // Close the dropdown
		highlightedIndex = -1;
		dispatch('filterItemSelected', option);
	}

	function handleInputKeydown(event) {
		if (!selectState) return;
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (filteredOptionList.length === 0) return;
			highlightedIndex = (highlightedIndex + 1) % filteredOptionList.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (filteredOptionList.length === 0) return;
			highlightedIndex =
				(highlightedIndex - 1 + filteredOptionList.length) % filteredOptionList.length;
		} else if (event.key === 'Enter') {
			event.preventDefault();
			if (highlightedIndex >= 0 && highlightedIndex < filteredOptionList.length) {
				handleOptionSelect(filteredOptionList[highlightedIndex]);
			}
		} else if (event.key === 'Escape') {
			resetInputToLastSelected();
			selectState = false;
			highlightedIndex = -1;
		}
	}

	function handleInputBlur(event) {
		if (selectState) {
			setTimeout(() => {
				if (!document.activeElement || !dropDownRef.contains(document.activeElement)) {
					resetInputToLastSelected();
					selectState = false;
					highlightedIndex = -1;
				}
			}, 100);
		}
	}

	function resetInputToLastSelected() {
		itemSelected = lastSelected;
	}
</script>

<div class={addClass} bind:this={dropDownRef}>
	<div class="relative">
		<div class="relative">
			<input
				on:input={handleComboBoxChange}
				bind:value={itemSelected}
				on:click={toggleSelectState}
				bind:this={inputRef}
				on:keydown={handleInputKeydown}
				on:blur={handleInputBlur}
				class="relative w-full cursor-default rounded-md bg-blue-20 py-2.5 sm:py-1.5 pl-3 pr-10 text-left font-semibold text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 text-xs sm:leading-6"
				aria-haspopup="listbox"
				aria-expanded={selectState}
				aria-labelledby="listbox-label"
				title={itemSelected}
			/>
			<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
				<svg
					class="h-5 w-5 text-gray-400"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</div>

		{#if selectState}
			<ul
				class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
				tabindex="-1"
				role="listbox"
				aria-labelledby="listbox-label"
				aria-activedescendant="listbox-option-3"
			>  {#if filteredOptionList.length === 0}
            <li class="relative cursor-default select-none text-gray-400 px-3 py-2">
                No options found
            </li>
        {:else}
				{#each filteredOptionList as option, i (option[optionListConfigObject?.optionIdKey])}
					<li
						class="relative cursor-default select-none font-semibold text-primary hover:bg-gray-100 {highlightedIndex ===
						i
							? 'bg-gray-100'
							: ''}"
						id="listbox-option-{option[optionListConfigObject?.optionIdKey]}"
						role="option"
					>
						<button
							on:click={() => handleOptionSelect(option)}
							class="w-full py-2 pl-3 pr-9 flex justify-start"
							class:bg-gray-100={highlightedIndex === i}
						>
							<span
								class="block truncate font-normal"
								title={option[optionListConfigObject?.optionNameKey]}
							>
								{option[optionListConfigObject?.optionNameKey]}
							</span>
							{#if itemSelected === option[optionListConfigObject?.optionNameKey]}
								<span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
									<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
								</span>
							{/if}
						</button>
					</li>
				{/each}
				{/if}
			</ul>
		{/if}
	</div>
</div>
