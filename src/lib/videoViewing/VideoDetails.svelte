<script>
	import { getLocalStoreData } from '$lib/utils/helper.js';
	import { onMount } from 'svelte';
	import { format } from 'svelte-i18n';
	import { quotes } from './quotes.temp.js';
	import TestimonialCarousel from '$lib/Components/TestimonialCarousel.svelte';
	import SingleTestimonialItem from '$lib/landingPage/SingleTestimonialItem.svelte';
	import TestimonialSection from '../landingPage/TestimonialSection.svelte';
	export let videoDetails;
	export let courseTitle;
	export let testimonials;

	// take a random quote form the list of quotes
	let quote = quotes?.[Math.floor(Math.random() * quotes.length)] ?? {};
</script>

<div class=" flex-col flex h-full">
	<h1 class="text-primary text-base sm:text-2xl font-bold pb-2 leading-6 capitalize break-words">
		{videoDetails.name}
	</h1>
	<div class="flex flex-col gap-4 sm:gap-6 justify-between flex-1">
		<div>
			<div class="flex flex-col gap-4 sm:gap-6">
				<p class="text-xs sm:text-sm leading-6  hyphens-auto break-all ">
					{videoDetails?.description ?? ''}
				</p>
				<p class="text-xs sm:text-sm mb-2">{videoDetails?.views ?? '-'} &nbsp;{$format('views')}</p>
			</div>

			<div>
				<ul
					class="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm border-gray-90 pb-8 sm:pb-4 flex-wrap capitalize"
				>
					<li><span class="font-semibold">{$format('Course')}:</span> {courseTitle ?? ''}</li>
					<!-- <li>
					<span class="font-semibold">{$format('Module')}:</span>
					{videoDetails?.module ?? '-'}
				</li>
				<li><span class="font-semibold">{$format('Topic')}:</span> {videoDetails?.topic ?? '-'}</li> -->
				</ul>
			</div>
		</div>

		<div>
			{#if testimonials?.length > 0}
				<TestimonialCarousel quotes={testimonials} component={SingleTestimonialItem} />
			<!-- {:else}
				<div class="border border-primary p-4 rounded-md bg-blue-50">
					<p class="text-sm">
						<img src="/DoubleQuote.svg" alt="double quote" class="w-5 mb-2" />
						{quote?.quote}
					</p>
					<h4 class="text-end text-sm">- {quote?.author}</h4>
				</div> -->
			{/if}
		</div>
	</div>
</div>
