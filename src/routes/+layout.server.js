import '$lib/locals/i18n.js';
import { BASE_URL } from '$lib/config';

export async function load({ locals, cookies, fetch }) {
	const lang = locals.lang;
	let userdetails = locals.user ? locals.user : {};

		//  If logged in, fetch fresh user profile from API
	if (cookies.get('userUuid')) {
		try {
			const profileRes = await fetch(`/apis/userProfile`, {
				headers: {
					method:'GET',
					Authorization: `Bearer ${cookies.get('token')}` 
				}
			});
			if (profileRes.ok) {
				const profileData = await profileRes.json();
				userdetails = { ...userdetails, ...profileData };
			} else {
				console.warn('Failed to fetch user profile:', profileRes.statusText);
			}
		} catch (err) {
			console.error('Error fetching user profile:', err);
		}
	}

	// Fetch app configuration
	try {
		const appConfigResponse = await fetch(`${BASE_URL}/apis/v1/app-config`);
		
		if (appConfigResponse.ok) {
			const appConfig = await appConfigResponse.json();
			
			// Check if appConfig is an array and not empty
			if (Array.isArray(appConfig) && appConfig.length > 0) {
				// Process each item in appConfig
				appConfig.forEach(item => {
					// Validate that item has both key and value properties
					if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
						// Set cookie with key as name and value as value
						cookies.set(`appConfig_${item.key}`, item.value, {
							path: '/',
							httpOnly: true,
							sameSite: 'strict',
							secure: process.env.NODE_ENV === 'production',
							maxAge: 60 * 60 * 24
						});
					}
				});
			} else {
				console.log('App configuration is not a valid array or is empty');
			}
		} else {
			console.log('Failed to fetch app configuration:', appConfigResponse.statusText);
		}
	} catch (error) {
		console.error('Failed to fetch app configuration:', error);
	}

	let session = {
		language: (cookies.get('userUuid')? userdetails?.preferredLanguage : lang )|| 'en',
		user: { ...userdetails, name: cookies.get('name'), userUuid: cookies.get('userUuid') }
	};

	return { session };
}
