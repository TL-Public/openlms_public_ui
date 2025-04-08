<script>
	import CourseListMainSection from '$lib/courseListing/CourseListMainSection.svelte';
	import Quote from '$lib/courseListing/Quote.svelte';
	import BreadCrumbs from '$lib/breadCrumbs/BreadCrumbs.svelte';
	import { _ } from 'svelte-i18n';
	import ErrorMessage from '$lib/courses/ErrorMessage.svelte'

	export let route;
	export let params;
	// category from query params
	export let category;
	export let allCoursesData;
</script>

<div class="bg-blue-10 px-8 pt-4 pb-8 mb-8 mt-0 lg:mb-9 lg:mt-0 lg:px-[92px] lg:pb-9 lg:pt-6">
	<div class="max-w-7xl mx-auto">
		<div class="pb-4 lg:pb-6">
			<BreadCrumbs {route} {params} />
		</div>
		<div class="w-full flex flex-col gap-6 justify-center md:grid md:grid-cols-2 md:grid-rows-1">
			<div class="flex flex-col">
				<h1 class="uppercase-headers mb-2">{$_('Courses')}</h1>
				<p class="text-xs sm:text-sm text-darkGray leading-loose sm:leading-relaxed">
					{$_('CoursesInfo')}
				</p>
			</div>
			<div class="justify-self-center self-center">
				<Quote />
			</div>
		</div>
	</div>
</div>

<div class="md:mx-4 lg:mx-[92px] xl:m-0">
	{#if allCoursesData?.length >0}
	<CourseListMainSection {category} coursesCopy={allCoursesData} />
	{:else}
	<ErrorMessage />
	{/if}
</div>
