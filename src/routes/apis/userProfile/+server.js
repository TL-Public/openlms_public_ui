import { json } from '@sveltejs/kit';
import { BASE_URL } from '$lib/config';

export async function GET({ cookies }) {
	let authToken = cookies.get('authToken');
	let res;
	try {
		let endPoint = `${BASE_URL}/apis/v1/trainee-profiles/profile`;

		res = await fetch(endPoint, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${authToken}`
			}
		});
		if (!res?.ok || res?.status !== 200) {
			// return new Response(res?.body, { status: res?.status, headers: res?.headers });
			throw new Error('Failed to fetch data');
		}

		const data = await res?.json();

		if (data?.length === 0 || Object.keys(data)?.length === 0) {
			throw new Error('No Data Found');
		}

		return json(data);
	} catch (error) {
		return json({ error: error.message }, { status: res?.status });
	}
}