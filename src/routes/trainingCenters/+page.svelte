<script>
	import { page } from '$app/stores';
	import AboutRseti from '$lib/TrainingCenters/AboutRSETI.svelte';
	import SearchBar from '$lib/Components/SearchBar.svelte';
	import Filters from '$lib/TrainingCenters/Filters.svelte';
	import ListingTable from '$lib/Components/ListingTable.svelte';
	import SelectInput from '$lib/Components/SelectInput.svelte';
	import { String_Constants } from '../../config/constants.js';
	import { goto } from '$app/navigation';
	import { format } from 'svelte-i18n';
	import { _ } from 'svelte-i18n';
	import InlinePicker from '$lib/Components/InlinePicker.svelte';
	import { onMount } from 'svelte';
	import { Course_Sorting_Order } from '/src/config/constants.js';

	let loading = false;
	let selectedSortOption = '';
	let selectedSortOptionDisplayName = '';
	let sortActionItems = [];

	// Importing params and route for bread crumbs
	let route = $page.route.id;
	let params = $page.params;
	// taking data from +page.js
	export let data;	
	const { courseData, stateData, statesMap, centersData, allCentersMap, lang } = data;

	// function to flatten the incoming centersData
	function createFlattenedCenterData(centerData) {
		let flattenedData =
			centerData?.map((object) => ({
				name: object.name,
				state: statesMap[object.stateId] ?? '-',
				stateId: object.stateId ?? '-',
				courseCount: object?.courseCount ?? '-',
				uuid: object.uuid
			})) ?? [];
		return flattenedData;
	}
	let flattenedTableData = createFlattenedCenterData(centersData);
	// To store filterd data and then pass it to datatable component
	let filterdTableData = flattenedTableData;
	// For creating filter options

	let courseFilterValue = lang === 'hi'? String_Constants.ALL_COURSES_HI :String_Constants.ALL_COURSES;
	let stateFilterValue = lang === 'hi'? String_Constants.ALL_STATES_HI : String_Constants.ALL_STATES;

	// for handeling the search value passed from the SearchBar component
	let searchValue = '';

	// take the value entered in the seach bar and update the seachValue variable
	function sendSearchValueToDatatable(e) {
		searchValue = e.detail;
	}

	async function handleFilter(event) {
		// extracting the filter values from the event
		let stateFilter = event.detail.stateFilter;
		let stateId = event.detail.stateId;
		let courseFilter = event.detail.courseFilter;

		let centersUnderCourse = [];
		// if filter value is all courses then use all the available data
		if (courseFilter === String_Constants.ALL_COURSES || courseFilter === String_Constants.ALL_COURSES_HI ) {
			centersUnderCourse = flattenedTableData;
		} else {
			// Handle the filter according to Course Data here

			// Get uuid of course selected in filter
			const courseUUID = courseData.find((element) => {
				if (element.title.trim().toLocaleLowerCase() === courseFilter.trim().toLocaleLowerCase()) {
					return true;
				}
				return false;
			})?.uuid;

			// 1. call api for the given course name using course uuid
			// 2. set loading state true until the api is fetched.
			loading = true;
			try {
				const apiResponse = await fetch(`/apis/courses/details/${courseUUID}/rsetis`);
				if (apiResponse.status === 404) {
					centersUnderCourse = [];
					return;
				}
				if (!apiResponse.ok) throw new Error('Failed to fetch training centers');

				const apiResponseJson = await apiResponse.json();
				if (!apiResponseJson.rsetiCourses || apiResponseJson?.rsetiCourses?.length === 0) {
					throw new Error();
				}

				// extract rseti data form the returned api response
				const rsetiCourses = apiResponseJson.rsetiCourses;
				let uniqueRsetis = new Map();
				rsetiCourses.forEach((element) => {
					if (uniqueRsetis.has(element.rsetiUuid)) {
						// Increment the course count
						uniqueRsetis.get(element.rsetiUuid).courseCount++;
					} else {
						// Add a new entry with initial course count of 1
						uniqueRsetis.set(element.rsetiUuid, {
							...allCentersMap[element.rsetiUuid],
							courseCount: 1
						});
					}
				});
				const uniqueRsetiArray = Array.from(uniqueRsetis.values());

				// use the function flatten the incoming response
				centersUnderCourse = createFlattenedCenterData(uniqueRsetiArray);
			} catch (error) {
				console.log(error);
				centersUnderCourse = [];
			} finally {
				loading = false;
			}
		}

		//cascading filter
		// if filter value is all states then use all the available data
		if (stateId === '-1') {
			filterdTableData = centersUnderCourse;
		} else {
			filterdTableData = centersUnderCourse.filter((item) => item.stateId == stateId);
		}

		loading = false;
	}
	// ------------------------ TABLE CONFIGURATION OBJECTS -------------------------
	const actionConfigObject = [
		{
			actionName: 'View',
			actionIconName: 'visibility'
		}
	];
	const actionConfigObjectCard = [
		{
			actionName: 'Details'
		}
	];
	let cardHeaderDisplay = {
		title: {
			key: 'name',
			name: $format('Name')
		},
		nonTitleData: [
			{
				key: 'state',
				name: $format('State')
			},
			{
				key: 'courseCount',
				name: $format('PlannedCourses')
			}
		]
	};
	let tableHeaderDisplay = [
		{
			key: 'name',
			name: $format('Name')
		},
		{
			key: 'state',
			name: $format('State')
		},
		{
			key: 'courseCount',
			name: $format('PlannedCourses')
		}
	];
	// Setting headers reactively on language change
	$: setHeaders($format);

	function setHeaders() {
		tableHeaderDisplay = [
			{
				key: 'name',
				name: $format('Name')
			},
			{
				key: 'state',
				name: $format('State')
			},
			{
				key: 'courseCount',
				name: $format('PlannedCourses')
			}
		];
		cardHeaderDisplay = {
			title: {
				key: 'name',
				name: $format('Name')
			},
			nonTitleData: [
				{
					key: 'state',
					name: $format('State')
				},
				{
					key: 'courseCount',
					name: $format('PlannedCourses')
				}
			]
		};
	}
	function handleTableAction(event) {
		const actionName = event.detail.actionName;
		const actionData = event.detail.actionData;
		if (
			actionName == actionConfigObject[0].actionName ||
			actionName == actionConfigObjectCard[0].actionName
		) {
			goto(`/trainingCenters/details/${actionData.uuid}`);
		}
	}

	// ------------------------------------- Sorting Functions--------------------------
	$: setSortActions($_);
	function setSortActions() {
		sortActionItems = [
			{ id: 1, name: Course_Sorting_Order.TITLE_A_TO_Z, displayName: $_('Title ( A to Z )') },
			{ id: 2, name: Course_Sorting_Order.TITLE_Z_TO_A, displayName: $_('TitleZtoA') },
			{
				id: 3,
				name: Course_Sorting_Order.PLANNED_COURSES_LOW_TO_HIGH,
				displayName: $_('PlannedCoursesLowToHigh')
			},
			{
				id: 4,
				name: Course_Sorting_Order.PLANNED_COURSES_HIGH_TO_LOW,
				displayName: $_('PlannedCoursesHighToLow')
			}
		];
	}

	function handleSort(e) {
		selectedSortOption = e.detail.name;
		selectedSortOptionDisplayName = e.detail.displayName;
	}

	onMount(() => {
		selectedSortOptionDisplayName = sortActionItems[0]?.displayName;
	});
