<script>
	import SearchBar from '$lib/Components/SearchBar.svelte';
	import VideoPod from '$lib/VideoPod.svelte';
	import VideoPodSkeleton from '$lib/VideoPodSkeleton.svelte';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
	import { format } from 'svelte-i18n';
	import { setLocalStoreData } from '$lib/utils/helper.js';
	import LanguageSelectionButtons from '$lib/courses/LanguageSelectionButtons.svelte';
	import Chapter from './Chapter.svelte';
	import { page } from '$app/stores';

	export let videos = [];
	export let chapters = [];

	export let params;
	export let showSearchBar = true;
	export let errorInVideos;
	export let loadingInVideos;
	export let selectedLang;
	export let courseUuid = '';
	export let courseCode = '';
	export let courseDetails = {};
	export let showAvailableLanguages = true;
	export let showLanguageSelectionButtons = true;
	export let videoUuid = '';
	export let traineeDetailsData = {}

	// export const languageCodeList = {
	// en: { name: 'English', orderNumber: 1 },
	// hi: { name: 'हिंदी', orderNumber: 2 },
	// ta: { name: 'தமிழ்', orderNumber: 3 },
	// ml: { name: 'മലയാളം', orderNumber: 4 },
	// bn: { name: 'বাংলা', orderNumber: 5 },
	// mr: { name: 'मराठी', orderNumber: 6 },
	// te: { name: 'తెలుగు', orderNumber: 7 },
	// gu: { name: 'ગુજરાતી', orderNumber: 8 },
	// kn: { name: 'ಕನ್ನಡ', orderNumber: 9 },
	// or: { name: 'ଓଡ଼ିଆ', orderNumber: 10 },
	// pa: { name: 'ਪੰਜਾਬੀ', orderNumber: 11 },
	// as: { name: 'অসমীয়া', orderNumber: 12 }
	// };

	export const languageCodeList = {
		en: { name: 'English', orderNumber: 1 },
		hi: { name: 'Hindi', orderNumber: 2 },
		as: { name: 'Assamese', orderNumber: 3 },
		bn: { name: 'Bengali', orderNumber: 4 },
		gu: { name: 'Gujarati', orderNumber: 5 },
		kn: { name: 'Kannada', orderNumber: 6 },
		ml: { name: 'Malayalam', orderNumber: 7 },
		mr: { name: 'Marathi', orderNumber: 8 },
		or: { name: 'Odia', orderNumber: 9 },
		pa: { name: 'Punjabi', orderNumber: 10 },
		ta: { name: 'Tamil', orderNumber: 11 },
		te: { name: 'Telugu', orderNumber: 12 }
	};

	let languageAvailableForVideos = [];
	let chapterAccordianOpen = [];
	let errorInSearch = null;
	let searchValue = '';
	let selectedLanguage = selectedLang ? selectedLang : 'en';
	let dummyVideoPodDetails = new Array(4);
	$: videosSearch = videos ? videos : [];
	$: handleSearchAndLangugaeSetting(searchValue, selectedLanguage);

	// Reactively initialize chapterAccordianOpen based on chapters' length
	$: if (chapters?.length || videoUuid) {
		chapterAccordianOpen = new Array(chapters?.length).fill(true);
	}

	// Function to open the accordion where the videoId exists
	$: if (videoUuid) {
		const targetIndex = chapters
			?.sort((a, b) => Number(a.orderNumber) - Number(b.orderNumber))
			.findIndex((chapter) => {
				return chapter?.videos?.find((video) => video?.uuid === videoUuid);
			});
		if (targetIndex !== -1) {
			let targetIndexData = {
				detail: targetIndex
			};
			handleAccordianToggle(targetIndexData);
		}
	}

	createLanguageOptionsAndSortChapters();
	function createLanguageOptionsAndSortChapters() {
		// Sort the chaptues using the sorting number
		chapters = chapters.sort((a, b) => Number(a.orderNumber) - Number(b.orderNumber));

		// Now create a set to extract all the unique language codes present in the videos of each chapter
		let uniqueLanguageCodes = new Set();
		chapters.forEach((chapter) => {
			chapter.videos?.forEach((video) => {
				uniqueLanguageCodes.add(video.languageCode);
			});
		});

		// create the language option list from these
		uniqueLanguageCodes.forEach((code) => {
			languageAvailableForVideos.push({
				languageCode: code,
				languageName: languageCodeList[code]?.name,
				orderNumber: languageCodeList[code]?.orderNumber
			});
		});

		// once the language list is created sort themm according to the order number
		languageAvailableForVideos = languageAvailableForVideos.sort(
			(a, b) => a.orderNumber - b.orderNumber
		);

		const preferredLanguage = traineeDetailsData.videoPreferredLanguage;
		const availableLanguages = [...uniqueLanguageCodes];

		if ($page?.data?.user?.isAuthenticated) {
			if (preferredLanguage && availableLanguages.includes(preferredLanguage)) {
				selectedLanguage = preferredLanguage;
			} else if (availableLanguages.includes('en')) {
				selectedLanguage = 'en';
			} else if (availableLanguages.includes('hi')) {
				selectedLanguage = 'hi';
			} else {
				// fallback to first available language in the videos array
				selectedLanguage = languageAvailableForVideos[0]?.languageCode || null;
			}
		} else {
			// User not logged in
			selectedLanguage = availableLanguages.includes('en')
				? 'en'
				: languageAvailableForVideos[0]?.languageCode || null;
		}
	}

	function handleSearchValue(e) {
		searchValue = e.detail;
	}

	function handleSelectedLanguage(e) {
		selectedLanguage = e.detail.languageCode;
	}

	function handleSearchAndLangugaeSetting() {
		errorInSearch = null;
		let localVideosCopy = [];
		if (searchValue) {
			chapters?.forEach((chapter, index) => {
				chapter?.videos?.forEach((video) => {
					if (video?.name?.toLowerCase()?.includes(searchValue?.toLocaleLowerCase())) {
						let modifiedVideoData = { ...video, chapterNumber: index + 1 };
						localVideosCopy?.push(modifiedVideoData);
					}
				});
			});
		}
		if (localVideosCopy?.length === 0) {
			errorInSearch = 'No Data Found';
		}

		videosSearch = localVideosCopy;
	}

	function handleAccordianToggle(event, type = null) {
		const index = event.detail;
		chapterAccordianOpen[index] = !chapterAccordianOpen[index];
	}
