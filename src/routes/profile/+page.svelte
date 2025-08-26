<script>
	import { onMount } from 'svelte';
	import TraineeProfileCard from '$lib/traineeProfile/TraineeProfileCard.svelte';
	import { page } from '$app/stores';
	import { categoryList } from '$lib/data.js';
	import { _ } from 'svelte-i18n';
	import { setAuthStatus } from '$lib/utils/helper';
	let route = $page.route.id;
	let params = $page.params;

	export let data;

	let { profileData, lang, unauthorized } = data;
	let courseDetails = {};

	onMount(() => {
		if (profileData) {
			fetchCourseDetails();
		}
	});

	async function fetchCourseDetails() {
		try {
			const response = await fetch('apis/courses');

			if (!response.ok) {
				throw new Error('Failed to fetch course details');
			}

			const courses = await response.json();

			if (!courses || !courses.length || courses?.error) {
				throw new Error('No courses found');
			}

			// Creating a HashMap for quick lookup
			const courseMap = {};
			for (const course of courses) {
				if (!lang) continue; // Ensure lang exists before accessing categoryList[lang]

				const translation = course?.translations?.find((t) => t?.languageCode === lang) || {};

				courseMap[course?.uuid] = {
					name: translation?.title || 'No Title',
					category: categoryList[lang]?.[course.category]
						? `${categoryList[lang][course.category]} ${$_('Programme')}`
						: 'Unknown',
					courseId: course?.displayCourseCode || 'N/A',
					description: translation?.description || 'No Description',
					chapters: course?.numberOfChapters || 0,
					centers: course?.numberOfVideos || 0
				};
			}

			// Creating the final object based on trainee data
			let result = {};
			if (profileData?.traineeRsetis?.length) {
				for (const traineeCourse of profileData?.traineeRsetis) {
					if (courseMap[traineeCourse?.courseUuid]) {
						result[traineeCourse.courseUuid] = courseMap[traineeCourse.courseUuid];
					}
				}
			}

			courseDetails = result;
		} catch (error) {
			console.error('Error fetching course details:', error);
			courseDetails = {};
		}
	}

	onMount(() => {
		setAuthStatus(unauthorized);
	});
</script>

<div class="lg:mx-[92px] mx-4 my-8 mt-0 lg:mb-9 lg:mt-0">
	<div>
		<TraineeProfileCard {route} {params} traineeDetailsData={profileData} {courseDetails} />
	</div>
</div>
