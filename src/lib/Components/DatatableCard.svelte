<script>
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import { Course_Sorting_Order } from '/src/config/constants.js';

	export let notFoundMessage = 'Not found';
	export let datatableCardConfig = {
		icon: {
			iconSrc: '/learningCentersIcon.svg',
			iconAlt: 'learning center icon',
			isImage: false
		}
	};
	export let searchValue = '';
	export let entriesPerPage = 5;
	export let actionConfigObject = [];
	export let cardHeaderDisplay;
	export let selectedSortOption = '';
	export let defaultSortItem = '';
	export let cardsData = [];

	let cardsDataRender = [];
	let currentPage = 1;
	const dispatch = createEventDispatcher();

	// Error if cardHeaderDisplay is missing
	if (!cardHeaderDisplay) {
		throw new Error("Missing necessary property 'cardHeaderDisplay' in <DatatableCard/> component");
	}

	// Function to handle sorting
	function handleSorting(data, sortOption) {
		let sortedData = Array.from(data);
		switch (sortOption) {
			case Course_Sorting_Order.CHAPTERCNT_LOW_TO_HIGH:
				sortedData.sort((a, b) => a.numberOfChapters - b.numberOfChapters);
				break;
			case Course_Sorting_Order.CHAPTERCNT_HIGH_TO_LOW:
				sortedData.sort((a, b) => b.numberOfChapters - a.numberOfChapters);
				break;
			case Course_Sorting_Order.DURATION_LOW_TO_HIGH:
				sortedData.sort((a, b) => a.duration - b.duration);
				break;
			case Course_Sorting_Order.DURATION_HIGH_TO_LOW:
				sortedData.sort((a, b) => b.duration - a.duration);
				break;
			case Course_Sorting_Order.TITLE_A_TO_Z:
				sortedData.sort(
					(a, b) => a?.title?.localeCompare(b?.title) || a?.name?.localeCompare(b.name)
				);
				break;
			case Course_Sorting_Order.TITLE_Z_TO_A:
				sortedData.sort(
					(a, b) => b?.title?.localeCompare(a.title) || b?.name?.localeCompare(a.name)
				);
				break;
			case Course_Sorting_Order.PLANNED_DATE_LOW_TO_HIGH:
				sortedData.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
				break;
			case Course_Sorting_Order.PLANNED_DATE_HIGH_TO_LOW:
				sortedData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
				break;
			case Course_Sorting_Order.PLANNED_COURSES_LOW_TO_HIGH:
				sortedData.sort((a, b) => a.courseCount - b.courseCount);
				break;
			case Course_Sorting_Order.PLANNED_COURSES_HIGH_TO_LOW:
				sortedData.sort((a, b) => b.courseCount - a.courseCount);
				break;
			default:
				break;
		}
		return sortedData;
	}

	// Function to handle filtering
	function handleSearch(data, searchValue) {
		const sanitizedSearchValue = searchValue.toLowerCase().trim();
		return data.filter((item) => {
			const title = item[cardHeaderDisplay.title?.key]?.toLowerCase();
			const matchTitle = title?.includes(sanitizedSearchValue);
			// const matchNonTitle = cardHeaderDisplay.nonTitleData.some((field) => {
			// 	const value = item[field.key]?.toString().toLowerCase();
			// 	return value?.includes(sanitizedSearchValue);
			// });
			// return matchTitle || matchNonTitle;
			return matchTitle;
		});
	}

	// Reactive updates for cardsDataRender
	$: {
		let filteredData = cardsData;
		if (searchValue) {
			filteredData = handleSearch(cardsData, searchValue);
		}
		if (selectedSortOption) {
			filteredData = handleSorting(filteredData, selectedSortOption);
		}
		cardsDataRender = filteredData;
		currentPage = 1; // Reset to the first page when search or sort changes
	}

	// Pagination calculations
	function calculateNumberOfPages(totalEntries, entriesPerPage) {
		return Math.ceil(totalEntries / entriesPerPage);
	}

	function getCurrentPageData(page, entriesPerPage, totalEntries, data) {
		const start = (page - 1) * entriesPerPage;
		const end = start + entriesPerPage;
		return data.slice(start, end);
	}

	$: numberOfPages = calculateNumberOfPages(cardsDataRender.length, entriesPerPage);
	$: currentPageData = getCurrentPageData(
		currentPage,
		entriesPerPage,
		cardsDataRender.length,
		cardsDataRender
	);

	// Page navigation
	function handlePageIncrement() {
		if (currentPage < numberOfPages) currentPage++;
	}

	function handlePageDecrement() {
		if (currentPage > 1) currentPage--;
	}

	// Handle default sort
	$: {
		if (defaultSortItem && selectedSortOption === '') {
			selectedSortOption = defaultSortItem;
		}
	}
</script>

{#if currentPageData?.length > 0}
	<!-- Card Rendering -->
	{#each currentPageData as data, index (index)}
		<button
			class="text-left"
			on:click={() =>
				dispatch('cardActionClick', {
					actionName: actionConfigObject[0]?.actionName,
					actionData: data
				})}
		>
			<div class="pr-4 bg-white rounded-md">
				<div class="flex gap-3">
					{#if datatableCardConfig.icon.isImage}
						<!-- Render image taking the full height of the card -->
						<div class="flex items-center">
							<img
								class="h-full w-24 rounded-l-md object-cover"
								src={data?.imageUrl}
								alt={'image of a course'}
							/>
						</div>
					{:else}
						<!-- Render icon inside a circle -->
						<div class="bg-blue-10 p-3 flex justify-center items-center rounded-l-md">
							<div class="p-2 bg-white rounded-full">
								<img
									class="w-5 h-5 bg-white rounded-full font-semibold text-accent"
									src={datatableCardConfig.icon.iconSrc}
									alt={datatableCardConfig.icon.iconAlt}
								/>
							</div>
						</div>
					{/if}

					<div class="py-2 flex flex-col gap-2 relative flex-1">
						<h2 class="text-sm font-semibold text-darkGray line-clamp-2">
							{data[cardHeaderDisplay.title?.key] ?? ''}
						</h2>
						{#each cardHeaderDisplay?.nonTitleData ?? [] as key, index (index)}
							<p class="text-xs text-darkGray {key.highlight ? 'font-bold' : 'font-medium'}">
								{key.name}:
								<span>{data[key.key] ?? '-'} </span>
							</p>
						{/each}
					</div>
				</div>
			</div>
		</button>
	{/each}

	<!-- Pagination Controls -->
	<div class="flex justify-between items-center">
		<button
			class="px-2 border flex border-primary rounded-md"
			on:click={handlePageDecrement}
			disabled={currentPage === 1}
		>
			<span class="material-icons-outlined">west</span>
		</button>
		<div>
			<p class="text-sm text-gray-700">
				<span class="font-medium">{(currentPage - 1) * entriesPerPage + 1}</span>
				-
				<span class="font-medium"
					>{Math.min(currentPage * entriesPerPage, cardsDataRender.length)}</span
				>
				of
				<span class="font-medium">{cardsDataRender.length}</span>
				items
			</p>
		</div>
		<button
			class="px-2 border flex border-primary rounded-md"
			on:click={handlePageIncrement}
			disabled={currentPage === numberOfPages}
		>
			<span class="material-icons-outlined">east</span>
		</button>
	</div>
{:else}
	<ErrorComponent errorMessage={notFoundMessage} />
{/if}
