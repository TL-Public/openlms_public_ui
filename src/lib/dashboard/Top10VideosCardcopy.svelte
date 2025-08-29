<script>
	import GoogleMatrialIcon from '../Components/GoogleMatrialIcon.svelte';
	import SelectInput from '$lib/Components/SelectInput.svelte';
	import { Chart } from 'chart.js/auto';
	import PieChart from '$lib/Components/PieChart.svelte';
	import ChartDataLabels from 'chartjs-plugin-datalabels';


	const sampleData = [
		{ name: 'Pest and Disease Management in Flower Cultivation', viewCount: 29402 },
		{ name: 'Harvesting and Packaging Vegetables for Market', viewCount: 23830 },
		{ name: 'Bee Behavior and Colony Health', viewCount: 19830 },
		{ name: 'Choosing the Right Substrate for Mushrooms', viewCount: 17830 },
		{ name: 'Role and Responsibilities of Business Correspondents', viewCount: 15830 },
		{ name: 'Effective Communication Strategies for Debt Collection', viewCount: 13830 },
		{ name: 'Leveraging Technology for Efficient Store Management', viewCount: 11830 },
		{ name: 'Optimizing Egg Production and Meat Yield', viewCount: 10830 },
		{ name: 'Legal and Regulatory Considerations for Entrepreneurs', viewCount: 9830 },
		{ name: 'Marketing Your Tailoring Services Effectively', viewCount: 7830 }
	];
	let chartLabels = sampleData.map((item) => item.name);
	let data = sampleData.map((item) => item.viewCount);
	const backgroundColor = [
		'#8B4000', // Darkest orange
		'#A04D00',
		'#B55A00',
		'#CA6700',
		'#DF7400',
		'#F48100',
		'#FF8C00',
		'#FFA333',
		'#FFBA66',
		'#FFD199',
		'#FFE2BD' // Lightest orange
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
		{ id: 1, name: '10' },
		{ id: 2, name: '20' },
		{ id: 3, name: '30' },
		{ id: 4, name: '40' },
		{ id: 5, name: '50' },
		{ id: 6, name: '60' },
		{ id: 7, name: '70' }
	];
</script>

<div class="bg-white w-full flex flex-col py-8 px-16 rounded-lg">
	<div class="flex mb-10 justify-between">
		<div>
			<h1 class="text-xl font-bold text-primary">Top 10 Videos</h1>
			<p class=" text-xs">Top 10 popular videos</p>
		</div>

		<div class="flex items-center gap-2">
			<h3>View top</h3>
			<SelectInput showFieldName={false} optionList={viewTopOptions} itemSelected={10} />
			<h3>Videos</h3>
		</div>
	</div>

	<!-- <button on:click={rerenderChart} class="bg-primary text-white px-4 py-2 rounded-md">Rerender</button> -->
	<div class="grid grid-cols-2 gap-x-8">
		<PieChart type="doughnut" {chartData} labels={chartLabels} {chartPlugins} {chartOptions} />
		<div class="flex flex-col">
			<div class="border rounded-lg">
				<table class="w-full border-collapse divide-y divide-gray-300">
					<thead class=" text-white">
						<tr>
							<th class="text-left p-2 rounded-tl-lg bg-primary">Color</th>
							<th class="text-left p-2 bg-primary">Course</th>
							<th class="text-right p-2 bg-primary">Views</th>
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
								<td class="text-right p-2">{label.viewCount}</td>
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
