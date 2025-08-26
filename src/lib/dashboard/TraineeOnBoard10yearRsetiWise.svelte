<script>
	import Dropdown from '$lib/Components/Dropdown.svelte';
	import LineChart from '$lib/Components/LineChart.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import { format } from 'svelte-i18n';
	import Filter from '$lib/Components/Filter.svelte';

	export let traineesByState = []; // Incoming data in the specified format
	export let rsetiList = []; // Incoming data in the specified format

	export let lang = 'en';
	export let traineeOnBoardTotal = [];
	export let rsetiTraineeOnBoardData = {};

	let selectedRseti = -1; // Default selection
	let labels = [];
	let data = [];
	let chartData = {
		labels: labels,
		datasets: [
			{
				label: 'No. of Trainees',
				data,
				fill: false,
				borderColor: 'rgb(54, 162, 235)',
				borderWidth: 1,
				pointBackgroundColor: 'rgb(255, 165, 0)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgb(75, 192, 192)'
			}
		]
	};

	let chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				title: {
					display: true,
					text: $format('Year'),
					color: '#143164',
					font: () => ({
						size: window.matchMedia('(max-width: 768px)').matches ? 10 : 12,
						weight: 'bold',
						lineHeight: 1.2
					}),
					padding: () =>
						window.matchMedia('(max-width: 768px)').matches
							? { top: 5, left: 0, right: 0, bottom: 0 }
							: { top: 20, left: 0, right: 0, bottom: 0 }
				}
			},
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: $format('NoOfTraineesRegistered'),
					color: '#143164',
					font: () => ({
						size: window.matchMedia('(max-width: 768px)').matches ? 10 : 12,
						weight: 'bold',
						lineHeight: 1.2
					}),
					padding: () =>
						window.matchMedia('(max-width: 768px)').matches
							? { top: 0, left: 0, right: 0, bottom: 5 }
							: { top: 0, left: 0, right: 0, bottom: 20 }
				},
				grid: {
					display: false
				},
				ticks: {
					callback: function (value) {
						// Abbreviate numbers for smaller screens
						if (window.matchMedia('(max-width: 768px)').matches) {
							return value >= 1000 ? value / 1000 + 'k' : value;
						}
						// Default formatting for larger screens
						return value.toLocaleString();
					},
					font: {
						size: window.matchMedia('(max-width: 768px)').matches ? 10 : 12
					},
					color: '#143164'
				}
			}
		},
		plugins: {
			legend: {
				display: false
			}
		}
	};

	let error = null;
	$: if (rsetiTraineeOnBoardData?.status !== 200) {
		error = rsetiTraineeOnBoardData.error || $format('NoDataFound');
		
	} else if (rsetiTraineeOnBoardData?.length === 0) {
		error = $format('NoDataFound');
	}

	function updateChart(rsetiId) {
		// selectedState = rsetiId;
		selectedRseti = rsetiId;
		// Clear previous error
		error = null;

		if (!rsetiTraineeOnBoardData || rsetiTraineeOnBoardData?.data?.length === 0) {
			error = $format('NoDataFound');
			return;
		}

		// Handle filtering
		let filteredData =
			rsetiId === Number(-1)
				? traineeOnBoardTotal
				: rsetiTraineeOnBoardData?.data?.filter((item) => item.id == rsetiId);

		filteredData = filteredData?.sort((a, b) => a.year - b.year);

		if (!filteredData || filteredData.length === 0) {
			error =
				rsetiId === -1
					? $format('NoDataFound') // No data for all states
					: $format('NoDataFoundForSelectedTC'); // No data for a specific RSETi
			return;
		}

		// Transform data
		const allYears = {};
		const traineesCnt = [];

		filteredData?.forEach(({ year, trainedCount }) => {
			if (!allYears[year]) {
				allYears[year] = year;
			}
			traineesCnt.push(trainedCount);
		});

		labels = Object.keys(allYears); // Month names
		data = traineesCnt; // Trainee counts

		// Update chart data
		chartData = {
			labels,
			datasets: [
				{
					label: 'No. of Trainees',
					data,
					borderColor: 'rgb(54, 162, 235)',
					borderWidth: 2,
					fill: false
				}
			]
		};
	}

	updateChart(-1);

	let allTrainingCenters = $format('AllTrainingCenters');
	function transformRsetiList(rsetis) {
		if (rsetis?.length > 0) {
			let fullList = [{ uuid: -1, name: allTrainingCenters }, ...rsetis];

			return fullList
				.map((rseti) => ({
					id: rseti.uuid,
					name: rseti?.name || rseti?.title
				}))
				.sort((a, b) => {
					if (Number(a?.id) === -1) return -1; // Ensure "All rsetis" comes first
					if (Number(b?.id) === -1) return 1; // Move "All rsetis" above others
					return a?.name?.localeCompare(b?.name); // Sort the rest alphabetically
				});
		}

		return [
			{ id: -1, name: allTrainingCenters }
		];
	}

	let rsetiOptions = transformRsetiList(rsetiList);
</script>

<div class="bg-white w-full flex flex-col py-4 md:py-8 px-4 md:px-16 rounded-lg">
	<div class="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
		<div>
			<h3 class="text-base font-bold text-primary">
				{$format('RSETIHistoricOnboardTrendStateLevel')}
			</h3>
		</div>
		<div class="flex gap-4 items-start md:items-center w-40 md:w-48">
			<Filter
				optionList={rsetiOptions}
				optionListConfigObject={{ optionNameKey: 'name', optionIdKey: 'id' }}
				itemSelected={rsetiOptions[0]?.name}
				on:filterItemSelected={(e) => {
					error = null;
					updateChart(e.detail.id);
				}}
			/>
		</div>
	</div>
	{#if !error}
		<div class="p-2">
			<LineChart {chartData} {chartOptions} />
		</div>
	{:else}
		<ErrorComponent errorMessage={error} />
	{/if}
</div>
