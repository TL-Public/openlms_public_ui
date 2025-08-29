<script>
	import { _ } from 'svelte-i18n';

	let institutions = [
		{
			name: 'Wadhwani School of Data Science and AI',
			description: 'WSDSAIDesc',
			website: 'https://dsai.iitm.ac.in',
			logo: '/logos/wsdsai.png'
		},
		{
			name: 'NPTEL',
			description: 'NPTELDesc',
			website: null,
			logo: '/logos/nptel.avif'
		},
		{
			name: 'AI4Bharat',
			description: 'AI4BharatDesc',
			website: null,
			logo: '/logos/aiforbharat.jpg'
		},
		{
			name: 'Edureach',
			description: 'EdureachDesc',
			website: 'https://edu-reach.in',
			logo: '/logos/edu-reach.svg'
		}
	];
</script>

<div>
	<h2 class="text-base md:text-xl text-primary font-bold leading-normal sm:leading-2 pb-4 lg:pb-3 capitalize text-center">{$_('Institutional support at IIT Madras')}</h2>
	<p class="text-xs sm:text-sm text-darkGray mb-4 sm:mb-8 leading-loose sm:leading-relaxed text-center">
		{$_('InstitutionalSupportDesc')}
	</p>
	
	<div class="space-y-6">
		{#each institutions as institution}
			<div class="flex flex-col md:flex-row items-start gap-4 md:gap-8 p-4 border border-gray-200 rounded-lg">
				<!-- <img src={institution.logo || "/placeholder.svg"} alt={institution.name} class="h-12 sm:h-24 w-full sm:w-1/4 object-contain" /> -->
				 <div class="h-24 w-40 flex items-center md:justify-center justify-center shrink-0 bg-white p-2 rounded-md">
					<img
						src={institution.logo || "/placeholder.svg"}
						alt={institution.name}
						class="max-h-full max-w-full object-contain"
					/>
				</div>
				<div class="w-full sm:w-3/4">
					<div class="flex flex-row gap-2 items-center">
					<img src="/reapbadge.svg" alt="" class="h-5 w-5">
					<h3 class="text-base text-primary font-semibold leading-normal sm:leading-2 capitalize pb-2">{$_(institution.name)}</h3>
					</div>
					<p class="text-xs sm:text-sm text-darkGray mb-2 leading-loose sm:leading-relaxed">
						{$_(institution.description)}
					</p>
					{#if institution.website}
						<a href={institution.website} class="text-blue-600 text-sm hover:underline" target="_blank" rel="noopener noreferrer">
							{institution.website.replace('https://', '')}
						</a>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
