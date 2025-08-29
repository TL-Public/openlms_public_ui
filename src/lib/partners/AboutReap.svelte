<script>
	import BreadCrumbs from '$lib/breadCrumbs/BreadCrumbs.svelte';
	import ReapLogo from '$lib/svgComponents/ReapLogo.svelte';
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';


	let route = $page.route.id;
	let params = $page.params;

	let stats = [
		{
			statName: 'Courses',
			statValue: '64',
			iconSvg: null
		},
		{
			statName: 'Trainees per year',
			statValue: '6 lakh+',
			iconSvg: null
		},
		{
			statName: 'Languages supported',
			statValue: '12',
			iconSvg: null
		}
	];
</script>

<div
	class=" px-4 pt-4 pb-6 sm:px-9 sm:py-12 sm:pt-6 mb-8 rounded-lg shadow-sm text-darkGray bg-white50 lg:min-h-40"
>
	<div class="pb-6 lg:pb-6">
		<BreadCrumbs {route} {params} />
	</div>
	<div class="flex flex-col md:flex-row items-start gap-8">
		<div class="w-full bp-420px:w-1/2 md:w-1/4 min-w-60 md:min-w-80 self-center md:self-start">
			<img src="/partnersHeroImage.svg" alt="REAP Illustration" class="w-full rounded-lg" />
		</div>
		<div class="w-full md:w-3/4 flex flex-col gap-4">
			<div>
				<h2
					class="text-base md:text-xl text-primary font-bold leading-normal sm:leading-2 pb-4 lg:pb-3 capitalize"
				>
					{$_('About REAP')}
				</h2>
				<div class="flex items-center mb-4">
					<ReapLogo />
				</div>
				<p class="text-xs sm:text-sm text-darkGray mb-4 leading-loose sm:leading-relaxed">
					{$_("AboutPartnersText")}
				</p>
				<p class="text-xs sm:text-sm text-darkGray mb-4 leading-loose sm:leading-relaxed">
					{$_("AboutPartnersSubText")}
				</p>
			</div>
			<div class="">
				<h3
					class="text-base md:text-xl text-primary font-bold leading-normal sm:leading-2 pb-4 lg:pb-3 capitalize"
				>
					{$_('Impact of REAP')}
				</h3>
				<p class="text-xs sm:text-sm text-darkGray mb-4 leading-loose sm:leading-relaxed">
					{$_('The scale and reach of our collaborative efforts')}
				</p>
				<div class="grid grid-cols-1 bp-420px:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 text-center">
					{#each stats as stat}
						<div
							class="flex flex-col pl-2 py-2 sm:py-4 sm:px-2 items-center flex-grow flex-nowrap bg-white rounded-md"
						>
							<div
								class=" text-base lg:text-2xl font-bold leading-tight text-primary tracking-tight"
							>
								{stat?.statValue ?? '-'}
							</div>
							<div class="text-xs font-normal leading-normal text-center">
								{$_(stat?.statName) ?? '-'}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
