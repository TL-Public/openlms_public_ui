import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper';
export async function GET({ params, request, cookies }) {
	try {
		let queryparams = request.url.split('?');
		const { id } = params;
		
		let endPoint = `${BASE_URL}/apis/v1/courses/${id}/course-videos`;
		if (queryparams?.length > 1) {
			endPoint += '?' + queryparams[1];
		}
		const authHeader = getHeaders(cookies);
		const res = await fetch(endPoint, {
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
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({error:error.message}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}
