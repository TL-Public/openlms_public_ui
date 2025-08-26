<script>
	import { tick } from 'svelte';
	import Map from '$lib/dashboard/Map.svelte';
	import MapListingTable from '$lib/dashboard/MapListingTable.svelte';
	import SearchBar from '$lib/Components/SearchBar.svelte';
	import { format } from 'svelte-i18n';

	export let stateID = '';
	export let stateName = '';
	export let data = [];
	export let containerId = '';
	export let heatMapStartingColorGradient;
	export let heatMapEndingColorGradient;
	export let tableData = [];
	export let tableHeaderDisplay = [];
	export let mapHeader = '';
	export let tableHeading = '';
	export let placeholderForSearch = '';
	export let dataToHighlight = { uniqueProperty: 'id', value: '', enabled: true };

	let selectedStateOnMap = '';
	let searchValue = '';

	async function handleStateData(e) {
		selectedStateOnMap = '';
		await tick();
		selectedStateOnMap = e.detail;
		dataToHighlight.value = selectedStateOnMap;
	}

	async function handleTableAction(e) {
		stateID = '';
		stateName = '';
		await tick();
		stateID = e.detail.actionData?.id;
		stateName = e.detail.actionData?.state;
		dataToHighlight.value = e.detail.actionData?.id;
	}

	function sendSearchValueToDatatable(e) {
		searchValue = e.detail;
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
	<div class="  md:pt-4 rounded">
		<h2 class="text-base font-bold text-primary pb-4">{mapHeader}</h2>
		<Map
			on:handleStateData={handleStateData}
			bind:stateID
			{data}
			{containerId}
			{heatMapStartingColorGradient}
			{heatMapEndingColorGradient}
		/>
	</div>
	<div class="">
		<div class="md:pt-4">
			<h2 class="text-primary font-semibold pb-2 mx-2 sm:mx-4 lg:mx-0">{tableHeading}</h2>
			<div class="pb-2 mx-2 sm:mx-4 lg:mx-0">
				<SearchBar
					on:handleSearchValue={sendSearchValueToDatatable}
					searchButton={false}
					placeholder={placeholderForSearch}
				/>
			</div>
		</div>
		<MapListingTable
			{tableData}
			on:tableActionClick={handleTableAction}
			bind:dataToHighlight
			{searchValue}
			{tableHeaderDisplay}
			notFoundMessage={$format('NoStateFound')}
		/>
	</div>
</div>
