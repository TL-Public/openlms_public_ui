<script>
	import AboutCourse from '$lib/courses/AboutCourse.svelte';
	import CourseSection from '$lib/courses/CourseSection.svelte';
	import { page } from '$app/stores';
	import TestimonialSection from '$lib/landingPage/TestimonialSection.svelte';
	import { _, locale } from 'svelte-i18n';
	import { setAuthStatus } from '$lib/utils/helper';
	import { onMount } from 'svelte';
	import AboutCourseLoggedIn from '$lib/courses/AboutCourseLoggedIn.svelte';

	export let data;

	const {
		courseDetails,
		rsetiOfCourse,
		videos,
		lang,
		courseStats,
		testimonials,
		introVideos,
		traineeCourses,
		traineeDetailsData
	} = data;

	const { centersData, statesData } = rsetiOfCourse;
	let route = $page.route.id;
	let params = $page.params;

	let traineeTestimonialConfig = {
		heading: 'TraineeTestimonials',
		size: 'base',
		showLink: false
	};

	function isEnrolledCourse() {
		if (!traineeCourses || traineeCourses?.error) return false;

		return traineeCourses.some((tc) => tc.uuid === courseDetails?.uuid);
	}

	onMount(() => {
		setAuthStatus(data?.unauthorized);
	});
</script>

<div class="lg:mx-[92px] mx-4 my-8 mt-0 lg:mb-9 lg:mt-0">
	{#if data?.user?.isAuthenticated && isEnrolledCourse()}
		<AboutCourseLoggedIn {params} {route} {courseDetails} {courseStats} {introVideos} {centersData} {traineeDetailsData} {traineeCourses}/>
	{:else}
		<AboutCourse {params} {route} {courseDetails} {courseStats} {introVideos} />
	{/if}
	<div class="mt-4 mb-8">
		<CourseSection
			{params}
			chapters={courseDetails?.chapters ?? []}
			courseUuid={courseDetails?.uuid}
			{courseDetails}
			{centersData}
			{statesData}
			{lang}
			{traineeDetailsData}
		/>
	</div>
	{#if testimonials && Array.isArray(testimonials) && testimonials?.length > 0}
		<TestimonialSection {testimonials} {lang} {traineeTestimonialConfig} />
	{/if}
</div>
