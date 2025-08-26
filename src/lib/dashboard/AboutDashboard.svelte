<script>
	import BreadCrumbs from '$lib/breadCrumbs/BreadCrumbs.svelte';
	import { _ } from 'svelte-i18n';
	export let route = '';
	export let params = [];
	
</script>

<div class="px-4 pt-4 pb-4 sm:px-9 sm:py-12 sm:pt-6 mb-8 rounded-lg text-darkGray bg-blue-20 lg:min-h-40">
	<p class="text-darkGray text-xs pb-4 lg:pb-6"><BreadCrumbs {route} {params} /></p>

	<div class="flex flex-col sm:w-3/4 gap-3">
		<h1 class="text-primary font-bold text-base lg:text-2xl mb-2">
			{$_('Dashboard')}
		</h1>
		<p class="text-xs sm:text-sm text-darkGray leading-loose sm:leading-relaxed">{$_('DashboardIntro')}</p>
	</div>
</div>
