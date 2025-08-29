<script>
	import { page } from '$app/stores';
	import ErrorPage from '$lib/Components/ErrorPage.svelte';

	// use the route and params to get the paths 
	const route = $page.route.id
	const params = $page.params;

	

</script>
<ErrorPage errorData={$page.error} {route} {params} />