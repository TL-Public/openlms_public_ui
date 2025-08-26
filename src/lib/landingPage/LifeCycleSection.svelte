<script>
	import { studentLifeCycle } from '$lib/data.js';
	import SingleLifeCycleItem from '$lib/landingPage/SingleLifeCycleItem.svelte';
	import PatternNavy from '$lib/Components/PatternNavy.svelte';
	import { _ } from 'svelte-i18n';
</script>

<div>
	<div class=" w-full overflow-hidden">
		<PatternNavy />
	</div>
	<div class="px-4 sm:pb-8 md:px-16 md:pb-16 bg-ivory">
		<div class="  tranform -translate-y-[65.5px] p-4 sm:p-8 md:p-12 bg-white50 rounded-lg 2xl:max-w-7xl mx-auto">
			<h1 class="text-base sm:text-2xl md:text-3xl font-bold text-primary pb-2 leading-tight sm:leading-tight md:leading-tight">{$_('LandingPageLifeCycleSectionTitle')}</h1>
			<p class="text-xs sm:text-sm font-normal w-fit pb-4 sm:pb-8 leading-relaxed sm:leading-relaxed">
				{$_('LandingPageLifeCycleSectionSubtitle')}
			</p>
			<div
				class="grid grid-cols-2 rounded-lg lg:grid-cols-4 justify-items-start md:justify-items-center gap-4"
			>
				{#each studentLifeCycle as lifeCycle, index (index)}
					<SingleLifeCycleItem {lifeCycle} />
				{/each}
			</div>
		</div>
	</div>
</div>
