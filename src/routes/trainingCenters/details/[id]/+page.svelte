<script>
	import { page } from '$app/stores';
	import AboutRSETI from '$lib/TrainingCenterDetails/AboutRSETI.svelte';
	import SearchBar from '$lib/Components/SearchBar.svelte';
	import { goto } from '$app/navigation';
	import { format } from 'svelte-i18n';
	import DatatableCard from '$lib/Components/DatatableCard.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import CoursesGrid from '$lib/courseListing/CoursesGrid.svelte';
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import InlinePicker from '$lib/Components/InlinePicker.svelte';
	import { formatDateMMMYYYY } from '$lib/utils/helper.js';
	import { Course_Sorting_Order } from '/src/config/constants.js';

	 export let data

	const datatableCardConfig = {
		icon: {
			// iconSrc: '/coursesIcon.svg',
			iconAlt: 'courses icon',
			isImage: true
		}
	};

	let tableData = (() => {
	const originalCoursesData = data?.centerCoursesData ?? [];

	const courseMap = new Map();

	for (const entry of originalCoursesData) {
		const formattedStartDate = formatDateMMMYYYY(new Date(entry.startYear, entry.startMonth - 1));
		const duration = entry?.duration ?? 0;
		const formattedDuration = `${duration} ${duration === 1 ? 'day' : 'days'}`;
		const chapters = entry?.numberOfChapters ?? 0;

		if (!courseMap.has(entry.uuid)) {
			courseMap.set(entry.uuid, {
				...entry,
				formattedStartDate: new Set([formattedStartDate]),
				formattedDuration,
				duration,
				chapters
			});
		} else {
			courseMap.get(entry.uuid).formattedStartDate.add(formattedStartDate);
		}
	}

	return Array.from(courseMap.values()).map((entry) => ({
		...entry,
		formattedStartDate: Array.from(entry.formattedStartDate).join(', ')
	}));
})();

	let centerData = data.centerData;
	const rsetiStats = data.rsetiStats;
	let selectedSortOption = '';
	let selectedSortOptionDisplayName = '';
	let sortActionItems = [];

	// Importing params and route for bread crumbs
	let route = $page.route.id;
	let params = $page.params;
	// for handeling the search value passed from the SearchBar component
	let searchValue = '';

	function handleSearch(e) {
		searchValue = e.detail;
	}

	// ------------------------ TABLE CONFIGURATION OBJECTS -------------------------

	const actionConfigObjectCard = [
		{
			actionName: 'Details'
		}
	];

	let cardHeaderDisplay = {
		title: {
			key: 'title',
			name: $format('Name')
		},
		nonTitleData: [
			{
				key: 'formattedStartDate',
				name: $format('Sessions planned'),
				sortKey: 'startDate'
			},
			{
				key: 'formattedDuration',
				name: $format('Duration'),
				sortKey: 'duration'
			},
			{
				key: 'chapters',
				name: $format('ChaptersCount')
			}
		]
	};

	const actionConfigObject = [
		{
			actionName: 'View',
			actionIconName: 'visibility'
		}
	];

	// Setting headers reactively on language change
	$: setHeaders($format);

	function setHeaders() {
		cardHeaderDisplay = {
			title: {
				key: 'title',
				name: $format('Name')
			},
			nonTitleData: [
				{
					key: 'formattedStartDate',
					name: $format('Sessions planned'),
					sortKey: 'startDate'
				},
				{
					key: 'formattedDuration',
					name: $format('Duration'),
					sortKey: 'duration'
				},
				{
					key: 'chapters',
					name: $format('ChaptersCount')
				}
			]
		};
	}

	function handleTableAction(event) {
		// handle table action here
		const actionName = event.detail.actionName;
		const actionData = event.detail.actionData;
		if (
			actionName == actionConfigObject[0].actionName ||
			actionName == actionConfigObjectCard[0].actionName
		) {
			goto(`/courses/details/${actionData.uuid}`);
		}
	}

	// ------------------------------ Sort for Courses ---------------------------
	$: setSortActions($_);
	function setSortActions() {
		sortActionItems = [
			{ id: 1, name: Course_Sorting_Order.TITLE_A_TO_Z, displayName: $_('Title ( A to Z )') },
			{ id: 2, name: Course_Sorting_Order.TITLE_Z_TO_A, displayName: $_('TitleZtoA') },
			{
				id: 3,
				name: Course_Sorting_Order.DURATION_LOW_TO_HIGH,
				displayName: $_('DurationLowtoHigh')
			},
			{
				id: 4,
				name: Course_Sorting_Order.DURATION_HIGH_TO_LOW,
				displayName: $_('DurationHighToLow')
			},
			{
				id: 5,
				name: Course_Sorting_Order.CHAPTERCNT_LOW_TO_HIGH,
				displayName: $_('ChapterCountLowToHigh')
			},
			{
				id: 6,
				name: Course_Sorting_Order.CHAPTERCNT_HIGH_TO_LOW,
				displayName: $_('ChapterCountHighToLow')
			},
			// {
			// 	id: 7,
			// 	name: Course_Sorting_Order.PLANNED_DATE_LOW_TO_HIGH,
			// 	displayName: $_('PlannedDateLowToHigh')
			// },
			// {
			// 	id: 8,
			// 	name: Course_Sorting_Order.PLANNED_DATE_HIGH_TO_LOW,
			// 	displayName: $_('PlannedDateHighToLow')
			// }
		];
	}

	function handleSort(e) {
		selectedSortOption = e.detail.name;
		selectedSortOptionDisplayName = e.detail.displayName;
	}

	onMount(() => {
		selectedSortOptionDisplayName = sortActionItems[0]?.displayName;
	});

	// Helper to format date as needed (e.g., 'MMM YYYY')
	function formatSessionDate(year, month) {
		return formatDateMMMYYYY(new Date(year, month - 1));
	}

	// Group sessions by courseUuid, but only keep unique course info for each courseUuid
	const groupedCourses = {};
	
	if (Array.isArray(data.centerCoursesData)) {
		for (const session of data.centerCoursesData) {
			const key = session.uuid;
			const sessionDate = new Date(session.startYear, session.startMonth - 1);

			if (!groupedCourses[key]) {
				// Only use the first session's info for the course, but do not overwrite arrays
				groupedCourses[key] = {
					...session,
					plannedDates: [],
					plannedDateObjs: [] // keep raw date objects for sorting
				};
			}

			const formattedDate = formatSessionDate(session.startYear, session.startMonth);
			groupedCourses[key].plannedDates.push(formattedDate);
			groupedCourses[key].plannedDateObjs.push({ year: session.startYear, month: session.startMonth, formatted: formattedDate });
		}

		// Sort plannedDates for each course from first to last
		for (const key in groupedCourses) {
			groupedCourses[key].plannedDateObjs.sort((a, b) => {
				if (a.year !== b.year) return a.year - b.year;
				return a.month - b.month;
			});
			groupedCourses[key].plannedDates = groupedCourses[key].plannedDateObjs.map(obj => obj.formatted);
			delete groupedCourses[key].plannedDateObjs;
		}
	}

	// Convert to array for CoursesGrid
	const transformedCourses = Object.values(groupedCourses);

