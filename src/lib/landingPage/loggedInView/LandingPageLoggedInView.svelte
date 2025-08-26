<script>
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import PersonalDetailsContent from '$lib/traineeProfile/PersonalDetailsContent.svelte';
	import TabsComponent from '$lib/courses/Tabs.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import TraineeProfileCard from '$lib/landingPage/loggedInView/TraineeProfileCard.svelte';
	import EnrolledCoursesCard from '$lib/landingPage/loggedInView/EnrolledCoursesCard.svelte';
	import RecommendedCourses from '$lib/landingPage/loggedInView/RecommendedCourses.svelte';
	import Button from '$lib/Components/Button.svelte';

	export let traineeDetailsData = {};
	export let cardsData = [];
	export let traineeCourses = [];
	export let centersData = [];
	export let lang = 'en'


	let traineeStats = {
		numberOfVideosCompleted: 0,
		totalWatchTime: 0
	};

	const tabs = [
		{ text: 'My Courses', textDisplay: $_('My Courses'), icon: '' },
		{ text: 'Profile', textDisplay: $_('Profile'), icon: '' }
	];

	let activeTabText = 'My Courses';
	$: recommendedCourses = findCategories(traineeCourses, cardsData);

	function handleTabChange(event) {
		activeTabText = event.detail.text;
	}

	function findCategories() {
		if (!traineeCourses || !cardsData || cardsData?.error || traineeCourses?.error) return;

		// Step 1: Get unique enrolled categories
		const enrolledCategories = new Set(traineeCourses.map((c) => c.category));

		// Step 2: Create a hashmap for category → courses
		const categoryMap = new Map();

		// Track how many enrolled categories have reached 5
		let filled = 0;
		let numberOfRecommenededCoursesDisplayed = 5

		for (const card of cardsData) {
			if (!enrolledCategories.has(card.category)) continue;

			if (!categoryMap.has(card.category)) {
				categoryMap.set(card.category, []);
			}

			const list = categoryMap.get(card.category);

			if (list.length < numberOfRecommenededCoursesDisplayed) {
				list.push(card);

				// Check if this category just got filled
				if (list.length === numberOfRecommenededCoursesDisplayed) {
					filled++;
					// If all enrolled categories are full, stop
					if (filled === enrolledCategories.size) {
						break;
					}
				}
			}
		}

		// Step 3: Track enrolled UUIDs for quick lookup
		const enrolledUUIDs = new Set(traineeCourses.map((c) => c.uuid));

		// Step 4: Collect up to  numberOfRecommenededCoursesDisplayed
		let recommendedCourses = [];

		// Gather all recommended courses from the category map
		const allRecommendedCourses = Array.from(categoryMap.values()).flat();

		// Filter out already enrolled and take only numberOfRecommenededCoursesDisplayed
		recommendedCourses = allRecommendedCourses
			.filter((course) => !enrolledUUIDs.has(course.uuid))
			.slice(0, numberOfRecommenededCoursesDisplayed);

		return recommendedCourses;
	}

	async function addRsetiDetailsToCourses() {
		if (
			!traineeCourses ||
			!traineeDetailsData?.traineeRsetis ||
			!centersData ||
			centersData?.error ||
			traineeCourses?.error
		)
			return [];

		try {
			const rsetiList = centersData;

			return traineeCourses.map((course) => {
				// Find the corresponding traineeRseti
				const traineeRseti = traineeDetailsData?.traineeRsetis?.find(
					(r) => r.courseUuid === course.uuid
				);

				// Find the RSETI name from the fetched list
				const rseti = rsetiList?.find((r) => r.uuid === traineeRseti?.rsetiUuid) || [];
				let rsetiName = rseti?.translations?.find((t) => t.languageCode === lang)?.name;

				return {
					...course,
					rsetiName,
					enrolledOn: traineeRseti?.enrolledOn || null
				};
			});
		} catch (err) {
			console.error('Error fetching or processing RSETI data', err);
		}
	}

	function handleUpdateStats(e) {
		traineeStats.totalWatchTime =
			Number(traineeStats.totalWatchTime) + Number(e.detail.watchedDuration);
		traineeStats.numberOfVideosCompleted =
			Number(traineeStats.numberOfVideosCompleted) + Number(e.detail.completedCount);
	}

	function handleGoToCourses() {
		goto('/courses');
	}

	onMount(async () => {
		const enrichedCourses = await addRsetiDetailsToCourses();
		if (enrichedCourses) {
			traineeCourses = enrichedCourses;
		}
	});
</script>

<div class="lg:mx-[92px] mx-4  tranform -translate-y-[65.5px] mt-0 lg:mb-9 lg:mt-0">
	{#if !traineeDetailsData?.error}
		<div
			class="px-4 pt-4 pb-4 sm:px-9 sm:py-12 sm:pt-6 mb-8 rounded-lg text-darkGray bg-blue-20 lg:min-h-40 max-w-6xl mx-auto"
		>
			<TraineeProfileCard {traineeDetailsData} {traineeStats} />
		</div>

		<div class="max-w-6xl mx-auto">
			<!-- Tabs Component -->
			<div class="mt-6">
				<TabsComponent {tabs} bind:activeTabText on:tabChange={handleTabChange} />
			</div>

			<!-- Tab Content -->
			<div class=" overflow-hidden mt-6">
				{#if activeTabText === 'Profile'}
					<div
						class="bg-white px-4 pt-4 pb-4 sm:px-9 sm:py-12 sm:pt-6 mb-8 rounded-lg text-darkGray"
					>
						<PersonalDetailsContent {traineeDetailsData} />
					</div>
				{:else if activeTabText === 'My Courses'}
					{#if traineeCourses?.length > 0}
						{#each traineeCourses as course}
							<div class="mb-4">
								<EnrolledCoursesCard {course} {cardsData} {lang} on:stats={handleUpdateStats} />
							</div>
						{/each}
					{:else}
						<div class="bg-white p-4 rounded-lg text-center mb-4">
							<ErrorComponent errorMessage={$_('No data found')} />
						</div>
					{/if}
				{/if}
			</div>

			{#if recommendedCourses && activeTabText === 'My Courses'}
				{#if recommendedCourses?.length > 0}
					<div>
						<h3 class="text-sm font-medium mb-2 text-primary">{$_('Recommended Courses')}</h3>
						<RecommendedCourses recommendedCourses={recommendedCourses} />
						<div class="mt-3 flex justify-center">
							<button
								class="px-6 py-2 shadow-sm rounded-[4px] font-medium capitalize sm:text-sm text-xs text-nowrap text-center flex items-center justify-center gap-1 disabled:bg-gray-90 disabled:cursor-not-allowed hover:bg-opacity-90 text-white {$page?.data?.openLMS ? 'bg-primary mt-4 lg:mt-0 mb-16' : 'bg-accent'}"
								on:click={handleGoToCourses}>{$_('View all courses')}</button
							>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	{:else}
		<div class="bg-white p-4 rounded-lg text-center">
			<ErrorComponent errorMessage={$_('No data found')} />
		</div>
	{/if}
</div>
