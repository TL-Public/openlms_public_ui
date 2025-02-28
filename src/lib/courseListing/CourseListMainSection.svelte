<script>
	import { format } from 'svelte-i18n';
	import { Course_Sorting_Order } from '/src/config/constants.js';
	import { onMount, tick } from 'svelte';
	import { Sorting_Orders } from '../../config/constants';
	import { categoryList } from '$lib/data.js'
	import SearchBar from '$lib/Components/SearchBar.svelte';
	import { _ } from 'svelte-i18n';
	import Sidebar from '$lib/faq/Sidebar.svelte';
	import CoursesGrid from '$lib/courseListing/CoursesGrid.svelte';
	import SingleAccordionElementMobileView from '$lib/courseListing/SingleAccordionElementMobileView.svelte';
	import SingleAccordionElementSkeleton from '$lib/courseListing/SingleAccordionElementSkeleton.svelte';
	import SidebarSkeleton from '$lib/faq/SidebarSkeleton.svelte';
	import HorizontalScroll from '../landingPageCourses/horizontalScroll.svelte';
	import SelectInput from '$lib/Components/SelectInput.svelte';
	import InlinePicker from '$lib/Components/InlinePicker.svelte';
	import { page } from '$app/stores';

	// category from query params
	export let category;
	export let coursesCopy = [];

	let lang = $page?.data?.lang ?? 'en';
	let searchValue = '';
	let expandedItem = null;
	let error = null;
	let loading = false;
	let coursesSideBarList = [];
	let dummyAccordion = new Array(4);
	let sortActionItems = [];
	let selectedSortOption = '';
	let selectedSortOptionDisplayName = '';

	$: sideBarCategory = category ? category : '';
	$: expandedItem = category ? category : null;
	$: filteredCourses = coursesCopy ? coursesCopy : [];

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
			}
		];
	}

	onMount(async () => {
		selectedSortOptionDisplayName = sortActionItems[0]?.displayName;
		expandedItem = category;

		const categorySet = new Set();
		const localizedCategoryList = categoryList[lang];
		coursesCopy?.forEach((course) => {
			if (!categorySet?.has(course?.category)) {
				categorySet?.add(course?.category);
				const categoryName = localizedCategoryList[course.category];
				let sideBarDetails = {
					id: course?.category,

					name: categoryName ? categoryName + ' ' + $_('Programme') : 'Unknown course category'
					// category: course?.category
				};
				coursesSideBarList?.push(sideBarDetails);
			}
		});
		// Sort the list based on `id`
		coursesSideBarList = coursesSideBarList?.sort((a, b) => {
			if (a.id < b.id) return -1; // Ascending order
			if (a.id > b.id) return 1;
			return 0;
		});
		coursesSideBarList = coursesSideBarList;
	});

	function handleSearch(e) {
		searchValue = e.detail;
	}

	let handleSidebarClick = function (e) {
		sideBarCategory = e.detail?.id ? e.detail.id : null;
	};

	let handleSidebarClearFilter = function (e) {
		sideBarCategory = '';
	};
	function handleAccordionClick(e) {
		let accordionItem = e.detail;
		expandedItem = expandedItem === accordionItem.id ? null : accordionItem.id;
	}

	$: handleFilterCourses(expandedItem);
	// for cards view in horizontal scroll component
	let filteredCardsData = [];
	function handleFilterCourses(expandedItem) {
		// filter the based on the active tab category in the tab data.
		if (expandedItem) {
			filteredCardsData = coursesCopy?.filter((course) => course?.category == expandedItem);
		}
	}

	function handleSort(e) {
		selectedSortOption = e.detail.name;
		selectedSortOptionDisplayName = e.detail.displayName;
	}
</script>

