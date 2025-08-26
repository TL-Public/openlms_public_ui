<script>
	import Filter from '$lib/Components/Filter.svelte';
	import { createEventDispatcher } from 'svelte';
	// Constants for value of select all filter option
	import { String_Constants } from './../../config/constants.js';
	import { _ } from 'svelte-i18n';

	// set default filter values to select all value of that filter
	export let courseFilterValue = String_Constants.ALL_COURSES;
	export let stateFilterValue = String_Constants.ALL_STATES;

	// gets option lists from +page.svelte
	export let courseFilterOptionList = [];
	export let stateFilterOptionList = [];

	const dispatch = createEventDispatcher();
	let stateId = '-1';
	// dipatches event when filters are applied or cleared
	function handleApplyFilter() {
		dispatch('handleFilters', {
			courseFilter: courseFilterValue,
			stateFilter: stateFilterValue,
			stateId
		});
	}

	function handleClearFilter() {
		courseFilterValue = String_Constants.ALL_COURSES;
		stateFilterValue = String_Constants.ALL_STATES;
		dispatch('handleFilters', {
			courseFilter: courseFilterValue,
			stateFilter: stateFilterValue,
			stateId: '-1'
		});
	}

	function handleStateFilter(e) {
		stateId = e.detail.extId;
	}
	// configures options for filter component
	const stateFilterConfig = {
		optionNameKey: 'name',
		optionIdKey: 'extId'
	};

	const courseFilterConfig = {
		optionNameKey: 'title',
		optionIdKey: 'uuid'
	};
</script>

<div class="relative flex justify-end gap-8">
	<div class=" w-full flex sm:flex-row flex-col sm:gap-5 gap-2 justify-end flex-wrap">
		<Filter
			bind:itemSelected={stateFilterValue}
			optionList={stateFilterOptionList}
			optionListConfigObject={stateFilterConfig}
			addClass="sm:min-w-40 lg:min-w-60"
			on:filterItemSelected={handleStateFilter}
		/>
		<Filter
			bind:itemSelected={courseFilterValue}
			optionList={courseFilterOptionList}
			optionListConfigObject={courseFilterConfig}
			addClass="sm:min-w-40 lg:min-w-60"
		/>
		<div class="flex justify-between gap-5">
			<button on:click={handleClearFilter} class="text-sm font-semibold text-secondary"
				>{$_('ClearFilter')}</button
			>
			<button
				on:click={handleApplyFilter}
				class="text-sm lg:text-sm rounded-[4px] font-semibold text-white bg-primary px-6 py-2"
				>{$_('ApplyFilters')}</button
			>
		</div>
	</div>
</div>
