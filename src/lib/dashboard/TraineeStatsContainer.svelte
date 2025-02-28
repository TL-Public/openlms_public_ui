<script>
	import { tick } from 'svelte';
	import { String_Constants } from '/src/config/constants.js';
	import Top10CoursesCard from '$lib/dashboard/Top10CoursesCard.svelte';
	import MapAndTableWrapper from '$lib/dashboard/MapAndTableWrapper.svelte';
	import Top10VideosCardcopy from '$lib/dashboard/Top10VideosCardcopy.svelte';
	import RegisteredTraineeChart from '$lib/dashboard/RegisteredTraineeChart.svelte';
	import TraineeOnboardChartCourseWise from '$lib/dashboard/TraineeOnboardChartCourseWise.svelte';
	import UnregisteredTraineeChart from './UnregisteredTraineeChart.svelte';
	import InsightsContainer from '$lib/dashboard/InsightsContainer.svelte';
	import CategoryComparisionCard from '$lib/dashboard/CategoryComparisionCard.svelte';
	import { formatNumberWithCommas } from '$lib/utils/helper.js';
	import { format } from 'svelte-i18n';
	import TraineeOnboardChartStateWise from '$lib/dashboard/TraineeOnboardChartStateWise.svelte';
	import TraineeOnBoard10yearStateWise from '$lib/dashboard/TraineeOnBoard10yearStateWise.svelte';
	import TraineeOnBoard10yearRsetiWise from '$lib/dashboard/TraineeOnBoard10yearRsetiWise.svelte';
	import Histogram from '$lib/Components/Histogram.svelte';
	import TrainedSettledComparison from '$lib/dashboard/TrainedSettledComparison.svelte';

	export let historicalData;
	export let lang;

	const {
		statesStatsData,
		stateWiseTraineeOnboard,
		traineeOnBoardTotal,
		rsetiTraineeOnBoardData,
		overallStats,
		traineesByCourse,
		courseList,
		traineeStatsByCourseCategory,
		traineesByState,
		statesData,
		rsetiList
	} = historicalData;

	let stateIDTrainee = '';
	let stateNameTrainee = '';

	let insightStats = [
		{
			statName: $format('TotalTraineeCount'),
			statValue: formatNumberWithCommas(overallStats.totalTrainees)
		},
		{
			statName: $format('AvgTraineePerState'),
			statValue: formatNumberWithCommas(overallStats.avgTraineePerState)
		},
		{
			statName: $format('AvgTraineePerRSETI'),
			statValue: formatNumberWithCommas(overallStats.avgTraineePerRSETI)
		},
		{
			statName: $format('AvgRSETIPerState'),
			statValue: formatNumberWithCommas(overallStats.avgRSETIPerState)
		}
	];

	const containerIdTrainee = 'traineeMap';

	let tableHeaderDisplayTrainee = [
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
			key: 'traineeCnt',
			name: $format('TraineeCount'),
			width: '30%'
		}
	];

	let tableDataTrainee = [];
	let mapDataTrainee = [];
	let year = 2023;
	$: populateTableData(statesStatsData);
	function populateTableData() {
		const requiredData = statesStatsData[year];
		if (!requiredData) return;
		const mapDataArray = Object.values(requiredData).sort((a, b) => b.traineeCnt - a.traineeCnt);
		tableDataTrainee = mapDataArray.map((data, index) => ({
			rank: index + 1,
			id: data?.id,
			traineeCnt: data?.traineeCnt,
			state: data?.name
		}));
		mapDataTrainee = tableDataTrainee.map((item) => ({
			...item,
			value: item.traineeCnt,
			name: item?.state
		}));
	}
</script>

<InsightsContainer {insightStats} />

<div class=" mt-4 p-4 bg-white my-4 rounded min-h-[500px]">
	<MapAndTableWrapper
		stateID={stateIDTrainee}
		stateName={stateNameTrainee}
		data={mapDataTrainee}
		tableData={tableDataTrainee}
		containerId={containerIdTrainee}
		heatMapStartingColorGradient={0xdcfce7}
		heatMapEndingColorGradient={0x166534}
		tableHeaderDisplay={tableHeaderDisplayTrainee}
		mapHeader={$format('TraineeDistribution') + ' (2023-2024)'}
		tableHeading={$format('StateRanking')}
		placeholderForSearch={$format('SearchByState')}
	/>
</div>
<div class="mb-6">
	<TrainedSettledComparison {traineeOnBoardTotal} {lang} />
</div>
<div class="mb-6">
	<TraineeOnBoard10yearStateWise
		{traineesByState}
		{statesData}
		{lang}
		{stateWiseTraineeOnboard}
		{traineeOnBoardTotal}
	/>
</div>
<div class="mb-6">
	<TraineeOnBoard10yearRsetiWise
		{traineesByState}
		{statesData}
		{lang}
		{traineeOnBoardTotal}
		{rsetiTraineeOnBoardData}
		{rsetiList}
	/>
</div>

<div class="mb-6">
	<CategoryComparisionCard {traineeStatsByCourseCategory} />
</div>
<div class="mb-6">
	<TraineeOnboardChartCourseWise {traineesByCourse} {courseList} {lang} />
</div>
<div class="mb-6">
	<TraineeOnboardChartStateWise {traineesByState} {statesData} {lang} />
</div>
<!-- 

<div class="mb-6">
	<RegisteredTraineeChart />
</div> -->

<!-- <div class="mb-6">
	<UnregisteredTraineeChart />
</div> -->
