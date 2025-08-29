<!-- ACtual Progress tracking is not available right now, This is dummy code, many of the insights might not eb available when API develops, so the code eneds to be changed according to API details, now this compoenent is sued to show the empty state -->

<script>
	import { _ } from 'svelte-i18n';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
  import Clock from '$lib/svgComponents/Clock.svelte';

	export let traineeRsetis = [];
	export let courseDetails = {};
	export let getProgressPercentage;

	// Format date strings
	function formatDate(dateString) {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	// Get course details by UUID
	function getCourseDetails(courseUuid) {
		return (
			courseDetails[courseUuid] || {
				name: $_('Unknown Course'),
				category: 'N/A',
				courseId: 'N/A',
				description: $_('No description available'),
				chapters: 0,
				centers: 0
			}
		);
	}
</script>

<div>
	<h2 class=" mb-4 flex items-center gap-2">
    <Clock />
		<!-- <img src="/totalVideoDurationIcon.svg" alt="" class="h-6 w-6"> -->
		<span class="heading-L">{$_('ProgressTracking')}</span>
	</h2>

	{#if traineeRsetis && traineeRsetis.length > 0}
		<div class="space-y-6">
			{#each traineeRsetis as course}
				{@const courseDetail = getCourseDetails(course.courseUuid)}
				{@const progressPercentage = getProgressPercentage(course.courseUuid)}

				<div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
					<div class="flex justify-between items-start mb-4">
						<div>
							<h3 class="text-lg font-semibold text-gray-800">{courseDetail.name}</h3>
							<p class="text-sm text-gray-500">Course ID: {courseDetail.courseId}</p>
						</div>
						<div class="text-right">
							<div class="text-2xl font-bold text-gray-800">{progressPercentage}%</div>
							<p class="text-xs text-gray-500">Completed</p>
						</div>
					</div>

					<!-- Progress Bar -->
					<div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
						<div
							class="bg-accent-dark h-2.5 rounded-full"
							style="width: {progressPercentage}%"
						></div>
					</div>

					<!-- Progress Stats -->
					<div class="grid grid-cols-3 gap-4 text-center">
						<div>
							<div class="text-sm font-medium text-gray-500">Chapters</div>
							<div class="text-lg font-semibold">
								{Math.round((courseDetail.chapters * progressPercentage) / 100)} / {courseDetail.chapters}
							</div>
						</div>
						<div>
							<div class="text-sm font-medium text-gray-500">Assignments</div>
							<div class="text-lg font-semibold">
								{Math.round((4 * progressPercentage) / 100)} / 4
							</div>
						</div>
						<div>
							<div class="text-sm font-medium text-gray-500">Quizzes</div>
							<div class="text-lg font-semibold">
								{Math.round((6 * progressPercentage) / 100)} / 6
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="bg-white p-4 rounded-lg text-center">
			<ErrorComponent errorMessage={$_('Progress details are currently unavailable.')} />
		</div>
	{/if}
</div>
