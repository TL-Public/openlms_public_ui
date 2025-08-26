// write load function to fetch data from api and store it in a variable

export async function load({ fetch, parent }) {
	const parentData = await parent();
	const lang = parentData?.lang || 'en';
	let unauthorized = parentData?.unauthorized ?? false;

	// Fetch FAQs based on language
	const fetchFaq = async () => {
		let res;
		try {
			 res = await fetch(`/apis/faq`);

			if (!res.ok) {
				if(res.status === 401){
					unauthorized = true;
				}
				throw new Error('Failed to fetch faq');
			}

			const data = await res.json();
			if (!data || data.length === 0) {
				throw new Error('No Data Found');
			}

			return data;
		} catch (err) {
			
			return { error: err.message, status: res.status }
		}
	};

	const fetchFaqCategoryList = async (lang) => {
		let res;
		try {
			res = await fetch(`/apis/faq/category`);
			if (!res.ok) {
				if(res.status === 401){
					unauthorized = true;
				}
				throw new Error('Failed to fetch data');
			}
			const data = await res.json();
			if (!data || data.length === 0) {
				throw new Error('No Data Found');
			}
			return data;
		} catch (err) {
			
			return { error: err.message, status: res.status }
		}
	};

	return {
		FAQData: await fetchFaq(),
		faqCategory: await fetchFaqCategoryList(),
		unauthorized
	};
}
