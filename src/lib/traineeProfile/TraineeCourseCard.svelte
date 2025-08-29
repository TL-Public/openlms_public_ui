<script>
	import { goto } from '$app/navigation';
	import Calendar from '$lib/svgComponents/Calendar.svelte';
	import ProgressIndicator from '$lib/svgComponents/ProgressIndicator.svelte';
    import { _ } from 'svelte-i18n';
	import { formatDateMMMYYYY } from '$lib/utils/helper.js';

	export let course = {};
	export let courseDetail = {};
	export let progressPercentage = 0;

	function handleGoToCourseDetails() {
		goto(`/courses/details/${course?.courseUuid}`);
	}
</script>

<div
	class="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 h-full flex flex-col"
	on:click={handleGoToCourseDetails}
>
	<!-- Progress Bar -->
	<div class="h-1 bg-gray-100 w-full">
		<div class="h-full bg-accent-dark" style="width: {progressPercentage}%"></div>
	</div>

	<div class="p-5 flex-1 flex flex-col">
		<!-- Header Section -->
		<div class="flex justify-between items-start mb-4">
			<div class="flex-1">
				<!-- Status and Category -->
				<div class="flex-col bp-420px:flex-row flex bp-420px:items-center mb-2 gap-2 w-fit">
					<span
						class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit {course?.status === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-10 text-darkGray'}"
					>
						{course?.status === 1 ? $_('Active') : $_('Inactive')}
					</span>
					{#if courseDetail?.category}
						<span class="text-xs text-darkGray capitalize px-2 py-0.5 rounded bg-gray-10 w-fit">
							{courseDetail?.category}
						</span>
					{/if}
				</div>

				<!-- Course Name and ID -->
				<h3 class="heading-L" title={courseDetail?.name}>{courseDetail?.name}</h3>
				{#if courseDetail?.courseId !== 'N/A'}
					<p class="text-xs text-darkGray mt-1">
						{$_('Course ID')}: {courseDetail?.courseId}
					</p>
				{/if}
			</div>
		</div>

		<!-- Course Info Section -->
		<div class="flex flex-wrap gap-4 mb-3 text-xs text-darkGray">
			<!-- Enrollment Date -->
			<div class="flex items-center">
				<Calendar />
				{$_('Enrolled')}: {formatDateMMMYYYY(course?.enrolledOn)}
			</div>

			<!-- Progress Indicator -->
			<div class="flex items-center">
				<ProgressIndicator />
				<span class="font-medium">{progressPercentage}% {$_('Completed')}</span>
			</div>
		</div>

		<!-- Course Description -->
		<div class="mb-4 flex-grow">
			{#if courseDetail?.description}
				<p class="text-xs sm:text-sm text-darkGray leading-loose sm:leading-relaxed line-clamp-2">
					{courseDetail?.description}
				</p>
			{/if}
		</div>
	</div>
</div>
