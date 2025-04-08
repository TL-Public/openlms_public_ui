<script>
	import { goto } from '$app/navigation';
	import { formatDateMMMYYYY } from '$lib/utils/helper.js';
	import { _ } from 'svelte-i18n';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import Calendar from '$lib/svgComponents/Calendar.svelte';
	import ProgressIndicator from '$lib/svgComponents/ProgressIndicator.svelte';
	import OpenBook from '$lib/svgComponents/OpenBook.svelte';
	// Component props
	export let traineeRsetis = [];
	export let courseDetails = {};
	export let getProgressPercentage = () => 0;
	function getCourseDetails(courseUuid) {
		if (!courseUuid || !courseDetails) return getDefaultCourseDetails();
		return courseDetails[courseUuid] || getDefaultCourseDetails();
	}
	function getDefaultCourseDetails() {
		return {
			name: $_('Unknown Course'),
			category: 'N/A',
			courseId: 'N/A',
			description: $_('No description available')
		};
	}
	function getProgress(courseUuid) {
		try {
			return getProgressPercentage ? getProgressPercentage(courseUuid) : 0;
		} catch (error) {
			console.error('Error getting progress:', error);
			return 0;
		}
	}
	function handleGoToCourseDetails(uuid) {
		goto(`/courses/details/${uuid}`);
	}
	// Derived values
	$: hasEnrolledCourses = Array.isArray(traineeRsetis) && traineeRsetis.length > 0;
</script>

<div>
	<h2 class="mb-6 flex items-center gap-2">
		<OpenBook />
		<!-- <img src="/chapters.svg" alt="" class="h-6 w-6"> -->
		<span class="heading-L">{$_('EnrolledCourses')}</span>
	</h2>

	{#if hasEnrolledCourses && Object.keys(courseDetails).length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each traineeRsetis as course (course?.courseUuid)}
				{@const courseDetail = getCourseDetails(course?.courseUuid)}
				{@const progressPercentage = getProgress(course?.courseUuid)}

				<div
					class="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 h-full flex flex-col"
					on:click={handleGoToCourseDetails(course?.courseUuid)}
				>
					<!-- Progress Bar -->
					<div class="h-1 bg-gray-100 w-full">
						<div class="h-full bg-[#3DC2EE] " style="width: {progressPercentage}%"></div>
					</div>

					<div class="p-5 flex-1 flex flex-col">
						<!-- Header Section -->
						<div class="flex justify-between items-start mb-4">
							<div class="flex-1">
								<!-- Status and Category -->
								<div class="flex-col bp-420px:flex-row flex bp-420px:items-center mb-2 gap-2 w-fit">
									<span
										class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit {course?.status ===
										1
											? 'bg-green-100 text-green-800'
											: 'bg-gray-10 text-darkGray'}"
									>
										{course.status === 1 ? $_('Active') : $_('Inactive')}
									</span>
									{#if courseDetail?.category}
										<span
											class="text-xs text-darkGray capitalize px-2 py-0.5 rounded bg-gray-10 w-fit"
											>{courseDetail?.category}</span
										>
									{/if}
								</div>

								<!-- Course Name and ID -->
								<h3 class="heading-L" title={courseDetail.name}>
									{courseDetail?.name}
								</h3>
								{#if courseDetail.courseId !== 'N/A'}
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
								<p
									class="text-xs sm:text-sm text-darkGray leading-loose sm:leading-relaxed line-clamp-2"
								>
									{courseDetail?.description}
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div class="bg-white p-4 rounded-lg text-center">
			<ErrorComponent
				errorMessage={!hasEnrolledCourses
					? $_('You havent enrolled in any courses yet. Start your learning journey today!')
					: $_('Data not found')}
			/>
			<a
				href="/courses"
				class="mt-4 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium"
			>
				{$_('Browse Available Courses')}
			</a>
		</div>
	{/if}
</div>