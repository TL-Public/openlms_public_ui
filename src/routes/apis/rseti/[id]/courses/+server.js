import { convertYMDtoDMY } from '$lib/utils/helper';
import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper';


export async function GET({ params, cookies }) {
	let res;
	try {
		const authHeader = getHeaders(cookies);
		res = await fetch(`${BASE_URL}/apis/v1/rsetis/${params.id}/courses`, {
			method:'GET',
			headers:{
				'Content-Type': 'application/json',
				...authHeader
			}
		});	
		if (res.status !== 200 || !res.ok) throw new Error('Failed to fetch courses');

		const data = await res.json();

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
