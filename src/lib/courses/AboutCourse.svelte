<script>
	import { onMount, onDestroy } from 'svelte';
	import { formatDurationHHMM } from '$lib/utils/helper.js';
	import { setLocalStoreData } from '$lib/utils/helper.js';
	import ErrorMessage from '$lib/courses/ErrorMessage.svelte';
	import CourseStats from '$lib/courses/CourseStats.svelte';
	import AboutCourseSkeletonComponent from '$lib/courses/AboutCourseSkeletonComponent.svelte';
	import BreadCrumbs from '$lib/breadCrumbs/BreadCrumbs.svelte';
	import GeneralStats from '$lib/landingPage/GeneralStats.svelte';
	import { _ } from 'svelte-i18n';
	import VideoPlayer from '$lib/Components/VideoPlayer.svelte';
	import { page } from '$app/stores';
	import { categoryList as courseCategoryList } from '$lib/data.js';
	import { extractYouTubeVideoId } from '$lib/data.js';
	import { languageMap, languageOrder } from '/src/config/constants.js';
	import { user } from '/src/stores';
	export let params;
	export let route;
	export let courseDetails = {};
	export let courseStats = {};
	export let introVideos = [];
	const lang = $page.data?.lang ? $page.data.lang : 'en';
	const courseCategory = courseDetails.category;
	const languageWiseCategories = courseCategoryList[lang];
	let languageAvailableForIntroVideos = [];
	let selectedLanguage = null;
	let error = null;
	let courseStatsDetails = [];
	let loading = false;

	let isDescriptionExpanded = false;
	let showToggle = false;
	let descriptionElement;

	$: setTotalVideoDuration(courseStats);

	$: if (introVideos?.length > 0) {
		setAvailableLanguages();
	}

	function toggleDescription() {
		isDescriptionExpanded = !isDescriptionExpanded;
	}

	async function setAvailableLanguages() {
		if (introVideos?.error || introVideos?.length === 0) {
			languageAvailableForIntroVideos = [];
			selectedLanguage = null;
			return;
		}

		languageAvailableForIntroVideos = introVideos
			?.map((video) => {
				if (video?.languageCode)
					return {
						code: video?.languageCode,
						name: languageMap[video?.languageCode] || video?.languageCode,
						url: video?.videoUrl,
						extId: video?.videoExtId
					};
			})
			.filter(Boolean)
			.sort((a, b) => {
				const indexA = languageOrder.indexOf(a.code);
				const indexB = languageOrder.indexOf(b.code);

				// If a code is not in the order list, place it at the end
				return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
			});

		const englishVideo = languageAvailableForIntroVideos?.find((v) => v.code === 'en');
		const hindiVideo = languageAvailableForIntroVideos?.find((v) => v.code === 'hi');
		selectedLanguage = englishVideo || hindiVideo || languageAvailableForIntroVideos[0] || null;
	}

	function setTotalVideoDuration() {
		// if (Object.keys(courseStats)?.length === 0) return;
		courseStatsDetails = [
			{
				statName: 'Chapters',
				statValue: courseStats?.totalChapters,
				iconSvg: '/videoIcon.svg'
			},
			{
				statName: 'TrainingCenters',
				statValue: courseStats?.totalRsetis,
				iconSvg: '/learningCentersIcon.svg'
			},
			{
				statName: 'CourseDuration',
				statValue: courseStats?.courseDuration
					? courseStats?.courseDuration + ' ' + $_('Days')
					: null,
				iconSvg: '/courseDurationIcon.svg'
			},
			{
				statName: 'Students',
				statValue: courseStats?.numberOfStudents || 'N/A',
				iconSvg: '/studentsIcon.svg'
			}
		];
	}

	function handleSelectedLanguage(language) {
		selectedLanguage = language;
	}

	onMount(async () => {
		setLocalStoreData('courseTitle', courseDetails?.title);
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
		class="  px-4 pt-4 pb-4 sm:px-9 sm:py-12 sm:pt-6 mb-8 rounded-lg text-darkGray bg-blue-20 lg:min-h-40"
	>
		<div class="pb-6 lg:pb-6">
			<BreadCrumbs {route} {params} />
		</div>
		<div
			class=" flex flex-col-reverse sm:flex-col-reverse md:flex-col-reverse
 			lg:flex-row xl:flex lg:gap-6 xl:gap-8"
		>
			<div
				class={`flex flex-col justify-between gap-0 w-full md:w-full sm:gap-4 md:gap-4 ${courseDetails.aboutVideoExtid ? 'lg:w-2/3' : ''}`}
			>
				<div>
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
						<div>
							<p
								bind:this={descriptionElement}
								class="text-xs sm:text-sm text-darkGray leading-6"
								class:line-clamp-3={!isDescriptionExpanded}
								title={courseDetails?.description ?? ''}
							>
								{courseDetails?.description ?? ''}
							</p>
							{#if showToggle}
								<button on:click={toggleDescription} class="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline">
									{#if isDescriptionExpanded}
										{$_('show less')}
									{:else}
										{$_('show more')}
									{/if}
								</button>
							{/if}
						</div>
					{/if}
				</div>
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

				<!-- <div class="hidden lg:block">
					<CourseStats bgColor="white" {courseStatsDetails} />
				</div> -->
				<!-- <div class="block lg:hidden">
					<GeneralStats
						bgColor="white"
						generalStats={courseStatsDetails}
						column={'single'}
						alignment={'center'}
						{loading}
						{error}
					/>
				</div> -->
			</div>
			<div class=" mb-4 lg:mb-0 lg:w-3/5 md:justify-self-center flex items-start">
				<!-- {#if courseDetails.aboutVideoExtid}
					<VideoPlayer
						videoId={courseDetails.aboutVideoExtid ? courseDetails.aboutVideoExtid : 'null'}
						courseCode={courseDetails.courseCode ? courseDetails.courseCode : ''}
					/> -->

				{#if selectedLanguage}
					<VideoPlayer videoId={extractYouTubeVideoId(selectedLanguage.url)} />
				{:else}
					<img
						src={courseDetails.imageUrl}
						alt="course thumbnail"
						class="rounded-lg aspect-square sm:max-w-[280px] lg:mx-auto lg:mb-4"
					/>
				{/if}
			</div>
		</div>
		<div class="">
			<CourseStats
				bgColor="white"
				generalStats={courseStatsDetails}
				column={'single'}
				alignment={'center'}
				{loading}
				{error}
			/>
		</div>
	</div>
{:else}
	<div
		class="  px-4 pt-4 pb-4 sm:px-9 sm:py-12 sm:pt-6 mb-8 rounded-lg text-darkGray bg-blue-20 lg:min-h-40"
	>
		<ErrorMessage error={$_('Failed to load course details')} />
	</div>
{/if}
