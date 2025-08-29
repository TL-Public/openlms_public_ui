<script>
	import CourseCardSkeleton from '$lib/courseListing/CourseCardSkeleton.svelte';
	import { formatDurationHHMM } from '$lib/utils/helper.js';
	import { categoryList } from '$lib/data.js';
	import { _ } from 'svelte-i18n';
	import { formatDateMMMYYYY } from '$lib/utils/helper.js';

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
			class="relative flex flex-col gap-1 hover:shadow-md justify-start h-full bg-white rounded-md shadow-lg"
		>
			<div class="h-48 overflow-hidden p-3 pb-0">
				<img
					src={course?.imageUrl ?? '/courseThumbnail.png'}
					alt=""
					class="w-full object-cover object-center aspect-square"
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

			<div class="mx-4 my-2 mb-4 mt-auto flex flex-col gap-2">
				<span class="text-xs flex items-center gap-1">
						<img src="/chapters.svg" alt="" />

						{$_('Chapters')} : {numberOfChapters}</span
					>
				{#if showPlannedDate}
					<!-- <span class="text-xs flex items-center gap-1">
						<img src="/chapters.svg" alt="" />

						{$_('Sessions planned')} : {course?.plannedDates?.length}</span
					> -->
					<div class="flex flex-col gap-2 text-xs">
						<div>
							<div class="flex items-start gap-1 mb-2">
								<img src="/calendar.svg" alt="" />
								<!-- {$_('PlannedDates')} : -->
								 {$_('Sessions planned')} : {course?.plannedDates?.length ?? 0}
							</div>
							<div class="flex gap-1 flex-wrap">
								{#each course.plannedDates ?? [] as date}
									<span
										class="bg-blue-100 px-[6px] py-[1px] mx-[2px] rounded-[10px] text-xs inline-block"
										>{date}</span
									>
								{/each}
							</div>
						</div>
					</div>
				
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
						><a href={`/courses/details/${course?.uuid}`} class="text-blue-600">
							{$_('Details')}</a
						></span
					>
				</div>
			</div>
		</div>
	</a>
{/if}

<style>
	/* .pill styles removed, now using Tailwind classes in markup */
</style>
