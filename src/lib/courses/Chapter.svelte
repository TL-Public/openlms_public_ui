<script>
	import { createEventDispatcher } from 'svelte';
	import GoogleMatrialIcon from '$lib/Components/GoogleMatrialIcon.svelte';
	import LanguageSelectionButtons from '$lib/courses/LanguageSelectionButtons.svelte';
	import VideoPod from '$lib/VideoPod.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import { format } from 'svelte-i18n';
	import { page } from '$app/stores';

	export let index = 0;
	export let chapter = {};
	export let chapterAccordianOpen = [];
	export let languageAvailableForVideos = [];
	export let selectedLanguage = 'en';
	export let errorInVideos = null;
	export let errorInSearch = null;
	export let params = {};
	export let courseUuid;
	export let showLanguageSelectionButtons = true;
	export let videoUuid = '';

	let globalSelectedLang = $page.data?.lang ? $page.data.lang : 'en';

	let chapterData = {};
	let selectedLangVideoList = [];
	const dispatch = createEventDispatcher();
	$: createSelectedLangVideoListAndChapterData(selectedLanguage);
	function createSelectedLangVideoListAndChapterData() {
		// Search if the chapter data is available in selected global langauage and if not default to english for that
		const extractChapterLanguageData = chapter.translations?.find(
			(elem) => elem.languageCode === globalSelectedLang
		);
		chapterData =
			extractChapterLanguageData ||
			chapter.translations?.find((elem) => elem.languageCode === 'en');

		// extract videos of that language code from that chapter
		if (chapter.videos?.length !== 0) {
			selectedLangVideoList = chapter.videos?.filter(
				(video) => video.languageCode === selectedLanguage
			);
		}
		// now once all videos of selected language are in list sort them using order number
		selectedLangVideoList = selectedLangVideoList.sort((a, b) => a.orderNumber - b.orderNumber);
	}

	function handleAccordianToggle(index) {
		// tester = !tester
		dispatch('accordianToogle', index);
	}
</script>

<button
	class="w-full p-4 bg-blue-10 rounded-md flex justify-between items-center text-base text-left"
	on:click={() => handleAccordianToggle(index)}
>
	<!-- <h3>{$format('Chapter')} {index + 1}. {chapterData?.title}</h3> -->
	<h3 class="font-semibold">
		<!-- {$format('Chapter')}
		{index + 1} : -->
		<span class="sm:font-semibold font-normal">
			{chapterData?.title ?? '-'}
		</span>
	</h3>

	<GoogleMatrialIcon
		iconName="arrow_forward_ios"
		addClass="text-base {chapterAccordianOpen[index]
			? 'rotate-90 transition-all'
			: '-rotate-90  transition-all'}"
	/>
</button>
<div
	class="w-full mb-4 transition-all overflow-hidden border rounded-b-md"
	class:h-0={chapterAccordianOpen[index]}
>
	{#if languageAvailableForVideos.length !== 0}
		{#if showLanguageSelectionButtons}
			<div class="pt-4 px-4">
				<LanguageSelectionButtons
					{languageAvailableForVideos}
					on:handleSelectedLanguage
					{selectedLanguage}
				/>
			</div>
		{/if}
	{/if}
	{#if chapter?.videos?.length > 0 && errorInVideos == null}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
			{#if selectedLangVideoList.length > 0}
				{#each selectedLangVideoList as video, index (index)}
					<!-- <div class="w-full sm:max-w-[800px]"> -->
					<VideoPod
						{video}
						{params}
						{selectedLanguage}
						{courseUuid}
						highlight={videoUuid === video?.uuid ? true : false}
					/>
					<!-- </div> -->
				{/each}
			{:else}
				<h3>{$format('NoVideosFoundInLanguage')}</h3>
			{/if}
		</div>
	{:else if chapter?.videos?.length === 0 || errorInSearch}
		<div class="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 p-4">
			<h3>{$format('NoVideosFoundInLanguage')}</h3>
		</div>
	{/if}
</div>
