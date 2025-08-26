<script>
	import { _ } from 'svelte-i18n';

	export let enrolledCourses = 0;
	export let activeCourses = 0;
	export let totalProgress = 0;

	const stats = [
		{
			title: $_('EnrolledCourses'),
			value: enrolledCourses,
			suffix: '',
			iconSrc: '/coursesIcon.svg'
		},
		{
			title: $_('ActiveCourses'),
			value: activeCourses,
			suffix: '',
			iconSrc: '/domainIcon.svg'
		},
		{
			title: $_('OverallProgress'),
			value: totalProgress,
			suffix: '%',
			iconSrc: '/assessment.svg'
		}
	];
</script>

<div class="grid grid-cols-1 bp-420px:grid-cols-2 sm:grid-cols-3 gap-4">
	{#each stats as stat}
		<div class="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
			<div class="flex items-center space-x-4">
				<img src={stat?.iconSrc} alt={stat?.title} class="h-8 w-8 md:h-10 md:w-10 " />
				<div class="flex flex-col gap-1">
					<span class="text-xs sm:text-sm font-normal leading-normal w-fit">{stat?.title || '-'}</span>
					<span
						class="md:text-2xl font-bold leading-tight text-primary tracking-tight text-start bp-420px:text-center"
					>
						{stat.value !== null && stat.value !== undefined ? stat?.value : 'NA'}{stat?.suffix}
					</span>
				</div>
			</div>
		</div>
	{/each}
</div>
