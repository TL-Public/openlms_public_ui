
  <script>
	import VideoTestimonial from '$lib/ministersMessage/VideoTestimonial.svelte';
	import TextTestimonial from '$lib/ministersMessage/TextualTestimonial.svelte';
  
	export let carouselData = [];
	export let lang;
	export let token;

	let carouselIndex = 0;
	let filteredCarouselData = [];
	let error = carouselData?.error ? carouselData?.error : '';

	$: if (!error) {
		filteredCarouselData = carouselData?.map((data) => {
			const translation = data?.translations?.find((t) => t.languageCode === lang);
			return {
				img: data?.image || '/image-preview-icon.jpg',
				name: translation ? translation?.name : '',
				designation: translation ? translation?.designation : '',
				videoExtId:data?.videoExtId ?data.videoExtId :'',
				url:data?.videoUrl ? data.videoUrl : '',
				testimonialText: translation ? translation?.testimonialText : ''
			};
		});
	}

	function handleNextCarousel() {
		if (carouselIndex === carouselData?.length - 1) {
			carouselIndex = 0;
			return;
		}
		carouselIndex = carouselIndex + 1;
	}

	function handlePreviousCarousel() {
		if (carouselIndex === 0) {
			carouselIndex = carouselData?.length - 1;
			return;
		}
		carouselIndex = carouselIndex - 1;
	}
  </script>
  
  <div class="w-full sm:px-16 bg-ivory">
	{#if !error}
	  <div class="flex flex-col max-w-4xl mx-auto sm:px-18 sm:pb-24 md:pb-32 px-4 pb-16">
		<div class="flex overflow-hidden w-full">
		  {#each filteredCarouselData as data, index (index)}
			<div
			  class="flex flex-col sm:flex-row items-center w-full flex-grow-0 flex-shrink-0  p-4 rounded-lg"
			  style:translate="{-100 * carouselIndex}%"
			  style:transition="translate 300ms ease-in-out"
			>
			  {#if data.videoExtId}
				<VideoTestimonial {data} {token} />
			  {:else}
				<TextTestimonial {data} />
			  {/if}
			</div>
		  {/each}
		</div>
  
		<div class="flex gap-2 mt-6">
		  <button
			class="px-2 border flex border-primary rounded-md transition-colors"
			class:bg-primary={carouselIndex === carouselData?.length - 1}
			class:text-white={carouselIndex === carouselData?.length - 1}
			on:click={handlePreviousCarousel}
		  >
			<span class="material-icons-outlined text-center text-sm md:text-base">west</span>
		  </button>
		  <button
			class="px-2 border flex border-primary rounded-md transition-colors"
			class:bg-primary={carouselIndex === 0}
			class:text-white={carouselIndex === 0}
			on:click={handleNextCarousel}
		  >
			<span class="material-icons-outlined text-center text-sm md:text-base">east</span>
		  </button>
		</div>
	  </div>
	{/if}
  </div>