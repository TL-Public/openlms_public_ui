<script>
	import SingleTestimonialItem from '$lib/landingPage/SingleTestimonialItem.svelte';
	import ReapPartialLogo from '$lib/svgComponents/ReapPartialLogo.svelte';
	import ReapPartialLogoMobile from '$lib/svgComponents/ReapPartialLogoMobile.svelte';
	import ErrorMessage from '$lib/courses/ErrorMessage.svelte';
	import { _ } from 'svelte-i18n';

	export let testimonials;
	export let lang;

	let carouselIndex = 0;
	let filteredTestimonial;
	let error = testimonials?.error ? testimonials?.error : null;

	$: if (!error) {
		filteredTestimonial = [];
		const testimonialsByLanguage = testimonials?.reduce((acc, item) => {
			item?.translations?.forEach((translation) => {
				const { languageCode, ...translationData } = translation;
				if (!acc[languageCode]) {
					acc[languageCode] = [];
				}
				acc[languageCode].push({
					courseUuid: item?.courseUuid,
					...translationData
				});
			});
			return acc;
		}, {});
		filteredTestimonial =
			testimonialsByLanguage[lang]?.slice(-4) || testimonialsByLanguage['en']?.slice(-4);
	}
</script>

<div class="relative bg-white50 py-8 md:py-20">
	<!-- pb - given to he testimonial container to maintain shadow -->
	<div
		class="px-4 pr-0 sm:px-6 md:pr-0 lg:px-12 w-full h-full 2xl:max-w-7xl 2xl:mx-auto 2xl:px-0 lg:pb-32"
	>
		<div class=" font-bold text-primary mb-4 sm:mb-8 flex items-center gap-2">
			<!-- <div class="hidden sm:block"><ReapPartialLogo /></div>
			<div class="block sm:hidden"><ReapPartialLogoMobile /></div> -->

			<h2 class="text-base sm:text-2xl text-primary font-bold leading-normal sm:leading-2 uppercase">{$_('LandingPageTestimonailSectionTitle')}</h2>
		</div>

		{#if error == null}
			<div class="hidden lg:grid grid-cols-4 gap-5">
				{#each filteredTestimonial as testimonial, index (index)}
					<SingleTestimonialItem {testimonial} />
				{/each}
			</div>
		{:else}
			<div class="hidden lg:block">
				<ErrorMessage {error} />
			</div>
		{/if}

		<div class=" lg:hidden">
			<div
				class="grid grid-cols-[90%,90%,90%,90%] bp-420px:grid-cols-[70%,70%,70%,70%] sm:grid-cols-[40%,40%,40%,40%] gap-4 w-full h-full overflow-x-scroll pb-16 sm:pb-24 md:pb-32 snap-x snap-mandatory"
			>
				{#if error == null}
					{#each filteredTestimonial as testimonial, index (index)}
						<div
							class=" flex self-stretch h-full last:pr-4 snap-start"
							style:translate="{-100 * carouselIndex}%"
							style:transition="translate 300ms ease-in-out"
						>
							<SingleTestimonialItem {testimonial} />
						</div>
					{/each}
				{:else}
					<div class="lg:hidden">
						<ErrorMessage {error} />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.overflow-x-scroll::-webkit-scrollbar {
		display: none;
	}
</style>