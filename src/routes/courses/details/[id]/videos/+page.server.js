export async function load({ locals, fetch, cookies }) {

	// async function fetchAndStoreServiceToken() {
	// 	try {
	// 		const response = await fetch('/apis/serviceToken', {
	// 			method: 'POST',
	// 			credentials: 'include' // Ensures cookies are sent
	// 		});

			
	// 		if (!response.ok) throw new Error('Failed to get service token')
				
	// 			const data = await response.json();
			
	// 		return data.serviceToken; // Return the service token
	// 	} catch (error) {
	// 		console.error('Error fetching service token:', error.message);
	// 		return null;
	// 	}
	// }

	// return {
	// 	serviceToken: await fetchAndStoreServiceToken()
	// };
}
