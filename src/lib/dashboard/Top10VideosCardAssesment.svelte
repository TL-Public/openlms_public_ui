<script>
	import GoogleMatrialIcon from '../Components/GoogleMatrialIcon.svelte';
	import SelectInput from '$lib/Components/SelectInput.svelte';
	import { Chart } from 'chart.js/auto';
	import PieChart from '$lib/Components/PieChart.svelte';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import Filter from '$lib/Components/Filter.svelte';
	import { format } from 'svelte-i18n';

	const sampleData = [
		{ name: 'Pest and Disease Management in Flower Cultivation', score: 38.74 },
		{ name: 'Harvesting and Packaging Vegetables for Market', score: 23.83 },
		{ name: 'Bee Behavior and Colony Health', score: 19.83 },
		{ name: 'Choosing the Right Substrate for Mushrooms', score: 17.83 },
		{ name: 'Role and Responsibilities of Business Correspondents', score: 15.83 },
		{ name: 'Effective Communication Strategies for Debt Collection', score: 13.83 },
		{ name: 'Leveraging Technology for Efficient Store Management', score: 11.83 },
		{ name: 'Optimizing Egg Production and Meat Yield', score: 10.83 },
		{ name: 'Legal and Regulatory Considerations for Entrepreneurs', score: 9.83 },
		{ name: 'Marketing Your Tailoring Services Effectively', score: 7.83 }
	];

	let chartLabels = sampleData.map((item) => item.name);
	let data = sampleData.map((item) => item.score);
	const backgroundColor = [
		'#006400', // Darkest green
		'#008000',
		'#228B22',
		'#32CD32',
		'#3CB371',
		'#66CDAA',
		'#90EE90',
		'#98FB98',
		'#ADFF2F',
		'#F0FFF0' // Lightest green
	];

	let activeIndex = null;
	let chartContext;
	const rerenderChart = (index) => {
		chartContext?.chart.setActiveElements([{ datasetIndex: 0, index }]);
		chartContext?.chart.update();
		activeIndex = index;
		console.log('Ran after update', chartContext);
	};
	const htmlLegendPlugin = {
		id: 'htmlLegend',
		afterUpdate: (chart, args, options) => {
			const items = chart.options.plugins.legend.labels.generateLabels(chart);
			console.log('Ran after update');
			chartContext = { chart, items };
		},
		afterEvent: (chart, event, options) => {
			const datasetIndex = chart.getDatasetMeta(0).data;
			// find active index
			const currentActiveIndex = datasetIndex.findIndex((item, index) => item.active);
			activeIndex = currentActiveIndex;
		}
	};

	let chartData = {
		labels: chartLabels,
		datasets: [
			{
				label: 'No. of Trainees',
				backgroundColor,
				borderWidth: 1,
				borderColor: backgroundColor,
				data,
				hoverOffset: 20
			}
		]
	};
	let chartOptions = {
		layout: {
			padding: {
				left: 10,
				right: 10,
				top: 10,
				bottom: 10
			}
		},
		tooltips: {
			enabled: false
		},
		plugins: {
			datalabels: {
				formatter: (value, ctx) => {
					let sum = 0;
					let dataArr = ctx.chart.data.datasets[0].data;
					dataArr.map((data) => {
						sum += data;
					});
					let percentage = ((value * 100) / sum).toFixed(2) + '%';
					return percentage;
				},
				color: '#000'
			},
			legend: {
				display: false
			},
			htmlLegend: {
				container: 'htmlLegendContainer'
			}
		}
	};

	let chartPlugins = [htmlLegendPlugin, ChartDataLabels];

	const viewTopOptions = [
		{ id: 1, name: '5' },
		{ id: 2, name: '10' }
		// { id: 3, name: '30' },
		// { id: 4, name: '40' },
		// { id: 5, name: '50' },
		// { id: 6, name: '60' },
		// { id: 7, name: '70' }
	];
</script>

<div class="bg-white w-full flex flex-col py-8 px-16 rounded-lg">
	<div class="flex flex-col md:flex-row justify-between gap-2 md:gap-0 mb-4">
		<div>
			<h1 class="text-base font-bold text-primary">
				{$format('TopVideosBasedOnPerf')}
			</h1>
			<!-- <p class=" text-xs">Top 10 popular videos</p> -->
		</div>

		<div class="flex items-center gap-2 text-xs">
			<h3>View top</h3>
			<!-- <SelectInput showFieldName={false} optionList={viewTopOptions} itemSelected={10} /> -->
			<Filter
				optionList={viewTopOptions}
				optionListConfigObject={{ optionNameKey: 'name', optionIdKey: 'id' }}
				itemSelected={viewTopOptions[1]?.name}
				on:filterItemSelected={(e) => {
					// error = null;
					// updateChart(e.detail.id);
				}}
				addClass="w-16"
			/>
			<h3>Videos</h3>
		</div>
	</div>

	<!-- <button on:click={rerenderChart} class="bg-primary text-white px-4 py-2 rounded-md">Rerender</button> -->
	<div class="grid grid-cols-2 gap-x-8">
		<PieChart type="doughnut" {chartData} labels={chartLabels} {chartPlugins} {chartOptions} />
		<div class="flex flex-col">
			<div class="border rounded-lg">
				<table class="w-full border-collapse divide-y divide-gray-300 sm:text-sm text-xs">
					<thead class=" text-white">
						<tr>
							<th class="text-left p-2 rounded-tl-lg bg-primary">Color</th>
							<th class="text-left p-2 bg-primary">Video Title</th>
							<th class="text-right p-2 bg-primary">Score</th>
							<th class="text-right p-2 rounded-tr-lg bg-primary">&nbsp</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 cursor-pointer">
						{#each sampleData as label, index}
							<tr
								class="hover:bg-gray-100"
								on:click={() => rerenderChart(index)}
								class:bg-gray-100={index === activeIndex}
							>
								<td class="p-2 mx-auto flex justify-center items-center">
									<div
										class="w-4 h-4 rounded-sm"
										style="background-color: {backgroundColor[index]}"
									></div>
								</td>
								<td class="p-2">{label.name}</td>
								<td class="text-right p-2">{label.score}</td>
								<td class="p-2 text-center">
									<GoogleMatrialIcon iconName="visibility" addClass="text-accent" />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
