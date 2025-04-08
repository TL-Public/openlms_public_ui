<script>
	import LineChart from '$lib/Components/LineChart.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import { monthNames } from '$lib/data.js';
	import { format } from 'svelte-i18n';

	export let traineeStatsByCourseCategory = { data: [], status: 200, error: null };

	let error = null;
	$: if (traineeStatsByCourseCategory?.status !== 200) {
		error = traineeStatsByCourseCategory.error || 'Failed to fetch data';
	} else if (traineeStatsByCourseCategory?.data?.length === 0) {
		error = 'No data found';
	} else {
		error = null;
	}

	let months = [...new Set(traineeStatsByCourseCategory?.data?.map((item) => item?.mnth))];
	let categoryIds = [
		...new Set(traineeStatsByCourseCategory?.data?.map((item) => item?.category_id))
	];

	const categoryColors = {
		1: 'rgb(92, 160, 220)', // Agricultural EDPs (Blue)
		2: 'rgb(255, 140, 154)', // Process EDPs (Red)
		3: 'rgb(102, 174, 120)', // Product EDPs (Green)
		4: 'rgb(255, 215, 128)', // General EDPs (Yellow)
		0: 'rgb(138, 83, 167)' // Total (Purple)
	};
	const categoryNames = {
		1: 'Agricultural EDPs',
		2: 'Process EDPs',
		3: 'Product EDPs',
		4: 'General EDPs',
		0: 'Total'
	};

	const totalTraineesPerMonth = months?.map((month) => {
		return traineeStatsByCourseCategory?.data
			?.filter((item) => item?.mnth === month)
			.reduce((total, item) => total + item?.total_trainees, 0);
	});

	// Prepare datasets for the chart
	let chartData = {
		labels: months?.map((month) => monthNames[month - 1]), // Map numeric month to names
		datasets: [
			...categoryIds.map((categoryId) => ({
				label: categoryNames[categoryId],
				data: traineeStatsByCourseCategory?.data
					?.filter((item) => item?.category_id === categoryId)
					.map((item) => item?.total_trainees),
				borderColor: categoryColors[categoryId],
				backgroundColor: categoryColors[categoryId],
				borderWidth: 2,
				fill: false,
				pointBackgroundColor: categoryColors[categoryId],
				pointBorderColor: categoryColors[categoryId]
			})),
			{
				label: 'All EDP categories',
				data: totalTraineesPerMonth,
				borderColor: categoryColors[0], // 'Total' category mapped by ID 0
				backgroundColor: categoryColors[0], // 'Total' category mapped by ID 0
				borderWidth: 2,
				fill: false,
				pointBackgroundColor: categoryColors[0],
				pointBorderColor: categoryColors[0],
				borderDash: [5, 5] // Dashed line for total
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
					text: $format('Month'),
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
					text: $format('NoOfTraineesEnrolled'),
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
				display: true,
				position: 'top',
				align: 'center',
				labels: {
					usePointStyle: true,
					pointStyle: 'rect',
					font: () => ({
						size: window.matchMedia('(max-width: 768px)').matches ? 10 : 10,
						weight: 'semibold',
						lineHeight: 1.2
					})
				}
			}
		}
	};

	let chartPlugins = {};
</script>

<div class="bg-white80 w-full flex flex-col py-4 md:py-8 px-4 md:px-16 rounded-lg">
	<div class="flex justify-between items-center">
		<h1 class="text-base font-bold text-primary">
			{$format('TraineeOnboardTrendAllCourseCategories')}
		</h1>
	</div>

	{#if !error}
		<div class="p-2">
			<LineChart {chartData} {chartOptions} {chartPlugins} />
		</div>
	{:else}
		<ErrorComponent errorMessage={error} />
	{/if}
</div>
