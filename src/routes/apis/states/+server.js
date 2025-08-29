import { json } from '@sveltejs/kit';
import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper';	

// API to get list of all states
export async function GET({ cookies }) {
	let res;
	try {
		const authHeader = getHeaders(cookies);
		res = await fetch(`${BASE_URL}/apis/v1/states`, {
			headers: {
				'Content-Type': 'application/json',
				...authHeader
			}
		});

		if (!res.ok || res.status !== 200) {
			throw new Error('Failed to fetch states data');
		}
		const data = await res.json();
		// sort data before returning response
		data.sort(function (a, b) {
			if (a.name.toLowerCase().trim() < b.name.toLowerCase().trim()) {
				return -1;
			}
			if (a.name.toLowerCase().trim() > b.name.toLowerCase().trim()) {
				return 1;
			}
			return 0;
		});

		return json(data);
	} catch (error) {
		return json({ error: error.message }, { status: res.status });
	}
}
