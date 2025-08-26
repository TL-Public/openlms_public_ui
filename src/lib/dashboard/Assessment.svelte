<script>
	import { format } from 'svelte-i18n';
	import Top10CoursesCardAssesment from '$lib/dashboard/Top10CoursesCardAssesment.svelte';

	import Top10VideosCardAssesment from '$lib/dashboard/Top10VideosCardAssesment.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
</script>

<div class="mb-6">
	<!-- <ErrorComponent errorMessage={$format('NoDataFound')} /> -->

	<div class="">
		<Top10CoursesCardAssesment />
	</div>
</div>

<div class="">
	<div class="">
		<Top10VideosCardAssesment />
	</div>
</div>
