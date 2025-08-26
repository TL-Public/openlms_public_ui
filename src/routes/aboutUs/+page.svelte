<script>
	import AboutReap from '$lib/partners/AboutReap.svelte';
	import InstitutionalSupport from '$lib/partners/InstitutionalSupport.svelte';
	import Sme from '$lib/partners/SME.svelte';
	import Stakeholders from '$lib/partners/Stakeholders.svelte';
	import TechnicalDevelopment from '$lib/partners/TechnicalDevelopment.svelte';
	import PatternNavy from '$lib/Components/PatternNavy.svelte';
</script>

<!-- mt is hardscoded to account for the layout pattern -->
<div class="absolute inset-0 bg-primary -z-10 mt-[65.5px] 2xl:bg-transparent"></div>
<div class="lg:mx-[92px] mx-4 my-8 mt-0 lg:mb-9 lg:mt-0 s">
	<AboutReap />
	<div
		class="px-4 pt-4 pb-6 sm:px-20 sm:py-12 sm:pt-6 mb-8 rounded-lg text-darkGray bg-white50 lg:min-h-40 space-y-10 sm:space-y-20 shadow-sm"
	>
		<Stakeholders />
		<TechnicalDevelopment />
		<InstitutionalSupport />
		<Sme />
	</div>
</div>
<div class="bg-primary pt-4 2xl:hidden">
	<PatternNavy />
</div>
