<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { formatDurationHHMM, setLocalStoreData } from '$lib/utils/helper.js';
	import ErrorMessage from '$lib/courses/ErrorMessage.svelte';
	import AboutCourseSkeletonComponent from '$lib/courses/AboutCourseSkeletonComponent.svelte';
	import BreadCrumbs from '$lib/breadCrumbs/BreadCrumbs.svelte';
	import VideoPlayer from '$lib/Components/VideoPlayer.svelte';
	import { categoryList as courseCategoryList, extractYouTubeVideoId } from '$lib/data.js';
	import { languageMap, languageOrder, languageArray } from '/src/config/constants.js';
	import { _, t } from 'svelte-i18n';
	import MyProgress from '$lib/courses/MyProgress.svelte';

	// Props
	export let params;
	export let route;
	export let courseDetails = {};
	export let courseStats = {};
	export let introVideos = [];
	export let traineeDetailsData = {};
	export let traineeCourses = [];
	export let centersData = [];

	let loading = false;
	let isDescriptionExpanded = false;
	let showToggle = false;
	let descriptionElement;

	const lang = $page.data?.lang || 'en';
	const courseCategory = courseDetails.category;
	const languageWiseCategories = courseCategoryList[lang];

	let languageAvailableForIntroVideos = [];
	let selectedLanguage = null;

	let progressData = {
		courseProgress: null,
		completedCount: null,
		inProgressVideosCount: null,
		totalVideosCount: null,
		batchRank: null,
		watchedDuration: null,
		timeLeft: null
	};

	let statsList = [
		{
			statValue: null,
			statName: $_('Batch Rank'),
			iconSvg: '/traineesEnrolledIcon.svg'
		},
		{
			statValue: null,
			statName: $_('Watch Time'),
			iconSvg: '/traineesEnrolledIcon.svg'
		},
		{
			statValue: null,
			statName: $_('In-progress Videos'),
			iconSvg: '/traineesEnrolledIcon.svg'
		}
	];

	$: if (introVideos?.length > 0) {
		setAvailableLanguages();
	}

	function toggleDescription() {
		isDescriptionExpanded = !isDescriptionExpanded;
	}

	function setAvailableLanguages() {
		if (!introVideos || introVideos.error || introVideos.length === 0) {
			languageAvailableForIntroVideos = [];
			selectedLanguage = null;
			return;
		}

		languageAvailableForIntroVideos = introVideos
			.map((video) => {
				if (video?.languageCode) {
					return {
						code: video.languageCode,
						name: languageMap[video.languageCode] || video.languageCode,
						url: video.videoUrl,
						extId: video.videoExtId
					};
				}
			})
			.filter(Boolean)
			.sort((a, b) => {
				const indexA = languageOrder.indexOf(a.code);
				const indexB = languageOrder.indexOf(b.code);
				return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
			});

		const englishVideo = languageAvailableForIntroVideos.find((v) => v.code === 'en');
		const hindiVideo = languageAvailableForIntroVideos.find((v) => v.code === 'hi');
		let preferredVideo = null;
		let preferredLanguageCode = null;

		if ($page?.data?.user?.isAuthenticated) {
			preferredLanguageCode = traineeDetailsData?.videoPreferredLanguage;
			preferredVideo = languageAvailableForIntroVideos.find(
				(v) => v.code === preferredLanguageCode
			);

			if (preferredVideo) {
				selectedLanguage = preferredVideo;
			} else {
				selectedLanguage = englishVideo || hindiVideo || languageAvailableForIntroVideos[0] || null;
			}
		} else {
			selectedLanguage = englishVideo || hindiVideo || languageAvailableForIntroVideos[0] || null;
		}
	}

	function handleSelectedLanguage(language) {
		selectedLanguage = language;
	}

	async function analyzeChapters(chapters) {
		if (!chapters || !Array.isArray(chapters)) return;

		let totalVideos = 0;
		let completedCount = 0;
		let inProgressCount = 0;
		let watchedDuration = 0;

		let inProgressVideos = [];
		let completedVideos = [];

		const seenInProgressVideoIds = new Set();

		for (const chapter of chapters) {
			if (!chapter.videos || !Array.isArray(chapter.videos)) continue;

			for (const video of chapter.videos) {
				totalVideos++;

				// Watched duration
				if (
					typeof video.watchedDuration === 'number' ||
					typeof video.watchedDuration === 'string'
				) {
					watchedDuration += Number(video.watchedDuration);
				}

				// Progress status
				if (video.progressStatus === 'IN_PROGRESS') {
					const id = video.uuid;
					if (!seenInProgressVideoIds.has(id)) {
						inProgressVideos.push(video);
						seenInProgressVideoIds.add(id);
						inProgressCount++;
					}
				} else if (video.progressStatus === 'COMPLETED') {
					completedVideos.push(video);
					completedCount++;
				}
			}
		}

		// Stats list
		statsList = [
			{
				statValue: null,
				statName: $_('Batch Rank'),
				iconSvg: '/traineesEnrolledIcon.svg'
			},
			{
				statValue: formatDurationHHMM(watchedDuration) || null,
				statName: $_('Watch Time'),
				iconSvg: '/traineesEnrolledIcon.svg'
			},
			{
				statValue: inProgressVideos?.length || '0',
				statName: $_('In-progress Videos'),
				iconSvg: '/traineesEnrolledIcon.svg'
			}
		];

		// Progress %
		progressData.courseProgress =
			Math.round((completedCount / (courseDetails?.numberOfVideos || totalVideos)) * 100) || 0;

		progressData.totalVideosCount = totalVideos;
		progressData.inProgressVideosCount = inProgressCount;
		progressData.completedCount = completedCount;
		progressData.watchedDuration = watchedDuration;
		progressData.timeLeft =
			Number(courseStats?.totalVideoDuration) - Number(watchedDuration) || null;
		progressData.totalDuration = courseStats?.totalVideoDuration;

		// Course status logic
		if (completedCount === totalVideos && totalVideos > 0) {
			courseDetails.courseStatus = 'COMPLETED';
		} else if (inProgressCount > 0) {
			courseDetails.courseStatus = 'IN_PROGRESS';
		} else {
			courseDetails.courseStatus = 'NOT_STARTED';
		}
	}

	async function getEnrichedCurrentCourse() {
		if (
			!traineeCourses ||
			!traineeDetailsData?.traineeRsetis ||
			!centersData ||
			centersData?.error ||
			traineeCourses?.error
		) {
			return null;
		}

		try {
			const rsetiList = centersData;

			// Step 1: Find the current course from traineeCourses
			const enrolledCourse = traineeCourses.find((course) => course.uuid === courseDetails?.uuid);
			if (!enrolledCourse) return null;

			// Step 2: Get corresponding traineeRseti
			const traineeRseti = traineeDetailsData.traineeRsetis.find(
				(r) => r.courseUuid === enrolledCourse.uuid
			);

			// Step 3: Get RSETI name
			const rseti = rsetiList.find((r) => r.uuid === traineeRseti?.rsetiUuid);
			const rsetiName = rseti?.translations?.find((t) => t.languageCode === lang)?.name;

			// Step 4: Return enriched course
			return {
				...courseDetails,
				rsetiName,
				enrolledOn: traineeRseti?.enrolledOn || null
			};
		} catch (err) {
			console.error('Error enriching current course with RSETI data', err);
			return null;
		}
	}

	onMount(async () => {
		setLocalStoreData('courseTitle', courseDetails?.title);
		if (courseDetails && !courseDetails?.error) {
			await analyzeChapters(courseDetails.chapters);
		}
		const enrichedCourse = await getEnrichedCurrentCourse();
		if (enrichedCourse) {
			courseDetails = { ...enrichedCourse };
		}

		if (descriptionElement) {
			// Check if the content is overflowing
			// clientHeight is the visible height, scrollHeight is the total height
			if (descriptionElement.scrollHeight > descriptionElement.clientHeight) {
				showToggle = true;
			}
		}
	});
