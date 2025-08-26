import { json } from '@sveltejs/kit';
import { isObject } from '$lib/utils/helper.js';
import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper';


export async function GET({ params, locals, cookies }) {
	let res;
	const lang = locals?.lang || 'en';
	try {
		const authHeader = getHeaders(cookies);
		res = await fetch(	
			`${BASE_URL}/apis/v1/rsetis/${params.id}`,
			{
				method:'GET',
				headers:{
					'Content-Type': 'application/json',
					...authHeader
				}
			}
		);

		if (!res.ok || res.status !== 200) {
			throw new Error('Failed to fetch Rseti details');
		}
		let data = await res.json();
		const languageData = data?.translations?.find((langData) => langData?.languageCode === lang);
		const enData = data?.translations?.find((langData) => langData?.languageCode === 'en');

		if (languageData && isObject(languageData)) {
			data = { ...data, ...languageData };
		}
		//default to English when multi lingual data is missing
		if (!languageData && isObject(enData)) {
			data = { ...data, ...enData };
		}
		return json(data, { status: res.status });
	} catch (error) {
		return json({ error: error.message }, { status: res.status });
	}
}
