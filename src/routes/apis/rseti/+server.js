import { json } from '@sveltejs/kit';
import { BASE_URL } from '$lib/config';

// API to get list of all RSETIs
export async function GET({ locals }) {
	let res;
	const lang = locals?.lang || 'en';
	try {
		res = await fetch(`${BASE_URL}/apis/v1/rsetis`);

		if (res?.status != 200 || !res?.ok) {
			throw new Error('Failed to fetch data');
		}
		const data = await res?.json();

		if (data?.length === 0 || Object.keys(data)?.length === 0) {
			throw new Error('No Data Found');
		}

		let rsetiData = [];
		data?.forEach((item) => {
			if (item?.translations?.length > 0) {
				const languageData = item?.translations?.find((langData) => langData?.languageCode === lang);
				const enData = item?.translations?.find((langData) => langData?.languageCode === 'en');
				if (languageData) {
					rsetiData?.push({
						...item,
						name: languageData.name,
						address: languageData.address,
						directorName: languageData.directorName
					});
				} else if (enData) {
					//if multi lingual data is missing, default to English
					rsetiData.push({
						...item,
						name: enData.name,
						address: enData.address,
						directorName: enData.directorName
					});
				}
			}
		});

		rsetiData = rsetiData.sort(function (a, b) {
			if (a.name?.toLowerCase()?.trim() < b.name?.toLowerCase()?.trim()) {
				return -1;
			}
			if (a.name?.toLowerCase()?.trim() > b.name?.toLowerCase()?.trim()) {
				return 1;
			}
			return 0;
		});

		return json(rsetiData);
	} catch (error) {
		return json({ error: error.message }, { status: res.status });
	}
}
