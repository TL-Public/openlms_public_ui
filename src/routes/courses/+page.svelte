<script>
	import { page } from '$app/stores';
	import CourseListingPage from '$lib/courseListing/CourseListingPage.svelte';
	import { onMount } from 'svelte';
	import { setAuthStatus } from '$lib/utils/helper';
	let route = $page.route.id;
	let params = $page.params;
	let category = $page.url.searchParams.get('filter');
	export let data;

	onMount(() => {
		setAuthStatus(data?.unauthorized);
	});
</script>

<CourseListingPage {route} {params} {category} allCoursesData={data.allCoursesData} />
