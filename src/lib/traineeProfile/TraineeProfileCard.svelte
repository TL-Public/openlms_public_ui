<script>
	import { _ } from 'svelte-i18n';
	import BreadCrumbs from '$lib/breadCrumbs/BreadCrumbs.svelte';
	import ProfileHeader from './ProfileHeader.svelte';
	import StatsCards from './StatsCards.svelte';
	import PersonalDetailsContent from './PersonalDetailsContent.svelte';
	import CoursesContent from './CourseContent.svelte';
	import ProgressContent from './ProgressContent.svelte';
	import TabsComponent from '$lib/courses/Tabs.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';


	export let params;
	export let route;

	export let traineeDetailsData = {};
	export let courseDetails = {};
  
	let totalProgress = 0;

	const tabs = [
		{ text: 'personal', textDisplay: $_('PersonalDetails'), icon: '' },
		{ text: 'courses', textDisplay: $_('EnrolledCourses'), icon: '' },
		{ text: 'progress', textDisplay: $_('ProgressTracking'), icon: '' }
	];

	let activeTabText = 'personal';

	function handleTabChange(event) {
		activeTabText = event.detail.text;
	}

	// Mock Data
	function getProgressPercentage(courseUuid) {
		const progressMap = {
			'96cb217e-252d-4b45-bbac-73add5867b40': 65,
			'9465eea1-bb6b-4766-85cf-6c318b803065': 30
		};
		return progressMap[courseUuid] || 0;
	}

	$: {
		const courses = traineeDetailsData?.traineeRsetis ?? [];
		const numberOfCourses = courses?.length;

		if (numberOfCourses > 0) {
			const totalCourseProgress = courses?.reduce(
				(acc, course) => acc + getProgressPercentage(course?.courseUuid),
				0
			);
			totalProgress = Math.round(totalCourseProgress / numberOfCourses);
		} else {
			totalProgress = 0;
		}
	}

	$: activeCourses = (traineeDetailsData?.traineeRsetis ?? []).filter((c) => c.status === 1)?.length;
</script>

<div
	class="px-4 pt-4 pb-4 sm:px-9 sm:py-12 sm:pt-6 mb-8 rounded-lg text-darkGray bg-blue-20 lg:min-h-40"
>
	<p class="text-darkGray text-xs pb-4 lg:pb-6"><BreadCrumbs {route} {params} /></p>

	<div class="flex flex-col sm:w-3/4 gap-3">
		<h1 class="text-primary font-bold text-base lg:text-2xl mb-2">
			{$_('MyProfile')}
		</h1>
		<p class="text-xs sm:text-sm text-darkGray leading-loose sm:leading-relaxed">
			{$_('ProfileIntro')}
		</p>
	</div>
</div>

{#if !traineeDetailsData?.error}
<div class="max-w-6xl mx-auto">
	<!-- Profile Header -->
	<ProfileHeader {traineeDetailsData} />

	<!-- Stats Cards -->
	<StatsCards
		enrolledCourses={traineeDetailsData?.traineeRsetis?.length || 0}
		{activeCourses}
		{totalProgress}
	/>

	<!-- Tabs Component -->
	<div class="mt-6">
		<TabsComponent {tabs} bind:activeTabText on:tabChange={handleTabChange} />
	</div>

	<!-- Tab Content -->
	<div class="bg-white rounded-xl shadow-md overflow-hidden mt-6 p-6">
		{#if activeTabText === 'personal'}
			<PersonalDetailsContent {traineeDetailsData} />
		{:else if activeTabText === 'courses'}
			<CoursesContent
				traineeRsetis={traineeDetailsData.traineeRsetis}
				{courseDetails}
				{getProgressPercentage}
			/>
		{:else if activeTabText === 'progress'}
			<ProgressContent />
		{/if}
	</div>
</div>
{:else}
	<div class="bg-white p-4 rounded-lg text-center">
		<ErrorComponent errorMessage={$_('No data found')} />
	</div>
{/if}
