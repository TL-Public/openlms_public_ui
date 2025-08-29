<script>
	export let data;
	import { onMount } from 'svelte';
	import VideoPlayer from '$lib/Components/VideoPlayer.svelte';
	import Spinner from '$lib/Components/Spinner.svelte';
	import { user } from '/src/stores';
	import Filter from '$lib/Components/Filter.svelte';
	import { goto } from '$app/navigation';
	import { extractYouTubeVideoId } from '$lib/data.js';

	const { allCoursesData } = data;

	const courseWithVideos = allCoursesData?.filter((course) => course.numberOfVideos > 0);

	let courseOptionList = [{ uuid: '0', title: 'All Courses' }, ...courseWithVideos];
	let selectedCourseCode = '';
	let userSelectedCourse = courseOptionList[0].title;
	let fetchedCourses = [];

	let mapOfVideos = {};
	let newVideo = {};
	$: showClearAll = isCreating === false && videoInstances?.length > 0;

	function createVideoMap(videos) {
		const videoMap = {};

		videos.forEach((video) => {
			const videoId = video.uuid;
			videoMap[videoId] = video;
		});

		return videoMap;
	}

	function getRandomVideo(videoMap) {
		// Get an array of all the UUIDs (keys) in the map
		const videoIds = Object.keys(videoMap);

		// Generate a random index within the range of the UUIDs array
		const randomIndex = Math.floor(Math.random() * videoIds.length);

		const randomVideoId = videoIds[randomIndex];

		return videoMap[randomVideoId];
	}

	async function getRandomCourseDetails(courses) {
		if (courses.length === 0) {
			console.error('No courses available.');
			return;
		}

		// Select a random course from the array

		let randomIndex = Math.floor(Math.random() * courses.length);

		if (fetchedCourses.includes(randomIndex)) {
			return;
		}
		const randomCourse = courses[randomIndex];

		try {
			const response = await fetch(`/apis/courses/details/${randomCourse.uuid}`); // Replace with your actual API endpoint

			if (!response.ok) {
				throw new Error(`Failed to fetch course details: ${response.status}`);
			}

			const courseDetails = await response.json();
			fetchedCourses.push(randomIndex);

			courseDetails.chapters?.forEach((item) => {
				if (item.videos?.length > 0) {
					const videoMapOfCourse = createVideoMap(item.videos);
					mapOfVideos = { ...mapOfVideos, ...videoMapOfCourse };
				}
			});
		} catch (error) {
			console.error('Error fetching course details:', error);
		}
	}

	let instanceCount = 0; // User-specified number of players
	let videoInstances = []; // Array to hold video player instances
	let timer; // Reference to the interval timer
	let isCreating = false; // Flag to check if creation is in progress

	$:console.log('videoInstances', videoInstances)

	// async function updateQueryParam(courseCode) {
	// 	const url = new URL(window.location.href);
	// 	url.searchParams.set('trk_channelname', courseCode);
	// 	await goto(url.pathname + url.search, { replaceState: true });
	// }

	async function handleSubmit(e) {
		e.preventDefault();
		if (selectedCourseCode) {
			// await updateQueryParam(selectedCourseCode);
		} else {
			const url = new URL(window.location.href);
			await goto(url.pathname, { replaceState: true });
		}
		startCreatingPlayers();
	}

	async function startCreatingPlayers() {
		if (instanceCount <= 0 || instanceCount > 100) {
			alert('Please enter a valid number between 1 and 100!');
			return;
		}

		videoInstances = []; // Clear existing players
		let createdInstances = 0;
		isCreating = true;

		// Clear any previous timer
		if (timer) clearInterval(timer);

		timer = setInterval(async () => {
			if (createdInstances < instanceCount) {
				//call api for videodetails

				const selectedCourse = selectedCourseCode
					? courseWithVideos.filter((item) => (item.courseCode == selectedCourseCode))
					: courseWithVideos;

				await getRandomCourseDetails(selectedCourse);

				newVideo = getRandomVideo(mapOfVideos);

				if (newVideo) {
					videoInstances = [...videoInstances, newVideo];
					createdInstances++;
				}
			} else {
				stopCreatingPlayers();
			}
		}, 2000);
	}

	function stopCreatingPlayers() {
		if (timer) clearInterval(timer);
		isCreating = false;
	}
	function handleClearAll() {
		stopCreatingPlayers();
		videoInstances = [];
		instanceCount = 0;
		selectedCourseCode = '';
		userSelectedCourse = courseOptionList[0].title;
	}

</script>

<div class="px-12">
	<div class=" bg-white50 rounded-lg md:px-12 px-4 pb-4 md:pb-12 pt-4 shadow-sm">
		<h1 class="text-2xl text-primary font-bold mb-4">Load testing Page</h1>
		<form action="" class="">
			<div class="mb-4 max-w-80">
				<p class="text-sm">Select a course</p>
				<Filter
					optionList={courseOptionList}
					optionListConfigObject={{ optionNameKey: 'title', optionIdKey: 'uuid' }}
					on:filterItemSelected={(e) => {
						selectedCourseCode = e.detail.courseCode;
					}}
					bind:itemSelected={userSelectedCourse}
				/>
			</div>
			<div class="mb-4">
				<label for="user-input" class="text-sm mb-1"
					>Please enter the number of video player instances to be created :</label
				>
				<div class="flex items-center gap-2 flex-wrap">
					<input
						type="number"
						id="user-input"
						class="max-w-60 h-8 inline-block p-2"
						bind:value={instanceCount}
					/>
					<button type="submit" class="primary-btn" on:click={handleSubmit}>Submit</button>
					{#if showClearAll}
						<button
							type="submit"
							class="primary-btn !bg-blue-10 !text-primary border border-gray-50"
							on:click={handleClearAll}>Reset</button
						>
					{/if}
				</div>
			</div>
		</form>
		{#if isCreating}
			<div class="flex gap-4">
				<div class="flex gap-2 items-center">
					<Spinner borderWidth={'6px'} size={'20px'} />
					<p>Loading video players...</p>
				</div>
				<button class="primary-btn !bg-red-600" on:click={stopCreatingPlayers}>Stop</button>
			</div>
		{/if}
	</div>

	{#if videoInstances.length > 0}
		<div class="text-darkGray font-medium my-2">
			Number of instances created: {videoInstances.length} out of {instanceCount}
		</div>
	{/if}

	<div class="players grid md:grid-cols-3 grid-cols-1 gap-2">
		{#each videoInstances as instance}
			<VideoPlayer videoId={extractYouTubeVideoId(instance.url)} autoplay={true} muted />
		{/each}
	</div>
</div>