<!-- Mobile View Code -->
<div class="block mx-4 mb-8 md:mx-0 lg:mx-0 xl:m-4 xl:hidden">
	<div class="mb-2 flex gap-4 items-start">
		<div class="flex-grow">
			<SearchBar
				on:handleSearchValue={handleSearch}
				searchButton={false}
				placeholder={$format('SearchByTitle')}
				bind:searchBoxValue={searchValue}
			/>
			{#if selectedSortOption && searchValue}
				<p class="text-xs mb-2 mt-2">
					{$_('SortedBy')}: {selectedSortOptionDisplayName}
				</p>
			{/if}
		</div>
		{#if searchValue}
			<div>
				<InlinePicker
					pickerTitle={$_('SortBy')}
					bind:selectedItem={selectedSortOption}
					on:pickerSelection={handleSort}
					optionList={sortActionItems}
					addClass={'justify-self-end'}
					defaultSortItem={sortActionItems[0]?.name}
				/>
			</div>
		{/if}
	</div>

	{#if !searchValue}
		{#each coursesSideBarList as sideBarItem, index (index)}
			<SingleAccordionElementMobileView
				{sideBarItem}
				{sideBarCategory}
				expanded={expandedItem == sideBarItem?.id}
				{index}
				{loading}
				on:handleAccordionClick={handleAccordionClick}
			>
				<p class="mt-2 text-sm leading-7 text-darkgray font-normal px-2 pb-4" id="innerAccordion">
					<!-- scroll amount only applies when scroll arrows are visible (desktop view) hence no need to pass scrollClientWidth and scrollCardWidth -->
					<HorizontalScroll cardsData={filteredCardsData} />
				</p>
			</SingleAccordionElementMobileView>
		{:else}
			{#each dummyAccordion as accordion}
				<SingleAccordionElementSkeleton />
			{/each}
		{/each}
	{:else}
		<CoursesGrid
			sideBarCategory=""
			{searchValue}
			{coursesCopy}
			{filteredCourses}
			{error}
			{loading}
			{selectedSortOption}
			defaultSortItem={sortActionItems[0]?.name}
		/>
	{/if}
</div>
<!-- Desktop View Code -->
<div class="hidden xl:block xl:mx-[92px] xl:mb-16">
	<div class="flex gap-2">
		<div
			class="w-1/4 h-fit max-w-[250px] text-sm shadow-lg p-4 lg:p-0 xl:p-4 rounded-md border-none bg-blue-10"
		>
			{#if !loading}
				<Sidebar
					bgColor={'bg-secondary'}
					hoverColor={'bg-blue-10'}
					on:handleSideBarCategory={handleSidebarClick}
					on:handleDispatchClearFilter={handleSidebarClearFilter}
					sideBarList={coursesSideBarList}
					{category}
				/>
			{:else}
				<SidebarSkeleton />
			{/if}
		</div>
		<div class="w-3/4 px-2">
			<div class=" mb-2 grid sm:grid-cols-2 grid-cols-[1fr auto] place-items-start">
				<div class="flex flex-col w-full">
					<SearchBar
						on:handleSearchValue={handleSearch}
						placeholder={$format('SearchByTitle')}
						searchButton={false}
						bind:searchBoxValue={searchValue}
					/>
					{#if selectedSortOption}
						<p class="text-sm mb-2 mt-2">
							{$_('SortedBy')}: {selectedSortOptionDisplayName}
						</p>
					{/if}
				</div>

				<InlinePicker
					pickerTitle={$_('SortBy')}
					bind:selectedItem={selectedSortOption}
					on:pickerSelection={handleSort}
					optionList={sortActionItems}
					addClass={'justify-self-end'}
					defaultSortItem={sortActionItems[0]?.name}
				/>
			</div>

			<CoursesGrid
				{sideBarCategory}
				{searchValue}
				{coursesCopy}
				{filteredCourses}
				{error}
				{loading}
				{selectedSortOption}
				defaultSortItem={sortActionItems[0]?.name}
			/>
		</div>
	</div>
</div>
