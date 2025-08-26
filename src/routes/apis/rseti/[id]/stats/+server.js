import { json } from '@sveltejs/kit';
import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper';
export async function GET({ params, cookies }) {
	let res;
	try {
		const authHeader = getHeaders(cookies);
		res = await fetch(
			`${BASE_URL}/apis/v1/stats/rsetis/${params.id}`,
			{
				method:'GET',
				headers:{
					'Content-Type': 'application/json',
					...authHeader
				}
			}
		);

		if (res.status != 200 || !res.ok) {
			throw new Error('Failed to fetch data');
		}
		const data = await res.json();

		return json(data, { status: res.status });
	} catch (error) {
		return json({ error: error.message }, { status: res.status });
	}
}
