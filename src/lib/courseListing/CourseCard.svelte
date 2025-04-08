<script>
	import CourseCardSkeleton from '$lib/courseListing/CourseCardSkeleton.svelte';
	import { formatDurationHHMM } from '$lib/utils/helper.js';
	import { categoryList } from '$lib/data.js';
	import { _ } from 'svelte-i18n';
	import { formatDateMMMYYYY } from '$lib/utils/helper.js';
	import GoogleMatrialIcon from '$lib/Components/GoogleMatrialIcon.svelte';

	export let course;
	export let showPlannedDate = false;
	$: formattedTime = formatDurationHHMM(course?.duration * 60 ?? 0);
	$: numberOfChapters = course?.numberOfChapters;
	$: chapterText = numberOfChapters == 1 ? $_('Chapter') : $_('Chapters');
	let isLoading = false;
</script>

{#if isLoading}
	<CourseCardSkeleton />
{:else}
	<a href={`/courses/details/${course?.uuid}`}>
		<div
			class="relative flex flex-col gap-1 hover:shadow-md justify-start h-full bg-blue-10 rounded-md shadow-lg border border-gray-100"
		>
			<div class="h-48 overflow-hidden p-3 pb-0">
				<img
					src={course?.imageUrl ?? '/courseThumbnail.png'}
					alt=""
					class="w-full object-cover object-center aspect-square grayscale"
					loading="lazy"
				/>
			</div>
			<div class="m-4 flex flex-col gap-2">
				<span class="text-xs capitalize">{categoryList[course?.category ?? 0] ?? ''}</span>
				<span class="font-semibold text-sm capitalize line-clamp-2" title={course?.title ?? ''}
					>{course?.title ?? ''}</span
				>
				<span title={course?.description} class="text-xs line-clamp-2"
					>{course?.description ?? ''}</span
				>
			</div>

			<div class="mx-4 my-2 mb-4 mt-auto grid grid-rows-2 gap-2">
				<span class="text-xs flex items-center gap-1">
					<img src="/chapters.svg" alt="" />

					{$_('Chapters')} : {numberOfChapters}</span
				>
				{#if showPlannedDate}
					<span class="text-xs flex items-center gap-1 font-medium">
						<img src="/calendar.svg" alt="" />

						{$_('PlannedDate')} : {formatDateMMMYYYY(
							new Date(course.startYear, course.startMonth - 1)
						)}</span
					>
				{/if}
				<div class="text-xs flex justify-between items-center">
					<!-- <span class=" text-xs rounded-full border-slate-400 border-2 w-fit p-0.5 px-2"
						>{formattedTime}
					</span> -->
					<span class="text-xs flex items-center gap-1">
						<img src="/calendar.svg" alt="" />

						{$_('Duration')} : {course.duration ?? '-'}
						{$_('Days')}</span
					>
					<span
						><a
							href={`/courses/details/${course?.uuid}`}
							class="text-white flex items-center justify-center"
							title="View course details"
						>
							<GoogleMatrialIcon
								iconName="arrow_forward"
								styleType="sharp"
								addClass={' text-base  h-6 w-6 bg-secondary rounded-full flex items-center justify-center -rotate-45'}
							/>
						</a></span
					>
				</div>
			</div>
		</div>
	</a>
{/if}
