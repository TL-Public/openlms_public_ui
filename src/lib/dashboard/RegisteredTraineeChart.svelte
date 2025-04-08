<script>
	import SelectInput from '$lib/Components/SelectInput.svelte';
	import LineChart from '$lib/Components/LineChart.svelte';
	import Tabs from '../courses/Tabs.svelte';
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
	const genderList = [
		{ id: 0, name: 'All Genders' },
		{ id: 1, name: 'Male' },
		{ id: 2, name: 'Female' },
		{ id: 3, name: 'Other' }
	];
	const ageGroups = [
		{ id: 0, name: 'All ages' },
		{ id: 1, name: '18-25 yrs' },
		{ id: 2, name: '26-35 yrs' },
		{ id: 3, name: '36-45 yrs' },
		{ id: 4, name: 'Above 45 yrs' }
	];
	const yearList = [
		{ id: 0, name: '2024', key: '2024' },
		{ id: 1, name: '2023', key: '2023' },
		{ id: 2, name: '2022', key: '2022' },
		{ id: 3, name: '2021', key: '2021' },
		{ id: 4, name: '2020', key: '2020' }
	];

	const sheetData = [
		{ month: 'jan 24', count: 36305, programme1: 100, programme2: 200, programme3: 300 },
		{ month: 'feb 24', count: 40594, programme1: 300, programme2: 200, programme3: 157 },
		{ month: 'mar 24', count: 34238, programme1: 312, programme2: 392, programme3: 160 },
		{ month: 'apr 24', count: 18461, programme1: 213, programme2: 230, programme3: 105 },
		{ month: 'may 24', count: 34763, programme1: 100, programme2: 200, programme3: 250 },
		{ month: 'jun 24', count: 51074, programme1: 231, programme2: 138, programme3: 100 },
		{ month: 'jul 24', count: 35988, programme1: 123, programme2: 200, programme3: 293 },
		{ month: 'aug 24', count: 36453, programme1: 100, programme2: 550, programme3: 391 },
		{ month: 'sep 24', count: 49730, programme1: 312, programme2: 490, programme3: 100 },
		{ month: 'oct 24', count: 33885, programme1: 100, programme2: 289, programme3: 300 },
		{ month: 'nov 24', count: 28689, programme1: 231, programme2: 290, programme3: 100 },
		{ month: 'dec 24', count: 51239, programme1: 100, programme2: 392, programme3: 300 }
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
		scales: {
			x: {
				title: {
					display: true,
					text: 'Month',
					color: '#143164',
					font: {
						size: 16,
						weight: 'bold',
						lineHeight: 1.2
					},
					padding: { top: 20, left: 0, right: 0, bottom: 0 }
				}
			},
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'No. of views on a course',
					color: '#143164',
					font: {
						size: 16,
						weight: 'bold',
						lineHeight: 1.2
					},
					padding: { top: 0, left: 0, right: 0, bottom: 20 }
				},
				grid: {
					display: false
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
		console.log(event.detail.name);
		if (event.detail.name === 'All') {
			data = sheetData.map((item) => item.count);
		} else {
			data = sheetData.map((item) => item[event.detail.key]);
		}
		chartData = {
			labels: labels,
			datasets: [
				{
					label: 'No. of views on a course',
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
</script>

<div class="bg-white w-full flex flex-col py-8 px-16 rounded-lg">
	<div class="flex justify-between items-center">
		<h1 class="text-xl font-bold text-primary">Views - Registered Trainees</h1>
		<div class="flex gap-4 mb-4">
			<SelectInput
				showFieldName={false}
				optionList={programmeList}
				itemSelected={programmeList[0].name}
				addClass="min-w-[100px]"
			/>
			<SelectInput
				showFieldName={false}
				optionList={languageList}
				itemSelected={languageList[0].name}
				addClass="min-w-[100px] "
			/>
			<SelectInput
				showFieldName={false}
				optionList={ageGroups}
				itemSelected={ageGroups[0].name}
				on:itemSelection={() => {}}
				addClass="min-w-[120px] "
			/>
			<SelectInput
				showFieldName={false}
				optionList={genderList}
				itemSelected={genderList[0].name}
				on:itemSelection={() => {}}
				addClass="min-w-[100px] "
			/>
		</div>
	</div>
	<!-- <h3 class="text-sm text-secondary mb-4">Filters applied: Date: Jan ‘23 to Dec ‘24</h3> -->

	<Tabs tabs={tabsList} />
	<div class="p-2">
		<LineChart {chartData} {labels} {chartOptions} {chartPlugins} />
	</div>
</div>
