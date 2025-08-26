<script>
	import QuoteBold from '$lib/svgComponents/QuotesBold.svelte';
	import { format } from 'svelte-i18n';
	export let testimonial;
	export let showCourseLink = true;
</script>

<div
	class=" flex flex-col shadow-xl rounded-lg px-6 py-4 gap-5 justify-between items-start text-DarkGray bg-white w-full"
>
	<div class="flex flex-col gap-2">
		<div>
			<img
				src={testimonial?.img}
				alt="image of {testimonial?.name ?? ''}"
				class="object-contain px-6 py-4"
				class:hidden={!testimonial?.img}
			/>
			<div class="flex flex-col pb-4">
				<div class="text-sm font-bold">{testimonial?.name ?? ''}</div>
				<p class="text-xs">{testimonial?.designation ?? ''}</p>
				<p class="text-xs">{testimonial?.place ?? ''}</p>
			</div>
		</div>

		<div class="flex flex-col">
			<div class="pb-2">
				<QuoteBold />
			</div>

			<div class="flex items-end">
				<p class="text-xs sm:text-sm leading-loose sm:leading-relaxed text-darkGray px-4">
					{testimonial?.testimonialText ?? ''}
				</p>
			</div>
		</div>
	</div>
	{#if showCourseLink}
		<a
			href={testimonial?.courseUuid ? `courses/details/${testimonial?.courseUuid}` : 'courses'}
			class="text-xs text-secondary tracking-tight ml-0 self-center"
			>{$format('ViewThisCourse')} →
		</a>
	{/if}
</div>
