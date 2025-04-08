import { BASE_URL } from '$lib/config';

export async function GET() {
	let res
	try {
		res = await fetch(
			`${BASE_URL}/apis/v1/stats`
		);
		if (!res.ok || res.status !== 200) {
			return new Response(res.body, { status: res.status, headers: res.headers });
		}
		const data = await res.json();
		if (data?.length===0 || Object.keys(data)?.length ===0) {
			throw new Error('No Data Found');
		}

		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: res.status,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}