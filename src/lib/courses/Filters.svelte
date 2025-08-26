<script>
	import Filter from '$lib/Components/Filter.svelte';
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	// get value for select all option
	import { String_Constants } from '../../config/constants';

	const dispatch = createEventDispatcher();

	// Constants for value of select all filter option
	export let stateFilterOptionList = [];
	// set initial value to select all option
	export let stateFilterValue = String_Constants.ALL_STATES;

	// configure the incoming state option list for filter
	const optionListConfigObject = {
		optionNameKey: 'name',
		optionIdKey: 'extId'
	};
	let stateId = '-1';
	// handle apply or clear filter by dispatching coresponding event
	function handleApplyFilter() {
		dispatch('handleFilters', { stateFilter: stateFilterValue, stateId });
	}

	function handleClearFilter() {
		stateFilterValue = String_Constants.ALL_STATES;
		dispatch('handleFilters', { stateFilter: stateFilterValue, stateId: '-1' });
	}

	function handleFilterItemSelection(e) {
		stateId = e.detail.extId ? e.detail.extId : '-1';
	}
</script>

<div class="relative flex justify-end gap-8">
	<div class="sm:w-3/4 w-full flex sm:flex-row flex-col gap-5 justify-end">
		<Filter
			bind:itemSelected={stateFilterValue}
			optionList={stateFilterOptionList}
			{optionListConfigObject}
			addClass="sm:w-60"
			on:filterItemSelected={handleFilterItemSelection}
		/>
		<div class="flex justify-between gap-5">
			<button on:click={handleClearFilter} class="text-sm font-semibold text-secondary"
				>{$_('ClearFilter')}</button
			>
			<button
				on:click={handleApplyFilter}
				class="text-sm rounded-[4px] font-semibold text-white bg-primary px-6 py-2"
				>{$_('ApplyFilters')}</button
			>
		</div>
	</div>
</div>
