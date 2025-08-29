import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper';
export async function GET({ request, cookies		 }) {
	let res;
	try {
		const authHeader = getHeaders(cookies);
		let queryparams = request.url.split('?');
		let endPoint = `${BASE_URL}/apis/v1/faqs`;
		if (queryparams?.length > 1) {
			endPoint += '?' + queryparams[1];
		}
		 res = await fetch(endPoint, {
			method:'GET',
			headers:{
				'Content-Type': 'application/json',
				...authHeader
			}
		});	
		if (!res.ok || res.status !== 200) {
			throw new Error('Failed to fetch data');
		}
		const data = await res.json();
		if (data?.length===0 || Object.keys(data)?.length ===0) {
			throw new Error('No Data Found');
		}


		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' },
			status: res.status
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { 'Content-Type': 'application/json' },
			status: res.status
		});
	}
}
