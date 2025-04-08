<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	export let histogramId = 'Histogram-' + Math.random();
	export let labels = [];
	export let chartPlugins = {};
	export let chartData = {
		labels: labels,
		datasets: [
			{
				label: 'No Data Found',
				data: [],
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(255, 99, 132, 0.7)' // Red
			},
			{
				label: 'No Data Found',
				data: [],
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(54, 162, 235, 0.7)' // Blue
			}
		]
	};
	export let chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				beginAtZero: true
			}
		}
	};
	let ctx;
	onMount(() => {
		ctx = document.getElementById(histogramId)?.getContext('2d');
		new Chart(ctx, {
			type: 'bar',
			data: chartData,
			options: chartOptions,
			plugins: chartPlugins
		});
	});
	$: updateChart(chartData);
	function updateChart() {
		// clear old chart and draw new one
		if (ctx) {
			if (Chart.getChart(ctx)) {
				Chart.getChart(ctx).destroy();
			}
			new Chart(ctx, {
				type: 'bar',
				data: chartData,
				options: chartOptions,
				plugins: chartPlugins
			});
		}
	}
</script>
<div class="w-full">
	<canvas id={histogramId} class="min-h-80">
		<p>Hello Fallback World</p>
	</canvas>
</div>