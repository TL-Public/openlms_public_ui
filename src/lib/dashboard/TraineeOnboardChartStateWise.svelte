<script>
	import { monthNames } from '$lib/data.js';
	import Dropdown from '$lib/Components/Dropdown.svelte';
	import LineChart from '$lib/Components/LineChart.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import { format } from 'svelte-i18n';
    import Filter from '$lib/Components/Filter.svelte';

	export let traineesByState = []; // Incoming data in the specified format
	export let statesData = []; // State list
	export let lang ='en'

    const yearOfAssessment= 2023 // hardcoded for now, can be made dynamic later
	let selectedState = -1; // Default selection
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
				padding: () => (window.matchMedia('(max-width: 768px)').matches ? 
                { top: 5, left: 0, right: 0, bottom: 0 } : 
                { top: 20, left: 0, right: 0, bottom: 0 })
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
		padding: () => (window.matchMedia('(max-width: 768px)').matches ? 
                { top: 0, left: 0, right: 0, bottom: 5 } : 
                { top: 0, left: 0, right: 0, bottom: 20 })
				},
				grid: {
					display: false
				},
				ticks: {
        callback: function(value) {
            // Abbreviate numbers for smaller screens
            if (window.matchMedia('(max-width: 768px)').matches) {
                return value >= 1000 ? (value / 1000) + 'k' : value;
            }
            // Default formatting for larger screens
            return value.toLocaleString();
        },
        font: {
            size: window.matchMedia('(max-width: 768px)').matches ? 10 : 12
        },
        color: '#143164'
    },
				
			}
		},
		plugins: {
			legend: {
				display: false
			}
		}
	};

	let error = null;
	$: if (traineesByState?.status !== 200) {
		error = traineesByState.error || $format('NoDataFound');
	} else if (traineesByState?.data?.length === 0) {
		error = $format('NoDataFound');
	} else {
		error = null;
	}

    function updateChart(stateId) {
    selectedState = Number(stateId);
    // Clear previous error
    error = null;

    if (!traineesByState?.data || traineesByState?.data?.length === 0) {
        error = $format('NoDataFound');
        return;
    }

    // Handle filtering
    let filteredData = stateId === Number(-1)
        ? traineesByState.data // All states
        : traineesByState.data.filter((item) => item.state_id === parseInt(stateId));

    if (!filteredData || filteredData.length === 0) {
        error = stateId === -1 
            ? $format('NoDataFound') // No data for all states
            : $format('NoDataFoundForSelectedState'); // No data for a specific state
        return;
    }

    // Transform data
    const transformed = {};
    filteredData.forEach(({ mnth, sum }) => {
        const monthName = monthNames[mnth - 1]; // Convert month number to name
        if (!transformed[monthName]) {
            transformed[monthName] = 0;
        }
        transformed[monthName] += sum; // Aggregate values by month
    });

    labels = Object.keys(transformed); // Month names
    data = Object.values(transformed); // Trainee counts

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
	// Generate course options
    let stateOptions = statesData
    .map((states) => ({
        id: states.extId,
        name: states?.name || states?.title
    }))
    .sort((a, b) => {
        if (Number(a.id) === -1) return -1; // Ensure "All States" comes first
        if (Number(b.id) === -1) return 1;  // Move "All States" above others
        return a.name.localeCompare(b.name); // Sort the rest alphabetically
    });

    
</script>

<div class="bg-white w-full flex flex-col py-4 md:py-8 px-4 md:px-16 rounded-lg">
	<div class="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
		<div>
			<h3 class="text-base font-bold text-primary">{$format('TraineesOnboardTrendStateLevel')} ({yearOfAssessment})</h3>
		</div>
		<div class="flex gap-4 items-start md:items-center w-40 md:w-48">
		     <Filter
                optionList={stateOptions}
                optionListConfigObject={{ optionNameKey: 'name', optionIdKey: 'id' }}
				itemSelected={stateOptions[0]?.name}
                on:filterItemSelected={(e) => {
                    error = null;
                    updateChart(Number(e.detail.id));
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
