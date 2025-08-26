<script>
	import { _, waitLocale } from 'svelte-i18n';

	let stakeholders = [
		{ name: $_('Ministry of Rural Development'), logo: '/logos/mord.svg' },
		{ name: 'NABARD', logo: '/logos/nabard.png' },
		{ name: 'NAR', logo: '/logos/nar.jpg' },
		{ name: $_('IIT Madras'), logo: '/logos/iit-logo.png' },
		{ name: 'RSETI', logo: '/logos/rseti-logo.png' }
	];
</script>

<div id="stakeholders">
	<h2
		class="text-base md:text-xl text-primary font-bold leading-normal sm:leading-2 pb-4 lg:pb-3 capitalize text-center"
	>
		{$_('Key stakeholders and implementation partners')}
	</h2>
	<p
		class="text-xs sm:text-sm text-darkGray mb-4 sm:mb-8 leading-loose sm:leading-relaxed text-center"
	>
		{#await waitLocale()}
			{@html $_('stakeholdersPara')}
		{:then}
			{@html $_('stakeholdersPara')}
		{/await}
	</p>
	<div class="flex flex-wrap justify-center items-center gap-4 sm:gap- md:gap-8 px-10">
		{#each stakeholders as stakeholder}
			<div class="h-16 flex items-center justify-center">
				<img
					src={stakeholder.logo || '/placeholder.svg'}
					alt={stakeholder.name}
					class="h-14 sm:h-16 object-contain"
				/>
			</div>
		{/each}
	</div>
</div>
