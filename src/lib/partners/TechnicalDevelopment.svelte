<script>
	import { _ } from 'svelte-i18n';

	let techPartners = [
		{
			name: 'Tensorlogic',
			role: 'Strategic Technology Partner',
			description:'tensorDesc',
			website: 'https://tensorlogic.ai',
			logo: '/logos/tensorlogic.svg'
		},
		{
			name: 'KPOINT Technologies',
			role: 'Video Integration Partner',
			description:'KpointDesc',
			website: '',
			logo: '/logos/kpoint.png'
		}
	];
</script>

<div>
	<h2 class="text-base md:text-xl text-primary font-bold leading-normal sm:leading-2 pb-4 lg:pb-3 capitalize text-center">{$_('Technical Development & Platform Support')}</h2>
	<p class="text-xs sm:text-sm text-darkGray mb-4 sm:mb-8 leading-loose sm:leading-relaxed text-center">
		{$_('TechincalDevelopmentDesc')}
	</p>
	
	<div class="space-y-6">
		{#each techPartners as partner}
			<div class="flex flex-col md:flex-row items-start gap-4 md:gap-8 p-4 border border-gray-200 rounded-lg">
				<!-- <img src={partner.logo || "/placeholder.svg"} alt={partner.name} class="h-12 w-full sm:w-1/4 object-contain" /> -->
				 <div class="h-24 w-40 flex items-center justify-start shrink-0 bg-white p-2 rounded-md">
					<img
						src={partner.logo || "/placeholder.svg"}
						alt={partner.name}
						class="max-h-full max-w-full object-contain"
					/>
				</div>
				<div class="w-full  sm:w-3/4">
					<h3 class="text-base text-primary font-semibold leading-normal sm:leading-2 pb-2 capitalize">{$_(partner.name)}</h3>
					<p class="text-primary font-semibold bg-blue-200 py-1 px-2 text-xs rounded-full mb-2 w-fit">{$_(partner.role)}</p>
					<p class="text-xs sm:text-sm text-darkGray mb-2 leading-loose sm:leading-relaxed">
						{$_(partner.description)}
					</p>
					<a href={partner.website} class="text-blue-600 text-sm hover:underline" target="_blank" rel="noopener noreferrer">
						{partner.website.replace('https://', '')}
					</a>
				</div>
			</div>
		{/each}
	</div>
</div>