</script>

{#if data }
<div class=" mx-4 mb-8 mt-0 lg:mx-[92px] lg:mb-9 lg:mt-0">
	<AboutRSETI {params} {route} {centerData} {rsetiStats} totalCourses={tableData.length} stateData={data?.stateData} />

	<h1 class="text-base text-primary mt-6 mb-4">
		<span class="font-bold">{$_('Courses')}</span> ({tableData.length ?? '-'})
	</h1>

	<div class=" mb-2 grid grid-cols-[1fr auto] place-items-start">
		<div class=" w-full">
			<SearchBar
				on:handleSearchValue={handleSearch}
				placeholder={$format('SearchByCourseTitle')}
				searchButton={false}
				bind:searchBoxValue={searchValue}
			/>
			{#if selectedSortOption}
				<p class="text-sm mt-2">
					{$_('SortedBy')}: {selectedSortOptionDisplayName}
				</p>
			{/if}
		</div>

		<InlinePicker
			pickerTitle={$_('SortBy')}
			bind:selectedItem={selectedSortOption}
			on:pickerSelection={handleSort}
			optionList={sortActionItems}
			addClass={'justify-self-end mb-2 '}
			defaultSortItem={sortActionItems[0]?.name}
		/>
	</div>

	<div class="hidden sm:block">
		<div class="w-full px-2">
			{#if tableData?.length !== 0}
				<CoursesGrid
					{searchValue}
					coursesCopy={transformedCourses}
					loading={false}
					defaultSortItem={sortActionItems[0]?.name}
					{selectedSortOption}
					showPlannedDate={true}
				/>
			{:else if tableData?.length === 0}
				<ErrorComponent errorMessage={'Courses not found'} />
			{/if}
		</div>
	</div>

	<div class="sm:hidden flex flex-col gap-4">
		{#if tableData?.length !== 0}
			<DatatableCard
				on:cardActionClick={handleTableAction}
				cardsData={tableData}
				{searchValue}
				{cardHeaderDisplay}
				actionConfigObject={actionConfigObjectCard}
				{datatableCardConfig}
				defaultSortItem={sortActionItems[0]?.name}
				{selectedSortOption}
				notFoundMessage="Course Not Found"
			/>
		{:else if tableData?.length === 0}
			<ErrorComponent errorMessage={'Courses not found'} />
		{/if}
	</div>
</div>
{:else}
<div class="mx-4 mb-8 mt-0 lg:mx-[92px] lg:mb-9 lg:mt-0 bg-blue-10 rounded-lg">
<ErrorComponent errorMessage={$_('FailureMessageForTCDetailsPage')}/>
</div>
{/if}
