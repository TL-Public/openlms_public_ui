<script>
	import { format } from 'svelte-i18n';

	export let stats;
	export let alignment;
</script>

<div
	class="flex bg-white w-full py-2 px-2 lg:px-3 xl:py-4 xl:px-8 items-center rounded justify-between"
>
	<div>
		<img src={stats?.iconSvg} alt="icon of a course" class="w-6 h-6 sm:w-8 sm:h-8" />
	</div>

	<div class="border-r p-1 sm:p-2 border-primary h-3/4">&nbsp;</div>

	<div
		class="flex flex-col pl-2 sm:py-2 sm:px-2 md:items-start lg:items-center flex-grow w-fit flex-nowrap"
		class:items-center={alignment != 'center'}
		class:items-start={alignment === 'center'}
	>
		<div class=" text-base lg:text-2xl font-bold leading-tight text-primary tracking-tight">
			{stats?.statValue ?? '-'}
		</div>
		<div class="text-xs sm:text-sm font-normal leading-normal w-fit text-center">{$format(stats?.statName)}</div>
	</div>
</div>
