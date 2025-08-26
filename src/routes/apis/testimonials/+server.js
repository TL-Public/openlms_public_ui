import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper';
export async function GET({ request, cookies }) {
	let res;
	try {
		
		let queryparams = request.url.split('?');
		let endPoint = `${BASE_URL}/apis/v1/traineetestimonials`;

		if (queryparams?.length > 1) {
			endPoint += '?' + queryparams[1];
		}
		const authHeader = getHeaders(cookies);	
		res = await fetch(endPoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...authHeader
			}
		});
		
		if (!res.ok || res.status !== 200) {
			return new Response(res.body, { status: res.status, headers: res.headers });
		}
		const data = await res.json();
		if (data?.length===0 || Object.keys(data)?.length ===0) {
			throw new Error('No Data Found');
		}

		return new Response(JSON.stringify(data), {
			status: res.status,
			headers: { 'Content-Type': 'application/json' },
			
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}
