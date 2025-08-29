export async function load({ fetch, params, parent }) {
	const parentData = await parent();
	const lang = parentData?.lang ? parentData.lang : 'en';
	const courseTitle = parentData?.courseTitle ? parentData.courseTitle : '';

	const id = params.id;

	const fetchTestimonials = async () => {
		try {
			const res = await fetch(`/apis/testimonials?courseUuid=${id}`);
			if (res.status == 404) {
				return [];
			}

			const data = await res.json();
			if (!data || data.length === 0) {
				return [];
			}
			let testimonialData = [];
			testimonialData = data
				.filter((item) => {
					if (item != null) return true;
				})
				.map((item) => {
					const langData = item.translations.find(
						(translation) => translation.languageCode === lang
					);
					const enData = item.translations.find((translation) => translation.languageCode === 'en');

					let requiredLangData = langData ? langData : enData;
					if (requiredLangData) {
						return {
							courseUuid: item.courseUuid,
							uuid: item.uuid,
							name: requiredLangData.name,
							designation: requiredLangData.designation,
							testimonialText: requiredLangData.testimonialText,
							place: requiredLangData.place
						};
					}
				});
			return testimonialData;
		} catch (err) {
			return [];
		}
	};

	async function fetchAndStoreServiceToken() {
		try {
			const response = await fetch('/apis/serviceToken', {
				method: 'POST',
				credentials: 'include' // Ensures cookies are sent
			});

			
			if (!response.ok) throw new Error('Failed to get service token')
				
				const data = await response.json();
			
			return data.serviceToken; // Return the service token
		} catch (error) {
			console.error('Error fetching service token:', error.message);
			return null;
		}
	}

	return {
		testimonials: await fetchTestimonials(),
		serviceToken: await fetchAndStoreServiceToken(),
		pageTitle: `Videos - ${courseTitle}`,
	};
}
