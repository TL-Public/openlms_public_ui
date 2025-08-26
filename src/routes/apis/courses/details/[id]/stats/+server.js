import { json } from '@sveltejs/kit';
import { BASE_URL } from '$lib/config';

console.log('in server.js of ststas')

export async function GET({ params }) {
	let res;
	try {
		res = await fetch(
			`${BASE_URL}/apis/v1/stats/courses/${params.id}`
		);

		if (res.status != 200 || !res.ok) {
			throw new Error('Failed to fetch data');
		}
		const data = await res.json();

		console.log('data', data)

		return json(data);
	} catch (error) {
		return json({ error: error.message }, { status: res.status });
	}
}
