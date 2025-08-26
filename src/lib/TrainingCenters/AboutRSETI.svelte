<script>
	import BreadCrumbs from '$lib/breadCrumbs/BreadCrumbs.svelte';
	export let route = '';
	export let params = [];
	import { _ } from 'svelte-i18n';
	// import RSETI-info-graphic from '/'
</script>

<div class="bg-blue-20 rounded-md  px-4 pt-4 pb-4 sm:px-9  sm:pb-12 sm:pt-6">
	<p class="text-darkGray text-xs mb-6"><BreadCrumbs {route} {params} /></p>
	<div class="  flex flex-col rounded-lg text-darkGray sm:flex-row sm:justify-between gap-8">
		<div class="flex justify-center flex-shrink-0">
			<img src="/RSETI-info-graphic.svg" alt="RSETI-info-graphic" class="w-36" />
		</div>
		<div class="flex flex-col sm:w-3/4 gap-3">
			<h1 class="text-base sm:text-2xl font-semibold text-primary relative">
				{$_('AboutRSETI')}
				<!-- <img src="/RSETI-text-decoration.svg" alt="RSETI-text-decoration" class="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2"> -->
			</h1>
			<p class="text-sm mb-3 leading-loose">{$_('RsetiIntro')}</p>
		</div>
	</div>
</div>
<div class="max-w-7xl lg:mx-auto mb-8 mt-4 border-t border-accent"></div>
