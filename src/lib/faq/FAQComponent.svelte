<script>
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import SingleFaqComponent from '$lib/faq/SingleFaqComponent.svelte';
	import Sidebar from '$lib/faq/Sidebar.svelte';
	import BreadCrumbs from '$lib/breadCrumbs/BreadCrumbs.svelte';
	import CommonLayoutPattern from '../Components/CommonLayoutPattern.svelte';
	import LineDrawing from '$lib/landingPage/LineDrawing.svelte';
	import SingleFaqComponentSkeleton from '$lib/faq/SingleFaqComponentSkeleton.svelte';
	import ErrorMessage from '$lib/courses/ErrorMessage.svelte';
	import SingleAccordionElementMobileView from '$lib/courseListing/SingleAccordionElementMobileView.svelte';
	import SingleAccordionElementSkeleton from '$lib/courseListing/SingleAccordionElementSkeleton.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import SidebarSkeleton from '$lib/faq/SidebarSkeleton.svelte';

	export let route;
	export let FAQ = [];
	export let faqSideBarList = [];
	export let faqError = false;
	export let categoryError = false;

	let DummyDataFaq = new Array(5);
	let FAQData = FAQ;
	let bgColor = 'bg-white';
	let error = null;
	let expandedItem = null;
	// set default to 0th category
	let sideBarCategory = faqSideBarList[0]?.id ?? null;

	$: sideBarcategorySelecion(sideBarCategory);
	function sideBarcategorySelecion() {
		if (sideBarCategory) {
			FAQData = FAQ?.filter((data) => Number(data?.categoryId) === Number(sideBarCategory));
		}
	}

	let handleSidebarClick = function (e) {
		FAQData = FAQ;
		sideBarCategory = e.detail?.id ? e.detail.id : null;
	};

	let handleSidebarClearFilter = function (e) {
		sideBarCategory = null;
		FAQData = FAQ;
	};

	function handleAccordionClick(e) {
		sideBarCategory = e.detail?.id ? Number(e.detail.id) : '';
		expandedItem = Number(expandedItem) === sideBarCategory ? null : sideBarCategory;
	}

	function findFAQData(category) {
		return FAQ.filter((data) => Number(data.categoryId) === Number(category));
	}
</script>

<div class="hidden lg:block">
	<div class=" flex min-h-screen items-start gap-2 lg:mx-[92px]">
		{#if !faqError && !categoryError}
			<div
				class="w-1/5 border-r-2 border-r-gray-10 px-4 2xl:px-2 py-4 bg-blue-10 rounded-lg sticky top-16"
			>
				<!-- category prop is used to set the default to 0th category -->
				<Sidebar
					{bgColor}
					on:handleSideBarCategory={handleSidebarClick}
					on:handleDispatchClearFilter={handleSidebarClearFilter}
					sideBarList={faqSideBarList}
					category={faqSideBarList[0]?.id ?? null}
				/>
			</div>
		{/if}

		<div
			class="overflow-hidden w-4/5 flex flex-col justify-between"
			class:w-full={faqError || categoryError}
		>
			<div>
				<div class=" bg-blue-10 px-12 mx-auto rounded-lg pt-2 pb-8 tranform">
					<div class="px-0 py-2">
						<BreadCrumbs {route} />
					</div>
					<h2 class="text-3xl font-bold text-primary mb-3">{$_('FrequentlyAskedQuestions')}</h2>
					{#if !faqError}
						<div>
							{#each FAQData as singleFAQObj (singleFAQObj?.uuid)}
								<SingleFaqComponent {singleFAQObj} {sideBarCategory} />
							{/each}
						</div>
					{:else}
						<ErrorComponent  errorMessage={$_('NoDataFound')}/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<div class="block lg:hidden">
	<div class=" bg-blue-10 px-4 pt-4 pb-8 rounded-lg tranform -translate-y-[65.5px] mx-4 mb-4 mt-16">
		<div class="px-0 pb-4 pt-0">
			<BreadCrumbs {route} />
		</div>
		<h2 class="text-base sm:text-2xl font-bold text-primary">{$_('FrequentlyAskedQuestions')}</h2>
	</div>

	<div class="tranform -translate-y-[65.5px] mx-4 mb-8">
		{#if !faqError && !categoryError}
			{#each faqSideBarList as sideBarItem, index (index)}
				<SingleAccordionElementMobileView
					{sideBarItem}
					border={'border-none'}
					fontWeight={'font-medium'}
					expanded={expandedItem === sideBarItem?.id}
					on:handleAccordionClick={handleAccordionClick}
				>
					<div
						class="text-sm leading-7 text-darkgray font-normal px-2 pb-4 mt-2 bg-blue-10 rounded-lg"
						id="innerAccordion"
					>
						{#each findFAQData(sideBarItem?.id) as singleFAQObj (singleFAQObj?.uuid)}
							<SingleFaqComponent {singleFAQObj} />
						{/each}
					</div>
				</SingleAccordionElementMobileView>
			{:else}
			{#each DummyDataFaq as faq}
					<SingleAccordionElementSkeleton border={true} />
				{/each}
			{/each}
		{:else}
			<ErrorComponent errorMessage={$_('NoDataFound')} />
		{/if}
	</div>
</div>
