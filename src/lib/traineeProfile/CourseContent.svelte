<script>
	import { _ } from 'svelte-i18n';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import OpenBook from '$lib/svgComponents/OpenBook.svelte';
	import TraineeCourseCard from '$lib/traineeProfile/TraineeCourseCard.svelte';

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

	// Derived values
	$: hasEnrolledCourses = Array.isArray(traineeRsetis) && traineeRsetis?.length > 0;
</script>

<div>
	<h2 class="mb-6 flex items-center gap-2">
		<OpenBook />
		<span class="heading-L">{$_('EnrolledCourses')}</span>
	</h2>

	{#if hasEnrolledCourses && Object.keys(courseDetails).length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each traineeRsetis as course (course?.courseUuid)}
				<TraineeCourseCard
					course={course}
					courseDetail={getCourseDetails(course?.courseUuid)}
					progressPercentage={getProgress(course?.courseUuid)}
				/>
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
			<a href="/courses" class="mt-4 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium">
				{$_('Browse Available Courses')}
			</a>
		</div>
	{/if}
</div>
