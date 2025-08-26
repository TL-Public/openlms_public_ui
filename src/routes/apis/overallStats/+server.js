import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper';

export async function GET({ cookies }) {
	let res;
	try {
		const authHeaders = getHeaders(cookies);
		res = await fetch(`${BASE_URL}/apis/v1/stats`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', ...authHeaders }
		});
		if (!res.ok || res.status !== 200) {
			const errorBody = await res.text();
			return new Response(errorBody, { status: res.status, headers: res.headers });
		}
		const data = await res.json();
		if (data?.length === 0 || Object.keys(data)?.length === 0) {
			throw new Error('No Data Found');
		}

		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: res?.status || 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
