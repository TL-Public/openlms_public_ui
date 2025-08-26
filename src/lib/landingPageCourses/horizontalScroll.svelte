<script>
	// import  CourseCard  from '$lib/landingPageCourses/CourseCard.svelte';
	import CourseCard from '$lib/courseListing/CourseCard.svelte';
	import VideoPod from '$lib/VideoPod.svelte';
	import { tick } from 'svelte';
	export let cardsData = [];
	// by default the scroll amount is calculated based on the width of the container
	export let scrollClientWidth = true;
	// if the scroll amount is to be calculated based on the width of the cards
	export let scrollCardWidth = false;
	export let scrollWidthMultiplier = 1;
	export let componentType = 'courses';
	export let componentWidth = 255; //255 is the width we maintain for course card
	export let showProgressIcons = false;
	let scrollAmount = 400;

	// DOM reference to the scroll area
	let scrollContainer;

	// keep a track of the scroll  of the element
	let scrollPostion = 0;

	// calculate the total amount the container can be scrolled
	// used for hiding the navigation buttons
	let maxScrollAmount = 1000;
	let scrollWidth = 0;
	// the cardsData prop is passed so that the scoll amount is changed when the datas is refreshed by filter
	$: calculateScrollAmount(scrollContainer);
	$: handleCardsDataChange(cardsData);

	async function handleCardsDataChange() {
		await tick();
		scrollPostion = 0;
		if (scrollContainer) {
			// console.log("Loggin scroll", scrollContainer.scrollLeft)
			scrollContainer.scrollLeft = scrollPostion;
		}
		calculateScrollAmount(scrollContainer);
	}
	// takes the total scrollable width of the container and divides it by the number of cards in it
	// to get the tatal amount of scroll for each
	async function calculateScrollAmount(scrollContainer) {
		// check for scroll container reference
		// let the dom updation finish before running
		await tick();
		if (cardsData?.length === 0 || scrollContainer == undefined) return;

		if (scrollContainer) {
			// if both are true then scroll amount is the width of the container times the scroll width multiplier
			if (scrollClientWidth) {
				// scroll amount is the width of the container times the scroll width multiplier
				scrollAmount = scrollContainer.clientWidth * scrollWidthMultiplier;
			} else if (scrollCardWidth) {
				// divide total scroll length by number of card to get scroll amount for a single card
				scrollAmount = (scrollContainer.scrollWidth / cardsData.length) * scrollWidthMultiplier;
			}
			// if both are false then scroll amount is the width of the container times the scroll width multiplier
			else {
				scrollAmount = scrollContainer.clientWidth * scrollWidthMultiplier;
			}
			// check the amount we can scroll and set to 1000 if inaccesable for some reason
			// This calculates the amound of hidden scroll that is there by subtrating the total container width
			// (which includes the scrollable area ) and subtracts the client width from it.
			// -1 is there due to decimal calculation errors
			maxScrollAmount = scrollContainer.scrollWidth - scrollContainer.clientWidth;
			if (maxScrollAmount != 0) {
				maxScrollAmount = maxScrollAmount - 1;
			}
		}
	}

	function handleScroll(scrollAmount) {
		// calculate the new scroll postion
		const newScrollPostion = scrollContainer.scrollLeft + scrollAmount;
		scrollPostion = newScrollPostion;
		// check if the scrollContainer contains the DOM reference to the scroll area
		if (scrollContainer) {
			// console.log("Loggin scroll", scrollContainer.scrollLeft)
			scrollContainer.scrollLeft = scrollPostion;
		}
	}
</script>

<div class=" relative">
	<div class="relative mx-auto max-w-7xl">
		<div
			class="flex overflow-x-auto relative scroll-smooth customized-scrollbar snap-inline gap-2 sm:gap-4 pb-3"
			bind:this={scrollContainer}
		>
			{#each cardsData as cardData (cardData.uuid)}
				<div class="flex-shrink-0" style="width: {componentWidth}px;">
					{#if componentType === 'courses'}
						<CourseCard course={cardData} />
					{:else if componentType === 'videos'}
						<VideoPod video={cardData} courseUuid={cardData?.courseDetails?.courseUuid} courseDetails={cardData?.courseDetails} selectedLanguage={cardData?.languageCode} textSize={'sm'} {showProgressIcons}/>
					{/if}
				</div>
			{/each}
		</div>
		{#if scrollPostion > 0}
			<button
				class="sm:p-4 p-3 rounded-full text-2xl bg-gray-600 absolute top-1/2 -translate-x-8 -translate-y-1/2 sm:flex items-center shadow hidden"
				on:click={() => handleScroll(-scrollAmount)}
				><span class="material-icons-outlined text-center text-white">arrow_back_ios</span>
			</button>
		{/if}
		{#if scrollPostion < maxScrollAmount}
			<button
				class="sm:p-4 p-3 rounded-full text-2xl bg-gray-600 absolute top-1/2 translate-x-8 -translate-y-1/2 right-0 sm:flex items-center shadow hidden"
				on:click={() => handleScroll(scrollAmount)}
				><span class="material-icons-outlined text-center text-white">arrow_forward_ios</span>
			</button>
		{/if}
	</div>
</div>

<style>
</style>
