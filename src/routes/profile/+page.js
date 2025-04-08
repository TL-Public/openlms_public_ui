export async function load({ fetch, params, parent }) {
	const parentData = await parent();
	const lang = parentData?.lang ? parentData.lang : 'en';

	const id = params.id;
    let res
	const fetchProfile = async () => {
		try {
			res = await fetch(`/apis/userProfile`);
            if(!res.ok){
                throw new Error('Failed to fetch profile data');
            }

			const data = await res.json();
			if (!data || data.length === 0) {
                throw new Error('Profile data not found');  

			}
             return data
		} catch (err) {
			return { error: err.message, status: res?.status }
		}
	};

	return {
		profileData: await fetchProfile()
	};
}