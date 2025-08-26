<script>
	export let institute;
	export let placeholderImage = '/courseDurationIcon.svg';
</script>

<div class="flex flex-col py-2 items-center flex-grow w-fit">
	<div class=" font-bold leading-tight text-primary w-fit tracking-tight">
		<img
			src={institute?.image}
			alt="collaborating institute logo"
			class="h-9 sm:h-16 pb-1 object-contain grayscale hover:grayscale-0"
			title={institute?.institute ? institute.institute : ''}
			on:error={(event) => (event.target.src = placeholderImage)}
		/>
	</div>
	<!-- <div class="text-xs md:text-base font-normal leading-normal w-fit text-center">
			{institute?.institute}
		</div> -->
</div>
