<script>
	import Dropdown from '$lib/Components/Dropdown.svelte';
	import LineChart from '$lib/Components/LineChart.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import { format } from 'svelte-i18n';
	import Histogram from '$lib/Components/Histogram.svelte';

	export let lang = 'en';
	export let traineeOnBoardTotal = [];

	let labels = [];
	const trainedCountConfig = {
		label: $format('Trained Count'),
		data: [],
		fill: false,
		borderColor: 'rgb(54, 162, 235)',
		backgroundColor: 'rgba(92, 160, 220, 0.9)', //blue
		borderWidth: 1
	};

	const settledCountConfig = {
		label: $format('Settled Count'),
		data: [],
		fill: false,
		borderColor: 'rgb(54, 162, 235)',
		backgroundColor: 'rgba(102, 174, 120,0.8)', //green
		borderWidth: 1
	};

	let chartData = {
		labels: labels,
		datasets: [trainedCountConfig, settledCountConfig]
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
				title: {
					display: true,
					text: $format('NoOfTrainees'),
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
		}
	};

	let error = null;

	function updateChart() {
		// Clear previous error
		error = null;

		if (!traineeOnBoardTotal || traineeOnBoardTotal?.length === 0) {
			error = 'No data found';
			return;
		}

		let filteredData = traineeOnBoardTotal?.sort((a, b) => a.year - b.year);

		// Transform data
		const allYears = {};
		const traineesCnt = [];
		const settledCnt = [];

		filteredData?.forEach(({ year, trainedCount, settledCount }) => {
			if (!allYears[year]) {
				allYears[year] = year;
			}
			traineesCnt.push(trainedCount);
			settledCnt.push(settledCount);
		});

		labels = Object.keys(allYears);

		// Update chart data
		chartData = {
			labels,
			datasets: [
				{ ...trainedCountConfig, data: traineesCnt },
				{ ...settledCountConfig, data: settledCnt }
			]
		};
	}

	updateChart();
</script>

<div class="bg-white w-full flex flex-col py-4 md:py-8 px-4 md:px-16 rounded-lg">
	<div class="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
		<div>
			<h3 class="text-base font-bold text-primary">
				{$format('Trained and Settled History')}
			</h3>
		</div>
	</div>
	{#if !error}
		<div class="p-2">
			<Histogram {chartData} {chartOptions} />
		</div>
	{:else}
		<ErrorComponent errorMessage={error} />
	{/if}
</div>
