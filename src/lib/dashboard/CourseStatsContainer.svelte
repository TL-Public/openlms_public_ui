<script>
	import { tick } from 'svelte';
	import { format } from 'svelte-i18n';
	import { String_Constants } from '/src/config/constants.js';
	import Top10CoursesCard from '$lib/dashboard/Top10CoursesCard.svelte';
	import MapAndTableWrapper from '$lib/dashboard/MapAndTableWrapper.svelte';
	import Top10VideosCardcopy from '$lib/dashboard/Top10VideosCardcopy.svelte';
	import InsightsContainer from '$lib/dashboard/InsightsContainer.svelte';
	import { formatNumberWithCommas } from '$lib/utils/helper.js';

	export let historicalData;

	const { coursesByState, overallStats } = historicalData;

	let stateIDCourses = '';
	let stateNameCourses = '';

	const containerIdCourses = 'coursesMap';

	let insightStats = [
		{
			statName: $format('TotalCoursesCount'),
			statValue: formatNumberWithCommas(overallStats.totalTrainingCenterCourses)
		},
		{
			statName: $format('AvgCoursePerState'),
			statValue: formatNumberWithCommas(
				overallStats.totalTrainingCenterCourses / overallStats.totalStates
			)
		},
		{
			statName: $format('AvgCoursePerRSETI'),
			statValue: formatNumberWithCommas(
				overallStats.totalTrainingCenterCourses / overallStats.totalTrainingCenters
			)
		},
		{
			statName: $format('AvgRSETIPerState'),
			statValue: formatNumberWithCommas(overallStats.avgRSETIPerState)
		}
	];

	let tableHeaderDisplayCourses = [
		{
			key: 'rank',
			name: $format('Rank')
		},
		{
			key: 'state',
			name: $format('State'),
			width: '50%'
		},
		{
			key: 'coursesCount',
			name: $format('CoursesCount'),
			width: '30%'
		}
	];

	let error = null;
	$: if (coursesByState?.status !== 200) {
		error = coursesByState.error || 'Failed to fetch data';
	} else if (coursesByState?.data?.length === 0) {
		error = 'No data found';
	} else {
		error = null;
	}

	let tableDataCourses = [];
	if (coursesByState.data?.length > 0) {
		coursesByState.data.sort((a, b) => b.value - a.value);
		coursesByState.data?.forEach((data, index) => {
			let mapDataObj = {
				rank: index + 1,
				id: data?.id,
				coursesCount: data?.value,
				state: data?.name
			};
			tableDataCourses?.push(mapDataObj);
			tableDataCourses = tableDataCourses;
		});
	}
</script>

<InsightsContainer {insightStats} />

<div class=" mt-4 p-4 bg-white my-4 rounded">
	<MapAndTableWrapper
		stateID={stateIDCourses}
		stateName={stateNameCourses}
		data={coursesByState.data}
		tableData={tableDataCourses}
		containerId={containerIdCourses}
		heatMapStartingColorGradient={0xc7d2fe}
		heatMapEndingColorGradient={0x312e81}
		tableHeaderDisplay={tableHeaderDisplayCourses}
		mapHeader={$format('CourseDistribution')+ ' (2023)'}
		tableHeading={$format('StateRanking')}
		placeholderForSearch={$format('SearchByState')}
	/>
</div>

<!-- <div class="mb-6">
	<div class="">
		<Top10CoursesCard />
	</div>
</div> -->

<!-- <div class="">
	<div class="">
		<Top10VideosCardcopy />
	</div>
</div> -->