</script>

{#if loading}
	<AboutCourseSkeletonComponent />
{/if}

{#if Object?.keys(courseDetails)?.length > 0}
	<div
		class="px-4 pt-4 pb-4 sm:px-9 sm:py-12 sm:pt-6 mb-8 rounded-lg text-darkGray bg-blue-20 lg:min-h-40"
	>
		<div class="pb-6 lg:pb-6">
			<BreadCrumbs {route} {params} />
		</div>
		<div
			class="flex flex-col-reverse sm:flex-col-reverse md:flex-col-reverse
            lg:flex-row xl:flex lg:gap-6 xl:gap-8"
		>
			<div
				class={`flex flex-col justify-between gap-0 w-full md:w-full sm:gap-4 md:gap-4 ${courseDetails.aboutVideoExtid ? 'lg:w-2/3' : ''}`}
			>
				<div class="">
					<div>
						<h2
							class="text-base sm:text-2xl text-primary font-bold leading-normal sm:leading-2 pb-4 lg:pb-3 capitalize"
						>
							{courseDetails?.title ?? ''}
						</h2>
						<p class="text-sm font-semibold pb-0.5 capitalize">
							{$_('Category')} :
							<span class="capitalize">
								{languageWiseCategories && courseCategory
									? languageWiseCategories[courseCategory]
									: '-'}
							</span>
						</p>
						<p class="text-sm mb-4 md:mb-4 sm:mb-3 font-semibold">
							{$_('CourseId')}:
							<span class="capitalize">
								{courseDetails?.displayCourseCode ?? ''}
							</span>
						</p>
					</div>
					{#if courseDetails?.description}
						<div class="mb-4">
							<p
								bind:this={descriptionElement}
								class="text-xs sm:text-sm text-darkGray leading-6"
								class:line-clamp-3={!isDescriptionExpanded}
								title={courseDetails?.description ?? ''}
							>
								{courseDetails?.description ?? ''}
							</p>
							{#if showToggle}
								<button
									on:click={toggleDescription}
									class="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline"
								>
									{#if isDescriptionExpanded}
										{$_('show less')}
									{:else}
										{$_('show more')}
									{/if}
								</button>
							{/if}
						</div>
					{/if}

					{#if languageAvailableForIntroVideos?.length > 0}
						<div>
							<p class="text-xs sm:text-sm mb-2">
								{$_('Available Languages for Introductory video')}:
							</p>
							<div class="flex gap-1 mb-4 flex-wrap items-center">
								{#each languageAvailableForIntroVideos as language}
									<button
										class="px-1 py-1 border rounded text-xs min-w-[90px]"
										on:click={() => handleSelectedLanguage(language)}
										class:bg-primary={selectedLanguage?.code === language?.code}
										class:text-white={selectedLanguage?.code === language?.code}
										class:bg-white={selectedLanguage?.code !== language?.code}
									>
										{language?.name}
									</button>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Course Stats Section -->
					<div class="mb-4">
						<h3 class="text-sm font-bold mb-2 text-primary">{$_('Course Stats')}</h3>
						<div class="flex flex-wrap gap-4 text-xs sm:text-sm">
							<div class="flex items-center gap-2">
								<span>•</span>
								<span>{courseDetails?.numberOfChapters || '-'} {$_('Chapters')}</span>
							</div>
							<div class="flex items-center gap-2">
								<span>•</span>
								<span>{courseDetails?.numberOfVideos || '-'} {$_('Videos')}</span>
							</div>
							<div class="flex items-center gap-2">
								<span>•</span>
								<span>
									{Object.keys(courseStats)?.length > 0
										? formatDurationHHMM(courseStats?.totalVideoDuration)
										: '-'}
									{$_('total video length')}</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="lg:mb-0 mb-4 lg:w-3/5 md:justify-self-center flex flex-col items-start">
				<!-- Video Player -->
				<div class="w-full">
					{#if selectedLanguage}
						<VideoPlayer videoId={extractYouTubeVideoId(selectedLanguage.url)} />
					{:else}
						<img
							src={courseDetails.imageUrl || '/placeholder.svg'}
							alt="course thumbnail"
							class="rounded-lg aspect-square sm:max-w-[280px] lg:mx-auto lg:mb-4"
						/>
					{/if}
				</div>
			</div>
		</div>

		<!-- My Progress Section -->
		{#if !traineeDetailsData?.error}
			<MyProgress {progressData} {statsList} {courseDetails} />
		{:else}
			<ErrorMessage error={$_('Failed to fetch trainee progress')} />
		{/if}
	</div>
{:else}
	<ErrorMessage error={$_('Failed to load course details')} />
{/if}
