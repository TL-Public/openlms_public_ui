export async function load({ fetch, params, parent }) {
	const parentData = await parent();
	const lang = parentData?.lang ? parentData.lang : 'en';

	const id = params.id;
    let res
	const fetchTestimonials = async () => {
		try {
			res = await fetch(`/apis/testimonials?courseUuid=${id}`);
            if(!res.ok){
                throw new Error('Failed to fetch testimonials');
            }

			const data = await res.json();
			if (!data || data.length === 0) {
                throw new Error('Testimonials not found');  

			}
			if(!data?.error){
				const filteredData = data?.filter((item) => item != null);
				return filteredData;
			}
			return { error: data?.error, status: res?.status }
		} catch (err) {
			return { error: err.message, status: res?.status }
		}
	};

	return {
		testimonials: await fetchTestimonials()
	};
}