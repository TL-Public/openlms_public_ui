<script>
	import { format } from 'svelte-i18n';
	export let stats;
	export let alignment;

</script>

<div
	class="flex bg-white w-full py-2 px-2 lg:px-3 xl:py-4 xl:px-8 items-center rounded justify-between"
>
	<div
		class="flex flex-col pl-2 sm:py-2 sm:px-2 items-center flex-grow w-fit flex-nowrap text-center"
		class:items-center={alignment != 'center'}
		class:items-start={alignment === 'center'}
	>
    <div class="text-xs sm:text-sm font-normal leading-normal w-fit">{$format(stats?.statName)}</div>
		<div class=" text-base lg:text-3xl font-bold leading-tight text-primary tracking-tight text-center">
			{stats?.statValue ?? '-'}
		</div>
	</div>
</div>