</script>

{#if showSearchBar}
	<div class="mb-4 sm:my-6 lg:w-full">
		<SearchBar
			on:handleSearchValue={handleSearchValue}
			placeholder={$format('SearchByVideoTitle')}
			searchButton={false}
		/>
	</div>
{/if}

{#if loadingInVideos}
	<div class="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
		{#each dummyVideoPodDetails as videoPod, index (index)}
			<VideoPodSkeleton />
		{/each}
	</div>
{/if}

{#if searchValue === ''}
	{#if chapters?.length != 0}
		{#if showAvailableLanguages}
			<h3 class="mb-4 text-sm">
				{$format('VideosAvailableIn')}: {languageAvailableForVideos

					.map((lang) => lang.languageName)
					.join(', ')}
			</h3>
		{/if}
		{#each chapters as chapter, index (index)}
			<Chapter
				{index}
				on:accordianToogle={handleAccordianToggle}
				{chapter}
				{chapterAccordianOpen}
				{languageAvailableForVideos}
				{selectedLanguage}
				{params}
				{courseUuid}
				{courseDetails}
				{videoUuid}
				{showLanguageSelectionButtons}
				on:handleSelectedLanguage={handleSelectedLanguage}
			/>
		{/each}
	{:else}
		<ErrorComponent errorMessage={$format('NoDataFound')} />
	{/if}
{:else if videosSearch?.length != 0}
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
		{#each videosSearch as video, index (index)}
			<div class="" class:bg-primary={video?.uuid === videoUuid}>
				<VideoPod
					{video}
					{params}
					selectedLanguage={video.languageCode}
					{courseUuid}
					{courseDetails}
					showProgressIcons={$page?.data?.user?.isAuthenticated ? true : false}
				/>
			</div>
		{/each}
	</div>
{:else}
	<ErrorComponent errorMessage={$format('NoVideosFound')} />
{/if}
