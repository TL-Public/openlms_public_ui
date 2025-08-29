<script>
	import { format } from 'svelte-i18n';
	import CourseTab from '$lib/courses/Tabs.svelte';
	import Videos from '$lib/courses/Videos.svelte';
	import LearningCenters from '$lib/courses/LearningCenters.svelte';
	export let params;
	// get center data from load function of page
	export let centersData = [];
	export let statesData = [];
	export let videos = [];
	export let lang;
	export let chapters = [];
	export let courseUuid = '';
	export let courseDetails = {};
	export let traineeDetailsData = {}

	let errorInVideos = null;
	let searchValue = '';
	let loadingInVideos = false;

	let tabs = [
		{ text: 'Chapters', component: Videos, clicked: false, textDisplay: $format('Chapters') },
		{
			text: 'Training Centers',
			component: LearningCenters,
			clicked: false,
			textDisplay: $format('TrainingCenters')
		}
	];

	$: setTabsData($format);

	function setTabsData() {
		tabs = [
			{ text: 'Chapters', component: Videos, clicked: false, textDisplay: $format('Chapters') },
			{
				text: 'Training Centers',
				component: LearningCenters,
				clicked: false,
				textDisplay: $format('TrainingCenters')
			}
		];
	}
	let componentToRender = tabs[0];

	// Tab to remain selected on page load
	let activeTabText = tabs?.[0]?.text;

	function handleActiveTab(e) {
		activeTabText = e.detail;
		let [matchedObj] = activeTabText
			? tabs?.filter((tab) => tab?.text?.toLowerCase().includes(activeTabText?.toLowerCase()))
			: [componentToRender];
		componentToRender = matchedObj;
	}
</script>

<div class="mb-4 sm:mb-6">
	<CourseTab bind:tabs on:handleActiveTab={handleActiveTab} {activeTabText} />
</div>

<svelte:component
	this={componentToRender.component}
	{searchValue}
	{params}
	{chapters}
	{centersData}
	{statesData}
	{videos}
	{errorInVideos}
	{loadingInVideos}
	{courseUuid}
	{courseDetails}
	{traineeDetailsData}
/>
