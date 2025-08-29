<script>
	import { onMount } from 'svelte';
	import SingleStats from '$lib/landingPage/edureach/SingleStatsOLMS.svelte';
	import SingleStatsSkeleton from '$lib/landingPage/SingleStatsSkeleton.svelte';
	import ErrorMessage from '$lib/courses/ErrorMessage.svelte';
	
	export let column;
	export let alignment;
	export let generalStats;
	export let error;
	let dummayStats = new Array(4)



</script>

<div
	class="grid bp-420px:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 rounded-lg justify-items-center gap-2 lg:gap-5 xl:gap-9"
	class:grid-cols-1={column === 'single'}
	class:grid-cols-2={column != 'single'}
>



{#if error == null}
	{#each generalStats as stats, index (index)}
		<SingleStats {stats} {alignment} />
	{/each}
	{:else}
	<ErrorMessage {error}/>
	{/if}
</div>
