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
	import YoutubePlayer from '$lib/Components/YoutubePlayer.svelte';
	import { page } from '$app/stores';
	import { categoryList as courseCategoryList } from '$lib/data.js';
	import { extractYouTubeVideoId } from '$lib/utils/helper.js';

	export let params;
	export let route;
	export let courseDetails = {};
	export let courseStats = {};
	const lang = $page.data?.lang ? $page.data.lang : 'en';
	const courseCategory = courseDetails.category;
	const languageWiseCategories = courseCategoryList[lang];

	$: setTotalVideoDuration(courseStats);

	let error = null;
	let courseStatsDetails = [];
	let loading = false;

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
				statValue: courseStats?.courseDuration? courseStats?.courseDuration + ' ' + $_('Days') : null,
				iconSvg: '/courseDurationIcon.svg'
			},
			{
				statName: 'Students',
				statValue: courseStats?.numberOfStudents,
				iconSvg: '/studentsIcon.svg'
			}
		];
	}

	onMount(async () => {
		setLocalStoreData('courseTitle', courseDetails?.title);
	});
</script>

{#if loading}
	<AboutCourseSkeletonComponent />
{/if}

{#if !loading && error === null}
	<div
		class=" bg-blue-10 px-8 pt-4 pb-8 mb-8 mt-0 lg:mb-9 lg:mt-0 lg:px-[92px] lg:pb-9 lg:pt-6 lg:min-h-40"
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
					<div class="text-primary">
						<h2 class="uppercase-headers capitalize">
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
					<div>
						<p
							class="text-xs sm:text-sm text-darkGray mb-4 line-clamp-3 leading-6"
							title={courseDetails?.description ?? ''}
						>
							{courseDetails?.description ?? ''}
						</p>
					</div>
				</div>

				<div class="hidden lg:block">
					<CourseStats bgColor="white border border-gray-50" {courseStatsDetails} />
				</div>
				<div class="block lg:hidden">
					<GeneralStats
						bgColor="white"
						generalStats={courseStatsDetails}
						column={'single'}
						alignment={'center'}
						{loading}
						{error}
					/>
				</div>
			</div>
			<div class=" mb-4 lg:mb-0 lg:w-3/5 md:justify-self-center flex items-end">
				{#if courseDetails.aboutVideoExtid}
					<YoutubePlayer
						videoId={courseDetails.aboutVideoUrl
							? extractYouTubeVideoId(courseDetails.aboutVideoUrl)
							: 'null'}
					/>
					{:else}
					<img src={courseDetails.imageUrl} alt="course thumbnail" class="rounded-lg grayscale" />
				{/if}
			</div>
		</div>
	</div>
{:else if error != null}
	<ErrorMessage {error} />
{/if}
