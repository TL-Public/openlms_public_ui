<script>
	export let quotes = []; // Array of components or data objects
	import Quote from '$lib/courseListing/Quote.svelte';
	import SingleTestimonialItem from '../landingPage/SingleTestimonialItem.svelte';
	export let showButtons = true; // To optionally hide navigation buttons
	export let component; // The component to render dynamically

	let currentIndex = 0;

	// Navigate to the previous quote
	// const prev = () => {
	// 	currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
	// };

	// // Navigate to the next quote
	// const next = () => {
	// 	currentIndex = (currentIndex + 1) % quotes.length;
	// };

	function setQuote(index) {
		currentIndex = index;
	}
</script>

<div class="w-full max-w-3xl mx-auto relative overflow-hidden px-2">
	{#if quotes.length > 0}
		<div>
			<div class="flex gap-2">
				<SingleTestimonialItem testimonial={quotes[currentIndex]} showCourseLink={false} />
			</div>
			{#if quotes.length > 1}
				<div class="flex justify-center mt-4">
					{#each quotes as _, i}
						<button
							class="w-2 h-2 mx-1 rounded-full {i === currentIndex
								? 'bg-accent'
								: 'bg-gray-300'}"
							on:click={() => setQuote(i)}
						></button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
