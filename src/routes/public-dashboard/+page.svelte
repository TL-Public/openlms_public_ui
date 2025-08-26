<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { format } from 'svelte-i18n';
	import AboutDashboard from '$lib/dashboard/AboutDashboard.svelte';
	import Tabs from '$lib/courses/Tabs.svelte';
	import TraineeStatsContainer from '$lib/dashboard/TraineeStatsContainer.svelte';
	import CourseStatsContainer from '$lib/dashboard/CourseStatsContainer.svelte';
	import Assessment from '$lib/dashboard/Assessment.svelte';
	import { setAuthStatus } from '$lib/utils/helper';

	// Importing params and route for bread crumbs
	export let data;

	const {
		statesStats,
		stateWiseTraineeOnboard,
		traineeOnBoardTotal,
		rsetiTraineeOnBoardData,
		overallStats,
		traineesByCourse,
		courseList,
		traineeStatsByCourseCategory,
		coursesByState,
		traineesByState,
		stateData,
		rsetiList,
		lang,
		unauthorized
	} = data;

	let route = $page.route.id;
	let params = $page.params;

	let tabs = [
		{
			text: 'Course Stats',
			component: CourseStatsContainer,
			clicked: false,
			textDisplay: $format('CourseStats'),
			historicalData: { coursesByState, overallStats },
			lang: lang,
			icon: '/coursesIcon.svg'
		},
		{
			text: 'Trainee Stats',
			component: TraineeStatsContainer,
			clicked: false,
			textDisplay: $format('Trainee Stats'),
			historicalData: {
				traineesByCourse,
				courseList,
				statesStatsData: statesStats,
				traineeStatsByCourseCategory,
				traineesByState,
				statesData: stateData,
				overallStats,
				stateWiseTraineeOnboard,
				traineeOnBoardTotal,
				rsetiTraineeOnBoardData,
				rsetiList
			},
			lang: lang,
			icon: '/traineesEnrolledIcon.svg'
		},
		// {
		// 	text: 'Assessment',
		// 	component: Assessment,
		// 	clicked: false,
		// 	textDisplay: $format('Assessment'),
		// 	lang: lang,
		// 	icon: '/assessment.svg'
		// }
	];

	$: setTabsData($format);

	function setTabsData() {
		tabs = [
			{
				text: 'Course Stats',
				component: CourseStatsContainer,
				clicked: false,
				textDisplay: $format('CourseStats'),
				historicalData: { coursesByState, overallStats },
				icon: '/coursesIcon.svg'
			},
			{
				text: 'Trainee Stats',
				component: TraineeStatsContainer,
				clicked: false,
				textDisplay: $format('TraineeStats'),
				historicalData: {
					traineesByCourse,
					courseList,
					statesStatsData: statesStats,
					traineeStatsByCourseCategory,
					traineesByState,
					statesData: stateData,
					overallStats,
					stateWiseTraineeOnboard,
					traineeOnBoardTotal,
					rsetiTraineeOnBoardData,
					rsetiList
				},
				icon: '/traineesEnrolledIcon.svg'
			},
			// {
			// 	text: 'Assessment',
			// 	component: Assessment,
			// 	clicked: false,
			// 	textDisplay: $format('Assessment'),
			// 	// historicalData: ,
			// 	icon: '/assessment.svg'
			// }
		];
	}
	let componentToRender = tabs[1];

	// Tab to remain selected on page load
	let activeTabText = tabs[1]?.text;
	let historicalData = tabs[1]?.historicalData;

	function handleActiveTab(e) {
		activeTabText = e.detail;
		let [matchedObj] = activeTabText
			? tabs?.filter((tab) =>
					tab?.text?.toLowerCase().trim().includes(activeTabText?.toLowerCase().trim())
				)
			: [componentToRender];
		componentToRender = matchedObj;
		historicalData = matchedObj?.historicalData;
	}

	onMount(() => {
		setAuthStatus(unauthorized);
	});
</script>

<div class="lg:mx-[92px] mx-4 my-8 mt-0 lg:mb-9 lg:mt-0">
	<div class="">
		<AboutDashboard {params} {route} />
	</div>

	<div class="mb-4 sm:mb-6">
		<Tabs bind:tabs on:handleActiveTab={handleActiveTab} {activeTabText} />
	</div>
	<div class="">
		<svelte:component this={componentToRender.component} {historicalData} {lang} />
	</div>
</div>
