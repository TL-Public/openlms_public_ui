import { locale } from 'svelte-i18n';

export const handle = async ({ event, resolve }) => {
	const cookieLang = event?.cookies?.get('language');
	const authToken = event?.cookies?.get('authToken');
	const name = event?.cookies?.get('name');
	const videoPreferredLanguage = event?.cookies?.get('videoPreferredLanguage');

	const lang = cookieLang || 'en';

	if (lang) {
		// locale.set(lang);
		event.locals.lang = lang; // Pass the language to the load function
	}

	if (authToken && name) {
		event.locals.user = {
			isAuthenticated: true,
			videoPreferredLanguage: videoPreferredLanguage
		};
		// return await resolve(event);
	} else {
		event.locals.user = { isAuthenticated: false };
	}
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
