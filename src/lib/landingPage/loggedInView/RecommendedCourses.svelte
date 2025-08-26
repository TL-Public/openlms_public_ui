<script>
	import CourseCard from '$lib/courseListing/CourseCard.svelte';

	export let recommendedCourses = [];
</script>

<div>
	<div
		class=" grid grid-cols-[repeat(auto-fit,minmax(min(249px,100%),249px))] justify-center bp-900px:justify-start xl:justify-start gap-4"
	>
		{#each recommendedCourses as course, index (index)}
			<CourseCard {course} />
		{/each}
	</div>
</div>
