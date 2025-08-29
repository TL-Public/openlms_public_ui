import { json } from '@sveltejs/kit';
import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper.js';
export async function GET({cookies, fetch}) {
	let res;
	try {	
		const authHeader = getHeaders(cookies);
		let endPoint = `${BASE_URL}/apis/v1/courses`;

		res = await fetch(endPoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...authHeader
			}
		});
		if (!res?.ok || res?.status !== 200) {
			return new Response(res?.body, { status: res?.status, headers: res?.headers });
		}

		const data = await res.json();

		if (data?.length === 0 || Object.keys(data)?.length === 0) {
			throw new Error('No Data Found');	
		}

		return json(data);
	} catch (error) {
		return json({ error: error.message }, { status: res?.status });
	}
}
