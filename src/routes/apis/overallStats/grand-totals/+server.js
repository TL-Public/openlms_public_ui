import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper';

export async function GET({ cookies }) {
	let res;
	try {
		const authHeaders = getHeaders(cookies);
		res = await fetch(`${BASE_URL}/apis/v1/historic-data/grand-total`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', ...authHeaders }
		});
		
		if (!res.ok || res.status !== 200) {
			return new Response(res.body, { status: res.status, headers: res.headers });
		}
		const data = await res.json();
		if (data?.length === 0 || Object.keys(data)?.length === 0) {
			return new Response(JSON.stringify(data), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: res.status,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
