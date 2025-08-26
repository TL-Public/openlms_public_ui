<!-- <script>
	import { format } from "svelte-i18n";

	export let stats;
</script>

<div
	class="flex flex-col p-1 sm:py-1 sm:px-1 md:py-1 md:px-1 lg:py-2 lg:px-2 items-center justify-center flex-grow w-fit flex-nowrap"
>
	<div
		class="display-inline text-sm sm:text-base md:text-lg lg:text-lg xl:text-2xl font-bold leading-tight text-primary tracking-tight"
	>
		{stats?.statValue ??'-'}
	</div>
	<div class="text-xs font-normal leading-normal w-fit">{$format(stats?.statName)}</div>
</div> -->

<script>
	import { format } from 'svelte-i18n';

	export let stats;
	export let alignment;
</script>

<div
	class="flex bg-white w-full py-2 px-2 lg:px-3 xl:py-4 xl:px-8 items-center rounded justify-between"
>
	<div>
		<img src={stats?.iconSvg} alt="icon of a course" class="w-6 h-6 sm:w-6 sm:h-6" />
	</div>

	<div class="border-r p-1 sm:p-2 border-primary h-3/4">&nbsp;</div>

	<div
		class="flex flex-col pl-2 sm:py-2 sm:px-2 md:items-start lg:items-center flex-grow w-fit flex-nowrap"
		class:items-center={alignment != 'center'}
		class:items-start={alignment === 'center'}
	>
		<div class=" text-base  font-bold leading-tight text-primary tracking-tight">
			{stats?.statValue ?? '-'}
		</div>
		<div class="text-xs sm:text-sm font-normal leading-normal w-fit text-center">{$format(stats?.statName)}</div>
	</div>
</div>

