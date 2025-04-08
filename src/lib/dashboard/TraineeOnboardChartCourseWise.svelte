<script>
	import { monthNames } from '$lib/data.js';
	import Dropdown from '$lib/Components/Dropdown.svelte';
	import LineChart from '$lib/Components/LineChart.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import { format } from 'svelte-i18n';
	import Filter from '$lib/Components/Filter.svelte';

	export let traineesByCourse = []; // Incoming data in the specified format
	export let courseList = []; // Course list
	export let lang = 'en';

	let selectedCourse = 'All'; // Default selection
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
	$: if (traineesByCourse?.status !== 200) {
		error = traineesByCourse.error || 'Failed to fetch data';
	} else if (traineesByCourse?.data?.length === 0) {
		error = 'No data found';
	} else {
		error = null;
	}

	function updateChart(courseCode) {
		selectedCourse = courseCode;

		if (error) return;
		if (traineesByCourse?.data?.length === 0) {
			error = 'No data found';
			return;
		}

		let filteredData =
			courseCode === 'All'
				? traineesByCourse?.data
				: traineesByCourse?.data?.filter((item) => item?.course_code === courseCode);

		if (filteredData?.length === 0) {
			error = 'No data found for the selected course';
		}
		// Prepare chart data
		const transformed = {};
		filteredData?.forEach(({ mnth, total_trainees }) => {
			const monthName = monthNames[mnth - 1];
			if (!transformed[monthName]) {
				transformed[monthName] = 0;
			}
			transformed[monthName] = transformed[monthName] + total_trainees;
		});
		labels = Object.keys(transformed);
		data = Object.values(transformed);

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

	// Initialize chart with all courses
	updateChart('All');
	// Generate course options
	let allCourses = $format('AllCourses');
	let courseOptions = [
		{ id: 'All', name: allCourses },
		...courseList
			.map((course) => ({
				id: course.courseCode,
				name: course.translations.find((t) => t.languageCode === lang)?.title || course.courseCode
			}))
			.sort((a, b) => a?.name?.localeCompare(b.name))
	];
</script>

<div class="bg-white80 w-full flex flex-col py-4 md:py-8 px-4 md:px-16 rounded-lg">
	<div class="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
		<div>
			<h3 class="text-base font-bold text-primary">{$format('TraineesOnboardTrendCourseLevel')}</h3>
		</div>
		<div class="flex gap-4 items-start md:items-center w-40 md:w-48">
			<Filter
				optionList={courseOptions}
				optionListConfigObject={{ optionNameKey: 'name', optionIdKey: 'id' }}
				itemSelected={courseOptions[0].name}
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
