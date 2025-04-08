import '$lib/locals/i18n.js';

export async function load({ locals, cookies }) {
	const lang = locals.lang;
	const userdetails = locals.user ? locals.user : {};
	let session = {
		language: lang || 'en',
		user: { ...userdetails, name: cookies.get('name'), userUuid: cookies.get('userUuid')  }
	};

	return { session };
}
