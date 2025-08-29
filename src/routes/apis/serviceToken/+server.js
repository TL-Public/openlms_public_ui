import { json } from '@sveltejs/kit';
import { QMS_URL } from '/src/config/constants.js';

export async function POST({ cookies }) {

	const clientId = cookies.get('appConfig_clientId');
	const clientKey = cookies.get('appConfig_clientKey');

	if (!clientId || !clientKey) {
		return json({ error: 'Missing credentials' }, { status: 500 });
	}

	try {
		// Call the external API to generate a service token
		const response = await fetch(
			`${QMS_URL}/apis/v1/service-auth/token`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ clientId: clientId, clientSecret: clientKey })
			}
		);

		if (!response.ok) {
			return json({ error: 'Failed to generate token' }, { status: 500 });
		}

		const data = await response.text();
		const serviceToken = data;
		

		// Set the service token in cookies (expires in 1 month)
		cookies.set('serviceToken', serviceToken, {
			path: '/', // Accessible across the whole site
			httpOnly: true, // Prevents access from JavaScript (security measure)
			secure: true, // Ensures the cookie is only sent over HTTPS
			sameSite: 'lax', // Protects against CSRF attacks
			maxAge: 30 * 24 * 60 * 60 // 1 month expiry
		});
		

		return json({ serviceToken }, { status: 200 });
	} catch (error) {
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
