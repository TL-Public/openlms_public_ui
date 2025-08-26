<script>
	import SingleCollaborationItem from '$lib/landingPage/edureach/SingleCollaborationItemOLMS.svelte';
	import { _ } from 'svelte-i18n';
	export let endorsedBy = $_('LandingPageCollaborationSectionTitle');

    let collaboratingInstitutes = [
	{
		institute: 'Ministry of Rural Development',
		image: '/edureach/google.png'
	},

	{
		institute: 'NABARD',
		image: '/edureach/facebook.png'
	},
	{
		institute: 'National Academy of Rudseti',
		image: '/edureach/pinterest.png'
	},
	{
		institute: 'IIT Madras',
		image: '/edureach/slack.png'
	},
	{
		institute: 'Rural Self Employment Training Institutes',
		image: '/edureach/microsoft.png'
	}
];
</script>

<div class="bg-white">
	<div class=" px-4 lg:w-1/2 md:w-2/3 sm:mx-auto py-16 max-w-4xl">
		<div class=" text-sm md:text-base text-center pb-2">
			{endorsedBy}
		</div>
		<div class=" grid grid-cols-5 rounded-lg py-2.5 justify-items-center items-center">
			{#each collaboratingInstitutes as institute, index (index)}
				<SingleCollaborationItem {institute} />
			{/each}
		</div>
	</div>
</div>