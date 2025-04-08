<script>
	import GoogleMatrialIcon from '$lib/Components/GoogleMatrialIcon.svelte';
	import { goto } from '$app/navigation';
	import BrokenLamp from '$lib/svgComponents/BrokenLamp.svelte';
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
	// export let errorData = {};
	// export let params = {};
	// export let route = [];

	let isNotFound = $page?.status === 404;
	let errorTitle = isNotFound ? $_("Page Not Found") : $_('AnUnexpectedErrorOccured');

	// This logic wont work in root route
	// let newRoute = route && route.slice('1');
	// let backPaths = [{ crumb: 'Home', path: '/' }];
	// let href = '';
	// newRoute = newRoute && newRoute.split('/');
	// newRoute &&
	// 	newRoute.forEach((element, index) => {
	// 		if (element.startsWith('[')) {
	// 			let [paramValue] = Object.values(params);
	// 			href = href + '/' + paramValue;
	// 			backPaths[index].path = href;
	// 		} else {
	// 			href = href + '/' + element;
	// 			let formattedElement = element.replace(/([A-Z])/g, ' $1').trim();
	// 			backPaths.push({
	// 				crumb: formattedElement,
	// 				path: href
	// 			});
	// 		}
	// 	});
</script>

<!-- <div class="px-6 max-w-7xl mx-auto flex justify-around">
	<div>
		<BrokenLamp addClass="w-20 md:w-44" />
	</div>
	<div class="flex flex-col justify-center w-1/2">
		<h1 class="text-[5rem] md:text-[10rem] text-8xl font-bold text-primary">
			{errorData?.status ?? 500}
		</h1>
		<h2 class="font-bold text-xl md:text-3xl text-primary mt-3 sm:mt-6">{errorData?.message}</h2>
		<div class="mt-4 sm:mt-10 md:mt-20">
			<button
				class="text-sm md:text-base rounded-[4px] font-semibold text-white bg-orange-100 px-4 sm:px-6 py-2"
				on:click={() => {
					// check if the there is some path in second last position
					if (backPaths?.length >= 2) {
						goto(backPaths[backPaths.length - 2].path);
					}
					// if not then the last path is root path
					else {
						goto('/');
					}
				}}
			>
				<div class="text-sm md:text-base flex items-center gap-2">
					<GoogleMatrialIcon iconName="west" /> Go Back
				</div>
			</button>
		</div>
	</div>
</div> -->

<!-- Hardcoded pt to account for the orange colour common layout pattern -->
<div class="flex items-start sm:items-center justify-center px-4 pt-20 sm:pt-4 h-screen">
	<div class="flex flex-row items-center space-y-8 md:space-y-0 md:space-x-12 gap-6">
		<BrokenLamp addClass="h-40 md:h-64 w-auto" />
		<div class="text-center md:text-left">
			<h1 class="text-6xl md:text-8xl font-bold text-primary mb-2">
				{$page?.status ?? 500}
			</h1>
			<h2 class="text-xl md:text-2xl font-semibold text-primary mb-6">
				{errorTitle || '-'}
			</h2>
			<a href="/" class="text-sm rounded-md font-semibold text-white bg-secondary px-4 sm:px-6 py-2">
				{$_('Go to Home')}
			</a>
		</div>
	</div>
</div>