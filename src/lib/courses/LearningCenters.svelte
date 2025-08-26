<script>
	import DatatableCard from '$lib/Components/DatatableCard.svelte';
	import Datatable from '$lib/Components/datatable.svelte';
	import { _, format } from 'svelte-i18n';
	import SearchBar from '$lib/Components/SearchBar.svelte';
	import Filters from '$lib/courses/Filters.svelte';
	import { goto } from '$app/navigation';
	// get value for select all option
	import { String_Constants } from '../../config/constants';
	import NotFound from '$lib/svgComponents/NotFound.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';

	let searchValue = '';

	// get data from CourseSection.svelte
	export let centersData = [];

	// function createFlattenedCenterData(centersData) {
	// 	let flattenedData = centersData.map((element) => ({
	// 		name: element.name,
	// 		stateName: element.stateName,
	// 		stateId: element.stateId,
	// 		uuid: element.uuid
	// 	}));

	// 	return flattenedData;
	// }
	let flattenedCentersData = centersData;

	$: flattenedCentersData = mergeCentersByUuid(centersData);
	function mergeCentersByUuid(data) {
		const centerMap = new Map();

		for (const center of data) {
			const { uuid, plannedDate, startDateObj } = center;

			if (!centerMap.has(uuid)) {
				centerMap.set(uuid, {
					...center,
					plannedDates: new Set([plannedDate]),
					startDates: [startDateObj]
				});
			} else {
				const existing = centerMap.get(uuid);
				existing.plannedDates.add(plannedDate);
				existing.startDates.push(startDateObj);
			}
		}

		return Array.from(centerMap.values()).map((center) => {
			const sortedPlannedDates = Array.from(center.plannedDates).sort((a, b) => {
				const dateA = new Date(`01-${a}`);
				const dateB = new Date(`01-${b}`);
				return dateA - dateB; 
			});

			return {
				...center,
				plannedDate: sortedPlannedDates.join(', '),
				startDateObj: center.startDates.sort()[0] 
			};
		});
	}

	$: filteredCentersData = flattenedCentersData;
	
	// // update the data if center data is changes ( this might not be needed )
	// $: {
	// 	flattenedCentersData = createFlattenedCenterData(centersData);
	// 	filteredCentersData = flattenedCentersData;
	// }

	export let statesData = [];

	function sendSearchValueToDatatable(e) {
		searchValue = e.detail;
	}

	let tableHeadersDisplay = [
		{
			key: 'name',
			name: $format('Name')
		},
		{
			key: 'stateName',
			name: $format('State')
		},
		{
			key: 'plannedDate',
			name: 'Planned Date',
			disableSort: true
		}
	];
	let cardHeaderDisplay = {
		title: {
			key: 'name',
			name: $format('Name')
		},
		nonTitleData: [
			{
				key: 'stateName',
				name: $format('State')
			},
			{
				key: 'plannedDate',
				name: 'Planned Date',
				disableSort: true
			}
		]
	};
	// to reactivly update headers when the language changes
	$: setHeaders($format);

	function setHeaders() {
		tableHeadersDisplay = [
			{
				key: 'name',
				name: $format('Name')
			},
			{
				key: 'stateName',
				name: $format('State')
			},
			{
				key: 'plannedDate',
				name: 'Planned Date',
				disableSort: true
			}
		];

		cardHeaderDisplay = {
			title: {
				key: 'name',
				name: $format('Name')
			},
			nonTitleData: [
				{
					key: 'stateName',
					name: $format('State')
				},
				{
					key: 'plannedDate',
					name: 'Planned Date',
					disableSort: true
				}
			]
		};
	}
	const actionConfigObject = [
		{
			actionName: 'View',
			actionIconName: 'visibility'
		}
	];
	let actionConfigObjectCard = [
		{
			actionName: 'Details'
		}
	];

	function handleTableAction(event) {
		const { actionName, actionData } = event.detail;

		// navigate to training center page if view is clicked
		if (
			actionName == actionConfigObject[0].actionName ||
			actionName == actionConfigObjectCard[0].actionName
		) {
			goto(`/trainingCenters/details/${actionData.uuid}`);
		}
	}

	function handleFilter(event) {
		const { stateId } = event.detail;
		// if filter value is all states then use all the available data
		if (stateId == '-1') {
			filteredCentersData = flattenedCentersData;
		}
		// else filter according to the value
		else {
			// TODO write new logic for state filtering
			filteredCentersData = flattenedCentersData.filter((element) => {
				if (element.stateId == stateId) {
					return true;
				}
			});
		}
	}

	let sortAccordingTo = {
		header: null,
		entityType: null,
		sortingOrder: null
	};
</script>

<Filters
	stateFilterOptionList={statesData}
	stateFilterValue={statesData[0]?.name}
	on:handleFilters={handleFilter}
/>
<div class="mt-6">
	<SearchBar
		on:handleSearchValue={sendSearchValueToDatatable}
		placeholder={$_('SearchByRSETIName')}
		searchButton={false}
	/>
</div>
<div class="mt-5 sm:block hidden">
	{#if filteredCentersData.length !== 0}
		<Datatable
			on:tableActionClick={handleTableAction}
			tableData={filteredCentersData}
			{searchValue}
			{tableHeadersDisplay}
			{actionConfigObject}
			bind:sortAccordingTo
			rowHeight="compact"
			searchParameter="name"
		/>
	{:else}
		<ErrorComponent errorMessage={$format('NoTCFound')} />
	{/if}
</div>
<div class="sm:hidden flex flex-col gap-4 mt-5">
	{#if filteredCentersData.length !== 0}
		<DatatableCard
			on:cardActionClick={handleTableAction}
			cardsData={filteredCentersData}
			{searchValue}
			{cardHeaderDisplay}
			actionConfigObject={actionConfigObjectCard}
			bind:sortAccordingTo
		/>
	{:else}
		<ErrorComponent errorMessage={$format('NoTCFound')} />
	{/if}
</div>
