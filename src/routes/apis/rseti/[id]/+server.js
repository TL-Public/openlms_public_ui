import { json } from '@sveltejs/kit';
import { isObject } from '$lib/utils/helper.js';
import { BASE_URL } from '$lib/config';

export async function GET({ params, locals }) {
	let res;
	const lang = locals?.lang || 'en';
	try {
		res = await fetch(
			`${BASE_URL}/apis/v1/rsetis/${params.id}`
		);

		if (!res.ok || res.status !== 200) {
			throw new Error('Failed to fetch Rseti details');
		}
		let data = await res?.json();
		const languageData = data?.translations?.find((langData) => langData?.languageCode === lang);
		const enData = data?.translations?.find((langData) => langData?.languageCode === 'en');

		if (languageData && isObject(languageData)) {
			data = { ...data, ...languageData };
		}
		//default to English when multi lingual data is missing
		if (!languageData && isObject(enData)) {
			data = { ...data, ...enData };
		}
		return json(data);
	} catch (error) {
		return json({ error: error.message }, { status: res.status });
	}
}
