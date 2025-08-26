<!-- //------------ Datatable Component Usage---------------------------
	// The datatable component handles searching, sorting and pagination
	// tableHeaderDisplay property is a necessary property
	// To customize the header names user can pass the tableHeaderDisplay property in the following format
	// {key: name_of_header_in_data, name: custom_header_name}
	// The data need not be trimmed before passing as only fields that are specidied in the tableHeaderDisplay will be rendered
	// Sorting takes into account the type of data hence string data and integer data are sorted seperately
	// SortAccordingTo state can also be taken as a prop and bindied so that the sorting state is preserved when we reload the datatable

	//------------- WARNING! -----------------------
	// If a numerical data comming in string format, example "1" instead of 1, the user (of this component) will need to first parse them
	// into integer format and then pass the data to the datatable component if they want correct sorting behaviour

	// passed mapping of custom header name and its key
	// [{key: name_of_header_in_data, name: custom_header_name}]
	// The key property can be strinf or an array of string/number if the data is nested
	// eample {data1: { data2: ["data3"]}} for this the key object would be
	// [{key: ['data1', 'data2', 0], name: "custom_header_name"}] -->

<script>
	import { error } from '@sveltejs/kit';
	import { createEventDispatcher } from 'svelte';
	import Select from '$lib/Components/Select.svelte';
	import GoogleMatrialIcon from '$lib/Components/GoogleMatrialIcon.svelte';

	export let showPagination = true;
	export let sorting = true;
	export let size = 'large';
	export let dataToHighlight = '';
	export let tableHeadersDisplay = [
		{
			key: 'dummy name',
			value: 'dummy value'
		}
	];

	// This is the action config object to define how the action tab of the datatable should look
	// actionName: it is the name of the action that will be passed to the screen reader
	// actionIconName: Google Material Icon name which should be displayed for the action
	export let actionConfigObject = [
		{
			actionName: 'dummy action',
			actionIconName: ''
		}
	];
	// main data for the table
	export let tableData = [
		{
			name: 'dummyname',
			email: 'dummyemail',
			phone: 'dummyphone'
		}
	];
	export let entriesPerPage = 10;
	export let searchValue = '';

	let tableDataRender = [];
	let currentPage = 1;

	// -------Extracting Headers for table from the keys of the first element in the array---------------
	let tableHeaders = Object.keys(tableData[0]);

	// When an action is clicked in the action tab an event is dispatched to the parent component
	// the event contains the name of the action that was clicked and the data associated with that row
	const dispatch = createEventDispatcher();
	function handleActionDispatch(actionName, actionData, viewModal) {
		tableDataRender = tableDataRender.map((data) => ({ ...data, highlighted: false }));
		dataToHighlight = actionData.id;
		dispatch('tableActionClick', { actionName, actionData, viewModal });
	}

	// throw an error if its missing
	if (!tableHeadersDisplay) {
		error(404, {
			message: "Missing necessary property 'tableHeaderDisplay' in datatable component"
		});
	}

	// ------------- Search Function -------------
	function updateTableDataRender(searchValue) {
		tableDataRender = tableData?.filter((object) => {
			let isSearched = false;
			const sanitizedSearchValue = searchValue?.toLowerCase().trim();

			for (let i = 0; i < tableHeadersDisplay?.length; i++) {
				// extract value that is present in the data table
				const value = parseDataFromKey(object, tableHeadersDisplay[i]?.key);

				// check if value has those characters
				if (typeof value == 'string') {
					if (value?.toLocaleLowerCase().includes(sanitizedSearchValue)) {
						isSearched = true;
					}
				}
				// check if the value for that key is string
				if (typeof value == 'number') {
					if (value?.toString().includes(sanitizedSearchValue)) {
						isSearched = true;
					}
				}
			}
			if (isSearched) {
				return object;
			}
		});

		currentPage = 1;
	}

	// updates the content of the table each time the search value changes
	// NOTE: We also pass the tableData so that the rendered table gets updated when filters are applied
	$: updateTableDataRender(searchValue, tableData);

	// ---------------Sorting ------------------
	// the sortAccordingTo object is taken as a prop so as to preserve sorting when table data is null
	export let sortAccordingTo = {
		header: null,
		entityType: null,
		sortingOrder: null
	};

	function handleCreateSortAccordingToObject(header) {
		// determine sorting order
		// We have 3 states for ordering
		// Default is the API response order other two are ascending and descending
		let sortingOrder = '';

		// this block check if we are sorting the same element that we previously sorted
		if (sortAccordingTo?.header === header) {
			// this block cycles through the sorting orders
			if (sortAccordingTo?.sortingOrder === null) {
				sortingOrder = 'ascending';
			} else if (sortAccordingTo?.sortingOrder === 'ascending') {
				sortingOrder = 'descending';
			} else if (sortAccordingTo?.sortingOrder == 'descending') {
				sortingOrder = null;
			} else {
				sortingOrder = null;
			}
		} else {
			sortingOrder = 'ascending';
		}
		sortAccordingTo = {
			header: header,
			entityType: typeof tableData[0][header],
			sortingOrder: sortingOrder
		};
	}

	function handleSorting(sortAccordingTo) {
		// if sorting order is null revert back to the defaut order of element
		if (sortAccordingTo?.sortingOrder === null) {
			updateTableDataRender(searchValue);
		}

		if (sortAccordingTo?.entityType === 'string' && sortAccordingTo?.sortingOrder == 'ascending') {
			tableDataRender = tableDataRender?.sort((a, b) => {
				const entityA = a[sortAccordingTo.header]?.toUpperCase().trim(); // ignore upper and lowercase
				const entityB = b[sortAccordingTo.header]?.toUpperCase().trim(); // ignore upper and lowercase
				if (entityA < entityB) {
					return -1;
				}
				if (entityA > entityB) {
					return 1;
				}

				// names must be equal
				return 0;
			});
		} else if (
			sortAccordingTo?.entityType === 'string' &&
			sortAccordingTo?.sortingOrder == 'descending'
		) {
			tableDataRender = tableDataRender?.sort((a, b) => {
				const entityA = a[sortAccordingTo.header]?.toUpperCase().trim(); // ignore upper and lowercase
				const entityB = b[sortAccordingTo.header]?.toUpperCase().trim(); // ignore upper and lowercase
				if (entityA < entityB) {
					return 1;
				}
				if (entityA > entityB) {
					return -1;
				}

				// names must be equal
				return 0;
			});
		}

		if (sortAccordingTo?.entityType === 'number' && sortAccordingTo?.sortingOrder == 'ascending') {
			tableDataRender = tableDataRender?.sort(
				(a, b) => a[sortAccordingTo?.header] - b[sortAccordingTo?.header]
			);
		} else if (
			sortAccordingTo?.entityType === 'number' &&
			sortAccordingTo?.sortingOrder == 'descending'
		) {
			tableDataRender = tableDataRender?.sort(
				(a, b) => b[sortAccordingTo?.header] - a[sortAccordingTo?.header]
			);
		}
	}
	// NOTE: We also pass the tableData so that the rendered table gets resorted when filters are applied
	$: handleSorting(sortAccordingTo, tableData);

	// ------------------PAGINATION--------------------

	$: currentPageData = getCurrentPageData(
		currentPage,
		entriesPerPage,
		numberOfEntries,
		tableDataRender,
		dataToHighlight
	);

	$: startingEntryIndex = currentPage * entriesPerPage - entriesPerPage;
	$: endingEntryIndex = currentPage * entriesPerPage;
	$: numberOfEntries = tableDataRender?.length;
	$: numberOfPages = calculateNumberOfPages(numberOfEntries, entriesPerPage);

	$: pageinationDisplayArray = updatepageinationDisplayArray(numberOfPages);
	function calculateNumberOfPages(numberOfEntries, entriesPerPage) {
		if (numberOfEntries % entriesPerPage === 0) {
			const numberOfPages = numberOfEntries / entriesPerPage;
			return numberOfPages;
		}
		const numberOfPages = Math.floor(numberOfEntries / entriesPerPage);
		return numberOfPages + 1;
	}

	function getCurrentPageData(currentPage, entriesPerPage, numberOfEntries, tableDataRender) {
		const startingEntryIndex = currentPage * entriesPerPage - entriesPerPage;
		const endingEntryIndex = currentPage * entriesPerPage;

		if (dataToHighlight) {
			tableDataRender = highlightData();
		}

		if (endingEntryIndex > numberOfEntries) {
			return tableDataRender?.length ? tableDataRender?.slice(startingEntryIndex) : [];
		}

		return tableDataRender?.length
			? tableDataRender?.slice(startingEntryIndex, endingEntryIndex)
			: [];
	}

	function pageingationBarDisplayPages(currentPage, numberOfPages, sizeOfBar) {
		let change = numberOfPages - currentPage > sizeOfBar;
	}

	function updatepageinationDisplayArray(numberOfPages) {
		let pageinationDisplayArray = [];
		for (let i = 0; i < numberOfPages; i++) {
			pageinationDisplayArray?.push({ displayText: `Page ${i + 1}`, index: i + 1 });
		}
		return pageinationDisplayArray;
	}

	function handlePageIncrement(numberOfPages) {
		if (currentPage < numberOfPages) {
			currentPage = currentPage + 1;
		}
	}

	function handlePageDecrement() {
		if (currentPage > 1) {
			currentPage = currentPage - 1;
		}
	}

	// This function parses the value of from the data using the key
	// This function allows to extract data from nested objects
	function parseDataFromKey(data, key) {
		if (typeof key === 'string') {
			return data[key];
		}
		if (typeof key === 'object') {
			const lenght = key.length;
			let temp_data = data;
			for (let i = 0; i < lenght; i++) {
				temp_data = temp_data[key[i]];
			}

			return temp_data;
		}
		return 'hello';
	}

	// Function to highlight a particular item
	$: highlightData(dataToHighlight);
	function highlightData() {
		let index = tableDataRender?.findIndex(
			(data) => dataToHighlight?.toLowerCase() === data?.id?.toLowerCase()
		);

		if (index != -1) {
			tableDataRender = tableDataRender?.map((data, i) => {
				if (i === index) {
					return { ...data, highlighted: true };
				} else {
					return { ...data, highlighted: false };
				}
			});
			tableDataRender = tableDataRender;
		}
		return tableDataRender;
	}

	//Function to programattically navigate to a particular page
	$: navigateToPage(dataToHighlight, entriesPerPage, numberOfEntries);
	function navigateToPage() {
		let pageNumber = calculateNumberOfPages(numberOfEntries, entriesPerPage);
		if (pageNumber <= 1) return;
		let index = tableDataRender?.findIndex(
			(data) => dataToHighlight?.toLowerCase() === data?.id?.toLowerCase()
		);
		if (index != -1) {
			let itemNumber = index + 1;
			let currentPageNumber = Math.ceil(itemNumber / entriesPerPage);
			currentPageData = getCurrentPageData(
				currentPageNumber,
				entriesPerPage,
				numberOfEntries,
				tableDataRender
			);
			currentPage = currentPageNumber;
			startingEntryIndex = currentPage * entriesPerPage - entriesPerPage;
			endingEntryIndex = currentPage * entriesPerPage;
		}
	}
