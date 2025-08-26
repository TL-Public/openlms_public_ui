<!-- 
 //Old design 
<script>
 
	import CourseIndividualStats from '$lib/courses/CourseIndividualStats.svelte';
	export let bgColor;
	export let courseStatsDetails;
</script>

<div
	class="grid grid-cols-1 p-1  justify-items-center bg-{bgColor}  rounded-lg sm:grid-cols-2  xl:grid-cols-3 justify-items-start md:justify-items-center"
>
	{#each courseStatsDetails as stats,index(index)}
		<CourseIndividualStats {stats} />
	{/each}
</div> -->


<!-- New Design -->
<script>
	import { onMount } from 'svelte';
	import CourseIndividualStats from '$lib/courses/CourseIndividualStats.svelte';
	import ErrorMessage from '$lib/courses/ErrorMessage.svelte';
	
	export let column;
	export let alignment;
	export let generalStats;
	export let error;
	let dummayStats = new Array(4)



</script>

<div
	class="grid bp-420px:grid-cols-2 bp-900px:grid-cols-4 lg:grid-cols-4 rounded-lg justify-items-center gap-2 lg:gap-5 xl:gap-9"
	class:grid-cols-1={column === 'single'}
	class:grid-cols-2={column != 'single'}
>



{#if error == null}
	{#each generalStats as stats, index (index)}
		<CourseIndividualStats {stats} {alignment} />
	{/each}
	{:else}
	<ErrorMessage {error}/>
	{/if}
</div>
