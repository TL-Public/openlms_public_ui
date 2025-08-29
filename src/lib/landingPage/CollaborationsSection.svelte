<script>
	import { collaboratingInstitutes } from '$lib/data.js';
	import SingleCollaborationItem from '$lib/landingPage/SingleCollaborationItem.svelte';
	import { _ } from 'svelte-i18n';
</script>

<div class="bg-ivory">
	<div class=" px-4 lg:w-1/2 md:w-2/3 sm:mx-auto py-8 max-w-4xl">
		<div class=" text-sm md:text-base text-center pb-2">
			{$_('LandingPageCollaborationSectionTitle')}
		</div>
		<div class=" grid grid-cols-5 rounded-lg py-2.5 justify-items-center items-center">
			{#each collaboratingInstitutes as institute, index (index)}
				<SingleCollaborationItem {institute} />
			{/each}
		</div>

		<div class="text-xs sm:text-sm text-center text-blue-600 hover:text-blue-800 underline">
			<a href="/aboutUs#stakeholders">{$_('Click to view collaborators')}</a>
		</div>
	</div>
</div>
