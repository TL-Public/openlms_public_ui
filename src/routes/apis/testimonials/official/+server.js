import { BASE_URL } from '$lib/config';

export async function GET({request}) {
	try {
		let queryparams = request.url.split('?');
		let endPoint = `${BASE_URL}/apis/v1/testimonials`;
		if (queryparams?.length > 1) {
			endPoint += '?' + queryparams[1];
		}
		const res = await fetch(endPoint);
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
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
