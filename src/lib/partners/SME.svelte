<script>
	import { _ } from 'svelte-i18n';
	
	let experts = [
		{ image: '/sme1.svg?height=150&width=150', alt: 'Expert 1' },
		{ image: '/sme2.svg?height=150&width=150', alt: 'Expert 2' },
		{ image: '/sme3.svg?height=150&width=150', alt: 'Expert 3' }
	];
</script>

<div>
	<h2 class="text-base md:text-xl text-primary font-bold leading-normal sm:leading-2 pb-4 lg:pb-3 capitalize text-center">{$_('Subject Matter Experts and Domain Skill Trainers')}</h2>
	<p class="text-xs sm:text-sm text-darkGray mb-4 sm:mb-8 leading-loose sm:leading-relaxed text-center">
		{$_('SMEDesc')}
	</p>
	
	<div class="flex flex-wrap justify-center gap-8 mb-8">
		{#each experts as expert}
			<img src={expert.image || "/placeholder.svg"} alt={expert.alt} class="w-24 h-24 bp-420px:w-32 bp-420px:h-32 rounded-lg" />
		{/each}
	</div>
	
	<p class="text-xs sm:text-sm text-darkGray mb-4 sm:mb-8 leading-loose sm:leading-relaxed text-center">
		{$_("SMESubText")}
	</p>
</div>
