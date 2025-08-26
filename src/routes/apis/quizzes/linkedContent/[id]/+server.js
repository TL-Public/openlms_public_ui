import { json } from '@sveltejs/kit';

import { QMS_URL, CLIENT_KEY } from '/src/config/constants.js';

export async function GET({ params, request, cookies }) {
	let res;
	try {
		const id = params.id;
		const serviceToken = cookies.get('serviceToken');

		if (serviceToken) {
			let endpoint = `${QMS_URL}/apis/v1/content-question-papers/content/${id}`;
			
			const options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Service-Authorization': 'Bearer ' + serviceToken,
					'Service-Key': CLIENT_KEY
				}
			};

			res = await fetch(endpoint, options);
			if (res.status == 200) {
				const data = await res.json();
				if (Array.isArray(data) && data[0]) {
					const firstContent = data[0];
					return json(firstContent);
				}
			}

			return json(res, { status: res.status });
		}
	} catch (e) {
		console.error('error in question GET', e.message);
		return json(res, { status: 500 });
	}
}
