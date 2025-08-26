import { json } from '@sveltejs/kit';
import { BASE_URL } from '$lib/config';
import { getHeaders } from '$lib/utils/helper';
export async function PUT({ cookies, request, params }) {
	let authHeader = getHeaders(cookies);
	let res;
	let { id } = params;
	try {
		let endPoint = `${BASE_URL}/apis/v1/trainee-profiles/${id}`;

		const body = await request.json();

		res = await fetch(endPoint, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				...authHeader
			},
			body: JSON.stringify(body)
		});

		if (!res?.ok || res?.status !== 200) {
			// return new Response(res?.body, { status: res?.status, headers: res?.headers });
			throw new Error('Failed to change preferred language.');
		}

		const data = await res?.json();

		if (data?.length === 0 || Object.keys(data)?.length === 0) {
			throw new Error('No Data Found');
		}

		cookies.set('videoPreferredLanguage', data?.videoPreferredLanguage, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24
		});

		if (data?.preferredLanguage) {
			cookies.set('language', data?.preferredLanguage, {
				path: '/',
				httpOnly: false,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24
			})
		}

		return json(data);
	} catch (error) {
		return json({ error: error.message }, { status: res?.status });
	}
}
