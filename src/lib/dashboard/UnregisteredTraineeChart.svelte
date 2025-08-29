<script>
	import SelectInput from '$lib/Components/SelectInput.svelte';
	import LineChart from '$lib/Components/LineChart.svelte';
	import Tabs from '../courses/Tabs.svelte';
	import { format } from 'svelte-i18n';
	import Filter from '$lib/Components/Filter.svelte';

	export let courseList = [];
	export let lang = 'en';

	const programmeList = [
		{ id: 0, name: 'All Courses', key: 'count' },
		{ id: 1, name: 'Programme 1', key: 'programme1' },
		{ id: 2, name: 'Programme 2', key: 'programme2' },
		{ id: 3, name: 'Programme 3', key: 'programme3' }
	];
	const languageList = [
		{ id: 0, name: 'All Languages', key: 'count' },
		{ id: 1, name: 'English', key: 'programme1' },
		{ id: 2, name: 'Hindi', key: 'programme2' },
		{ id: 3, name: 'Tamil', key: 'programme3' }
	];

	const yearList = [
		{ id: 0, name: '2024', key: '2024' },
		{ id: 1, name: '2023', key: '2023' },
		{ id: 2, name: '2022', key: '2022' },
		{ id: 3, name: '2021', key: '2021' },
		{ id: 4, name: '2020', key: '2020' }
	];

	const sheetData = [
		{ month: 'jan', count: 36305, programme1: 100, programme2: 200, programme3: 300 },
		{ month: 'feb', count: 40594, programme1: 300, programme2: 200, programme3: 157 },
		{ month: 'mar', count: 34238, programme1: 312, programme2: 392, programme3: 160 },
		{ month: 'apr', count: 18461, programme1: 213, programme2: 230, programme3: 105 },
		{ month: 'may', count: 34763, programme1: 100, programme2: 200, programme3: 250 },
		{ month: 'jun', count: 51074, programme1: 231, programme2: 138, programme3: 100 },
		{ month: 'jul', count: 35988, programme1: 123, programme2: 200, programme3: 293 },
		{ month: 'aug', count: 36453, programme1: 100, programme2: 550, programme3: 391 },
		{ month: 'sep', count: 49730, programme1: 312, programme2: 490, programme3: 100 },
		{ month: 'oct', count: 33885, programme1: 100, programme2: 289, programme3: 300 },
		{ month: 'nov', count: 28689, programme1: 231, programme2: 290, programme3: 100 },
		{ month: 'dec', count: 51239, programme1: 100, programme2: 392, programme3: 300 }
	];

	let tabsList = [
		{ id: 1, text: '1W', textDisplay: '1W' },
		{ id: 2, text: '1M', textDisplay: '1M' },
		{ id: 3, text: '1Y', textDisplay: '1Y' },
		{ id: 4, text: 'YTD', textDisplay: 'YTD' }
	];

	let labels = sheetData.map((item) => item.month);
	let data = sheetData.map((item) => item.count);
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
					text: $format('NoOfViews'),
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

	let chartPlugins = {};
	function updateData(event) {
		if (event.detail.name === 'All') {
			data = sheetData.map((item) => item.count);
		} else {
			data = sheetData.map((item) => item[event.detail.key]);
		}
		chartData = {
			labels: labels,
			datasets: [
				{
					label: 'No. of views',
					data,
					fill: false,
					borderColor: 'rgb(54, 162, 235)',
					borderWidth: 1,
					pointBackgroundColor: 'rgb(255, 165, 0)',
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: 'rgb(75, 192, 192)',
					yAxisID: 'y'
				}
			]
		};
	}

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

<div class="bg-white w-full flex flex-col py-8 px-16 rounded-lg">
	<div class="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
		<h1 class="text-base font-bold text-primary">{$format('Views-UnRegisteredTrainees')}</h1>
		<div class="flex gap-4 mb-4">
			<Filter
				optionList={courseOptions}
				optionListConfigObject={{ optionNameKey: 'name', optionIdKey: 'id' }}
				itemSelected={courseOptions[0]?.name}
				on:filterItemSelected={(e) => {
					// error = null;
					// updateChart(e.detail.id);
				}}
			/>
			<Filter
				optionList={languageList}
				optionListConfigObject={{ optionNameKey: 'name', optionIdKey: 'id' }}
				itemSelected={languageList[0]?.name}
				on:filterItemSelected={(e) => {
					// error = null;
					// updateChart(e.detail.id);
				}}
			/>
			<!-- <SelectInput
				showFieldName={false}
				optionList={languageList}
				itemSelected={languageList[0].name}
				addClass="min-w-[100px] "
			/> -->
		</div>
	</div>
	<!-- <h3 class="text-sm text-secondary mb-4">Filters applied: Date: Jan ‘23 to Dec ‘24</h3> -->

	<Tabs tabs={tabsList} />
	<div class="p-2">
		<LineChart {chartData} {labels} {chartOptions} {chartPlugins} />
	</div>
</div>
