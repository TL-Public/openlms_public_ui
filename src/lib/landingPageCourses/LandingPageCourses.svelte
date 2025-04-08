<script>
	// import SingleAccordionElementMobileView from './SingleAccordionElementMobileView.svelte';
	import SingleAccordionElementMobileView from '$lib/courseListing/SingleAccordionElementMobileView.svelte';

	import ReapPartialLogoMobile from '$lib/svgComponents/ReapPartialLogoMobile.svelte';
	import ReapPartialLogo from '$lib/svgComponents/ReapPartialLogo.svelte';
	import Tabs from '$lib/landingPageCourses/Tabs.svelte';
	import HorizontalScroll from './horizontalScroll.svelte';
	import { categoryList } from '$lib/data.js';
	import { _ } from 'svelte-i18n';
	import { page } from '$app/stores';
	// gets the all the data of courses from the parent
	export let cardsData = [];

	// A list of filterd data accoding to the selected fitler tab
	let filteredCardsData = cardsData;
	let lang = $page?.data?.lang ?? 'en';

	let expandedItem = null;

	function makeTabs() {
		let tabsList = [];
		const categorySet = new Set();
		// check to prevent UI break if cards data is missing
		if (cardsData?.length === 0) return [];
		const localizedCategoryList = categoryList[lang];
		cardsData?.forEach((course) => {
			if (!categorySet.has(course?.category)) {
				categorySet.add(course.category);
				const categoryName = localizedCategoryList[course.category];
				let tabDetails = {
					id: course?.category,
					name: categoryName ? categoryName + ' ' + $_('Programme') : 'Unknown course category',
					category: course?.category
				};
				tabsList.push(tabDetails);
				// Sort the list based on `id`
				tabsList = tabsList?.sort((a, b) => {
					if (a.id < b.id) return -1; // Ascending order
					if (a.id > b.id) return 1;
					return 0;
				});
				tabsList = tabsList;
			}
		});
		return tabsList;
	}

	let tabs = makeTabs();
	// variable to keep track of active tab
	let activeTab = tabs?.[0]?.category ?? '';
	// function to update active tab when a new tab is clicked
	function handleActiveTab(event) {
		const tabContent = event.detail;
		activeTab = tabContent.category;
		expandedItem = expandedItem === activeTab ? null : activeTab;
	}

	// update the courses data whenever the active tab changes
	$: handleFilterCourses(activeTab);

	// filter function which runs when tabs change
	function handleFilterCourses(activeTab) {
		// check to prevent UI break if cards data is missing
		if (cardsData?.length === 0) return;
		// filter the based on the active tab category in the tab data.
		if (activeTab) {
			filteredCardsData = cardsData?.filter((course) => course?.category === activeTab);
		}
	}
</script>

<div class=" relative px-4 pb-16 sm:pb-24 sm:px-6 lg:px-12 lg:py-24 py-12" id="course-area">
	<div class="relative mx-auto max-w-7xl">
		<div class=" font-bold text-primary mb-4 sm:mb-8 flex items-center gap-2">
			<!-- <div class="hidden sm:block"><ReapPartialLogo fillBody="#fff" /></div>
			<div class="block sm:hidden"><ReapPartialLogoMobile fillBody="#fff" /></div> -->
			<h2
				class="text-base sm:text-2xl md:text-3xl leading-tight sm:leading-tight md:leading-tight uppercase-headers"
			>
				{$_('ExploreAndGetStarted')}
			</h2>
		</div>
		<div class="relative mx-auto max-w-7xl mb-4 hidden sm:block">
			<Tabs {tabs} on:handleActiveTab={handleActiveTab} />
		</div>
	</div>
	<!-- Desktop view -->
	<div class="hidden sm:block">
		<HorizontalScroll
			cardsData={filteredCardsData}
			scrollClientWidth={true}
			scrollCardWidth={false}
			scrollWidthMultiplier={1}
		/>
	</div>
	<!-- mobile view -->
	<div class="sm:hidden flex flex-col gap-4">
		{#each tabs as tab, index (index)}
			<SingleAccordionElementMobileView
				sideBarItem={tab}
				expanded={expandedItem === tab.category}
				{index}
				on:handleAccordionClick={handleActiveTab}
			>
				<div class="py-4">
					<!-- scroll amount only applies when scroll arrows are visible (desktop view) hence no need to pass scrollClientWidth and scrollCardWidth -->
					<HorizontalScroll cardsData={filteredCardsData} />
				</div>
			</SingleAccordionElementMobileView>
		{/each}
	</div>

	<div class="flex justify-center pt-8">
		<a
			href="/courses"
			class="px-8 py-3 font-semibold text-white text-base bg-secondary rounded-[4px]"
			>{$_('ViewAllCourses')}</a
		>
	</div>
</div>