</script>

<div class=" mx-4 mb-8 mt-0 lg:mx-[92px] lg:mb-9 lg:mt-0">
	<AboutRseti {params} {route} />
	<Filters
		on:handleFilters={handleFilter}
		bind:courseFilterValue
		bind:stateFilterValue
		courseFilterOptionList={courseData}
		stateFilterOptionList={stateData}
	/>

	<div class="mt-8 mb-4 flex flex-col w-full">
		<SearchBar
			on:handleSearchValue={sendSearchValueToDatatable}
			placeholder={$format('SearchByRSETIName')}
			searchButton={false}
			bind:searchBoxValue={searchValue}
		/>
		{#if selectedSortOption}
			<p class="text-sm mt-2 sm:hidden">
				{$_('SortedBy')}: {selectedSortOptionDisplayName}
			</p>
		{/if}
	</div>
	<div class="flex justify-self-end sm:hidden">
		<InlinePicker
			pickerTitle={$_('SortBy')}
			bind:selectedItem={selectedSortOption}
			on:pickerSelection={handleSort}
			optionList={sortActionItems}
			addClass={'justify-self-end mb-2'}
			defaultSortItem={sortActionItems[0]?.name}
		/>
	</div>

	<ListingTable
		tableData={filterdTableData}
		{actionConfigObject}
		{actionConfigObjectCard}
		{cardHeaderDisplay}
		{tableHeaderDisplay}
		{searchValue}
		{loading}
		defaultSortItem={sortActionItems[0]?.name}
		{selectedSortOption}
		searchParameter="name"
		notFoundMessage={$format('NoTCFound')}
		on:tableActionClick={handleTableAction}
	/>
</div>