</script>

<div class="flow-root mx-2 sm:mx-4 lg:mx-0">
	<div class=" overflow-x-auto">
		<div class="inline-block min-w-full align-middle">
			<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
				<table class="min-w-full divide-y divide-gray-300">
					<thead class="bg-primary">
						<tr>
							{#if tableHeadersDisplay}
								{#each tableHeadersDisplay as header}
									<th
										scope="col"
										class="px-4 py-1 sm:py-3.5 text-left text-sm font-semibold text-white capitalize"
										class:sm:py-2={size == 'short'}
										>{header?.name}
										<button
											on:click={() => {
												handleCreateSortAccordingToObject(header?.key);
											}}
											class="p-1">^</button
										>
									</th>
								{/each}
							{:else}
								{#each tableHeaders as header}
									<th
										scope="col"
										class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 capitalize"
										>{header}
										<button
											on:click={() => {
												handleCreateSortAccordingToObject(header);
											}}
											class="p-1">^</button
										>
									</th>
								{/each}
							{/if}

							<th scope="col" class="px-4 py-3.5 text-left text-sm font-semibold text-darkGray">
								<span class="sr-only">Action</span>
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#if currentPageData}
							{#each currentPageData as data}
								<tr
									style="background-color: {data?.highlighted ? '#fb923c' : 'transparent'}"
									class:py-1={size == 'short'}
								>
									{#each tableHeadersDisplay as header}
										<td
											class="whitespace-nowrap pl-4 pr-3 text-sm font-base text-darkGray sm:pl-4 capitalize"
											class:py-0={size == 'short'}
											class:py-4={size == 'large'}
										>
											{parseDataFromKey(data, header?.key)??'-'} 
										</td>
									{/each}
									<td class="relative whitespace-nowrap py-4 px-4 text-sm font-medium sm:pr-4">
										<div class="flex gap-4 justify-center">
											{#each actionConfigObject as action}
												<button
													on:click={() =>
														handleActionDispatch(action?.actionName, data, action?.modal)}
													class="text-accent hover:text-indigo-900"
													><div class="flex gap-0.5 items-start">
														{#if action?.goto}
															<a
																href={action?.goto +
																	`?data=` +
																	encodeURIComponent(JSON.stringify(data))}
																><GoogleMatrialIcon iconName={action.actionIconName} /></a
															>
														{:else}
                                                        <GoogleMatrialIcon iconName={action.actionIconName} />
														{/if}
													</div>
													<span class="sr-only">{action?.actionName}</span></button
												>
											{/each}
										</div>
									</td>
								</tr>
							{/each}
						{/if}

						<!-- More... -->
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
{#if showPagination === true}
	<div class="flex items-center justify-between mt-4 px-4 py-3 sm:px-6">
		<div class="flex flex-1 justify-between sm:hidden">
			<button
				on:click={() => handlePageDecrement()}
				class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>Previous</button
			>
			<button
				on:click={() => handlePageIncrement(numberOfPages)}
				class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				>Next</button
			>
		</div>
		<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
			<div>
				<p class="text-sm text-gray-700">
					<span class="font-medium">{startingEntryIndex + 1}</span>
					-
					<span class="font-medium">{endingEntryIndex}</span>
					of
					<span class="font-medium">{numberOfEntries}</span>
					items
				</p>
			</div>
			<div>
				<nav class="isolate inline-flex -space-x-px rounded-md" aria-label="Pagination">
					<button
						on:click={() => handlePageDecrement()}
						class="relative inline-flex items-center rounded-l-md px-6 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 min-w-24 justify-center gap-2"
					>
						<span class="sr-only">Previous</span>

						<svg
							class="h-5 w-5 fill-darkGray"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
								clip-rule="evenodd"
							/>
						</svg>
						<h1 class="text-sm flex items-center text-darkGray">Previous</h1>
					</button>
					<Select
						options={pageinationDisplayArray}
						display_func={(e) => e.displayText}
						value_func={(e) => e.index}
						bind:value={currentPage}
					/>
					<button
						on:click={() => handlePageIncrement(numberOfPages)}
						class="relative inline-flex items-center rounded-r-md px-6 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 min-w-24 justify-center gap-2"
					>
						<span class="sr-only">Next</span>
						<h1 class="text-sm flex items-center text-darkGray">Next</h1>
						<svg
							class="h-5 w-5 fill-darkGray"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</nav>
			</div>
		</div>
	</div>
{/if}
