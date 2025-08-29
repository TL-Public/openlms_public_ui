<script>
	import { page } from '$app/stores';
	import VideoViewingPage from '$lib/videoViewing/VideoViewingPage.svelte';

	export let data;

	let { courseDetails, lang, testimonials, serviceToken } = data;

	const url = $page.url;
	let route = $page.route.id;
	let languageCode = $page.url.searchParams.get('languageCode');
	let courseUuid = $page.url.searchParams.get('courseUuid');
	let searchParams = url.search;
	$: videoUuid = $page.url.searchParams.get('videoUuid');
	$: params = $page.params;
</script>

<div class="mt-0 mb-8 lg:mb-9 mx-4 lg:mt-0 2xl:my-12 2xl:mt-0 sm:px-3 px-1">
	<VideoViewingPage
		{route}
		{params}
		token={data.token}
		{languageCode}
		{searchParams}
		{courseDetails}
		{videoUuid}
		{lang}
		{testimonials}
		{serviceToken}
	/>
</div>
