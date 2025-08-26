<script>
	import { _,t } from 'svelte-i18n';
	import { format } from 'svelte-i18n';
	import { formatDurationHHMM } from '$lib/utils/helper.js';

	export let progressData = {};
	export let statsList = [];
	export let courseDetails = {};

	$: batchDate = courseDetails?.enrolledOn || '-';
	$: rsetiName = courseDetails?.rsetiName || '-';
</script>

<div class="w-full">
	<h3 class="text-sm font-bold text-primary mb-4">{$_('My progress')}</h3>

	<!-- Progress & Stats Wrapper -->
	<div class="flex flex-col gap-4 w-full">
		<!-- Course Progress Card -->
		<div class="bg-white rounded-lg p-4 shadow-sm w-full">
			<div class="flex justify-between items-center mb-2">
				<h4 class="text-sm font-medium text-darkGray">{$_('Course progress')}</h4>
				<span class="text-lg font-bold text-primary">{progressData.courseProgress || 0}%</span>
			</div>
			<div class="w-full bg-gray-200 rounded-full h-1 mb-2">
				{#if progressData?.courseProgress}
					<div
						class="bg-accent-dark h-1 rounded-full"
						style="width: {progressData.courseProgress}%"
					></div>
				{/if}
			</div>
			<div class="flex flex-col sm:flex-row sm:justify-between gap-1">
				<p class="text-xs text-gray-500">
					{progressData.inProgressVideosCount || '-'} of {progressData.totalVideosCount || '-'} {$_('videos completed')}
				</p>
				<p class="text-xs text-gray-500">
					{$_('Estimated time left')}: {formatDurationHHMM(progressData.timeLeft) || '-'}
				</p>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="flex flex-col bp-700px:flex-row gap-2 w-full">
			{#each statsList as stats}
				<div
					class="flex bg-white w-full py-2 px-2 lg:px-3 xl:py-4 xl:px-8 items-center rounded justify-between"
				>
					<div>
						<img src={stats?.iconSvg} alt="icon of a course" class="w-6 h-6 sm:w-8 sm:h-8" />
					</div>

					<div class="border-r p-1 sm:p-2 border-primary h-3/4">&nbsp;</div>

					<div
						class="flex flex-col pl-2 bp-700px:py-2 bp-700px:px-2 md:items-start lg:items-center flex-grow w-fit flex-nowrap item-start"
					>
						<div
							class=" text-base bp-700px:text-lg font-bold leading-tight text-primary tracking-tight"
						>
							{stats?.statValue ?? '-'}
						</div>
						<div class="text-xs font-normal leading-normal w-fit text-center">
							{$format(stats?.statName)}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<p class="text-xs text-gray-500 mt-3">
		{$t('batchRankNote', { values: { batchDate, rsetiName } })}
	</p>
</div>
