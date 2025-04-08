import { BASE_URL } from '$lib/config';

export async function GET() {
	let res;
	try {
		res = await fetch(
			`${BASE_URL}/apis/v1/historic-data-monthwise/trainee-count-by-categories`
		);
		if (!res.ok || res.status !== 200) {
			return new Response(res.body, { status: res.status, headers: res.headers });
		}
		const data = await res.json();
		if (data?.length === 0 || Object.keys(data)?.length === 0) {
			return new Response(JSON.stringify(data), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}); }

		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message, status: res.status }), {
			status: res.status,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
