import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper.js';

export async function GET({ params, request, cookies }) {
	let res;
	try {
		const authHeader = getHeaders(cookies);
		let queryparams = request.url.split('?');
		let endPoint = `${BASE_URL}/apis/v1/courses/${params.id}`;
		if (queryparams?.length > 1) {
			endPoint += '?' + queryparams[1];
		}
		res = await fetch(endPoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...authHeader
			}
		});

		if (!res.ok || res.status !== 200) {
			throw new Error('No Data Found');
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
		return new Response(res.body, { status: res.status, headers: res.headers });
	}
}
