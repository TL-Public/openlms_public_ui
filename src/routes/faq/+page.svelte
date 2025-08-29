<script>
	import { page } from '$app/stores';
	import FaqComponent from '$lib/faq/FAQComponent.svelte';
	import { onMount } from 'svelte';
	import { setAuthStatus } from '$lib/utils/helper';

	export let data;

	let route = $page.route.id;
	let { FAQData, faqCategory, lang } = data;
	let filteredFAQData = [];
	let faqSideBarList = [];
	let error = FAQData?.error ? true : false;
	let categoryError = faqCategory?.error ? true : false;

	// Filter and map FAQ data based on selected language
	$: if (!error && FAQData && lang) {
		filteredFAQData = FAQData.map((faq) => {
			const translation = faq?.translations.find((t) => t?.languageCode === lang);
			if (translation) {
				return {
					uuid: faq?.uuid,
					question: translation?.question,
					answer: translation?.answer,
					categoryId: Number(faq?.categoryId)
				};
			}
			return null;
		}).filter((item) => item !== null);
	}

	// Create a language-specific category map from faqCategory
	$: if (!categoryError) {
		const languageSpecificCategoryMap = new Map();

		faqCategory?.forEach((cat) => {
			if (cat.languageCode === lang) {
				languageSpecificCategoryMap.set(cat.extId, cat.category);
			}
		});

		// Generate the sidebar list from unique categories in filtered FAQ data
		const uniqueCategoryIds = [...new Set(filteredFAQData.map((faq) => faq.categoryId))];
		faqSideBarList = uniqueCategoryIds.map((id) => ({
			id,
			name: languageSpecificCategoryMap.get(id) || 'Unknown category'
		}));
	}

	onMount(() => {
		setAuthStatus(data?.unauthorized);
	});
</script>

<div class="2xl:max-w-7xl 2xl:m-auto">
	<FaqComponent {route} FAQ={filteredFAQData} {faqSideBarList} faqError={error} {categoryError} />
</div>
