<script>
	import { _, t } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { formatDurationHHMM } from '$lib/utils/helper.js';
	import { createEventDispatcher } from 'svelte';
	import SingleStats from '$lib/landingPage/loggedInView/SingleStats.svelte';
	import HorizontalScroll from '$lib/landingPageCourses/horizontalScroll.svelte';
	import Button from '$lib/Components/Button.svelte';

	export let course;
	export let lang = 'en';

	let courseTitle = null;
	let courseDescription = null;
	let totalDuration = 0;
	let watchedDuration = 0;
	let inProgressVideos = [];
	let completedVideos = [];
	let courseProgress = null;
	let dispatch = createEventDispatcher();

	$:batchDate = course?.enrolledOn || '-';
	$:rsetiName = course?.rsetiName || '-';

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

	$: {
		if (!course?.error) {
			courseTitle = course?.translations?.find((t) => t.languageCode === lang)?.title;
			courseDescription = course?.translations?.find((t) => t.languageCode === lang)?.description;

			analyzeChapters(course?.chapters);
		}
	}

	function gotoCourseDetails() {
		goto(`courses/details/${course?.uuid}`);
	}

	async function fetchStats() {
		let response;
		try {
			response = await fetch(`/apis/courses/details/${course?.uuid}/stats`, {
				method: 'GET'
			});

			if (!response?.ok) {
				console.error('Stats not fetched');
			}

			if (response?.ok) {
				let data = await response.json();
				totalDuration = formatDurationHHMM(data?.totalVideoDuration) || null;
			}
		} catch {
			console.error('Stats not fetched');
		}
	}

	function analyzeChapters(chapters) {
		if (!chapters || !Array.isArray(chapters)) return;

		let totalVideos = 0;
		let completedCount = 0;
		let inProgressCount = 0;
		let watchedDuration = 0;

		inProgressVideos = [];
		completedVideos = [];

		const seenInProgressVideoIds = new Set();

		for (const chapter of chapters) {
			if (!chapter.videos || !Array.isArray(chapter.videos)) continue;

			for (const video of chapter.videos) {
				totalVideos++;

				video.courseDetails = {
					courseCode: course?.courseCode || null,
					courseUuid: course?.uuid || null
				};

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

		// Dispatch stats
		dispatch('stats', { watchedDuration, completedCount });

		// Progress %
		courseProgress =
			Math.round((completedCount / (course?.numberOfVideos || totalVideos)) * 100) || 0;

		// Course status logic
		if (completedCount === totalVideos && totalVideos > 0) {
			course.courseStatus = 'COMPLETED';
		} else if (inProgressCount > 0) {
			course.courseStatus = 'IN_PROGRESS';
		} else {
			course.courseStatus = 'NOT_STARTED';
		}
	}

	onMount(async () => {
		await fetchStats();
	});
</script>

<div
	class="px-4 pt-4 pb-4 sm:px-9 sm:py-12 sm:pt-6 mb-8 rounded-lg text-darkGray bg-blue-10 lg:min-h-40"
>
	<h2
		class="text-sm sm:text-base text-primary font-bold leading-normal sm:leading-2 mb-4 capitalize"
	>
		{courseTitle || '-'}
	</h2>
	<div class="flex flex-col lg:flex-row gap-6">
		<div class="flex flex-col sm:flex-row gap-6 items-start w-full lg:w-1/2">
			<div class="w-32 h-32 rounded-md flex items-center justify-center shrink-0">
				<img
					class="w-full h-full object-cover"
					src={course?.imageUrl || '/image-preview-icon.jpg'}
					alt="Trainee thumbnail"
				/>
			</div>
			<div>
				<div class="text-xs sm:text-sm text-darkGray space-y-1">
					{#if course.courseStatus === 'IN_PROGRESS' || course.courseStatus === 'NOT_STARTED'}
						<div
							class="bg-[#FFF9F5] border border-accent-hover px-2 py-1 w-fit flex gap-3 rounded-md mb-2"
						>
							<img src="/inProgress.svg" alt="" />
							<span class="text-accent text-[10px] font-medium whitespace-nowrap">{$_('IN PROGRESS')}</span>
						</div>
					{/if}
					{#if course.courseStatus === 'COMPLETED'}
						<div
							class="bg-[#F3FAF6] border border-green-600 px-2 py-1 w-fit flex gap-3 rounded-md mb-2"
						>
							<img src="/watched.svg" alt="" />
							<span class="ttext-green-700 text-[10px] font-medium whitespace-nowrap">{$_('COMPLETED')}</span>
						</div>
					{/if}
					<div>
						<span class="font-medium">{$_('Course ID')}:</span>
						<span>{course?.courseCode || '-'}</span>
					</div>
					<div>
						<span class="font-medium">{$_('RSETI')}:</span>
						<span>{course?.rsetiName || '-'}</span>
					</div>
					<div>
						<span class="font-medium">{$_('Enrolled On')}:</span>
						<span>{course?.enrolledOn || '-'}</span>
					</div>

					<p class="text-xs sm:text-sm mt-4 leading-6" title={courseDescription}>
						{courseDescription || '-'}
					</p>

					<div
						class="text-blue-500 underline hover:cursor-pointer pt-1 text-xs sm:text-sm"
						on:click={gotoCourseDetails}
					>
						{$_('View course')}
					</div>
				</div>
			</div>
		</div>
		<div class="w-full lg:w-1/2">
			<!-- Course Stats Section -->
			<div class="mb-4">
				<h3 class="text-sm font-medium mb-2 text-primary">{$_('Course Stats')}</h3>
				<div class="flex flex-wrap gap-4 text-xs sm:text-sm">
					<div class="flex items-center gap-2">
						<span>•</span>
						<span>{course?.numberOfChapters || '-'} {$_('Chapters')}</span>
					</div>
					<div class="flex items-center gap-2">
						<span>•</span>
						<span>{course?.numberOfVideos || '-'} {$_('Videos')}</span>
					</div>
					<div class="flex items-center gap-2">
						<span>•</span>
						<span>{totalDuration || '-'} {$_('total video length')}</span>
					</div>
				</div>
			</div>

			<div>
				{#if course.courseStatus === 'IN_PROGRESS' || course.courseStatus == 'NOT_STARTED'}
					<h3 class="text-sm font-medium mb-2 text-primary">{$_('My Progress')}</h3>

					<div
						class="grid grid-cols-1 sm:grid-cols-2 bp-900px:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-auto"
					>
						<div class="bg-white rounded-lg p-4 shadow-sm w-full">
							<div class="flex justify-between items-center mb-2">
								<h4 class="text-xs font-medium text-darkGray">{$_('Course progress')}</h4>
								<span class="text-sm font-bold text-primary">{courseProgress || '0'}%</span>
							</div>
							<div class="w-full bg-gray-100 rounded-full h-1 mb-2">
								<div class="bg-accent-dark h-1 rounded-full" style="width: {courseProgress}%"></div>
							</div>
							<div class="flex flex-col sm:flex-row sm:justify-between gap-1">
								<p class="text-xs text-gray-500">
									{completedVideos?.length || 0} / {course.numberOfVideos || '-'}
									{$_('videos completed')}
								</p>
							</div>
						</div>

						{#each statsList as stat}
							<SingleStats stats={stat} alignment="left" />
						{/each}
					</div>
					<p class="text-xs text-gray-500 mt-3">
						{$t('batchRankNote',{values: { batchDate, rsetiName }})}
					</p>
				{:else if course.courseStatus === 'COMPLETED'}
					<div class="w-fit">
						<SingleStats
							alignment="left"
							stats={{
								statValue: $_('Course Completed'),
								statName: $_('Completed on') + ': N/A',
								iconSvg: '/medal.svg'
							}}
						/>
						<!-- <div class="mt-2">
							<Button>{$_('Download Certificate')}</Button>
						</div> -->
					</div>
				{/if}
			</div>
		</div>
	</div>
	{#if inProgressVideos?.length > 0}
		<hr class="my-6 text-darkGray" />
		<div>
			<h3 class="text-sm font-medium mb-2 text-primary">{$_('In Progress Videos')}</h3>
			<HorizontalScroll
				cardsData={inProgressVideos}
				componentType={'videos'}
				scrollClientWidth={true}
				scrollCardWidth={false}
				scrollWidthMultiplier={1}
				componentWidth="450"
				showProgressIcons={false}
			/>
		</div>
		<a
			href="/courses/details/{course?.uuid}"
			class="text-blue-500 underline hover:cursor-pointer text-xs mt-2 flex justify-end"
			>{$_('View all videos')}</a
		>
	{/if}
</div>
