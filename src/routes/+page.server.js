import { error, fail } from '@sveltejs/kit';
import { BASE_URL } from '$lib/config';

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    try {
			const formData = await request.formData();
			const enrollmentId = formData.get('enrollmentId');
			const uniqueId = formData.get('password'); // Assuming the name for the unique pin is 'password'
			const rseti = formData.get('rseti');

			// Validate the input fields
			if (!enrollmentId || !uniqueId || rseti === '--- Select RSETI ---') {
				return fail(400, {
					error: 'All fields are required. Please provide valid details.',
					loginDetails: { enrollmentId, uniqueId }
				});
			}

			// Make the API call
			const response = await fetch(
				`${BASE_URL}/apis/v1/auth/signin`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ username: enrollmentId, password: uniqueId })
				}
			);

			if (!response.ok) {
				const responseError = await response.json();
				return fail(response.status, {
					error: responseError.message || 'Invalid credentials.',
					loginDetails: { enrollmentId, uniqueId }
				});
			}

			// Parse the API response
			const result = await response.json();

			// Redirect or handle successful login
			if (result.accessToken) {
				//call trainee-profile api
				const token = result.accessToken;

				cookies.set('authToken', token, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24
				});

				const userDetailsResponse = await fetch(
					`${BASE_URL}/apis/v1/trainee-profiles/profile`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);

				if (!userDetailsResponse.ok) {
					return fail(500, { error: 'Failed to fetch user details' });
				}

				const userDetails = await userDetailsResponse.json();

				cookies.set('userUuid', userDetails.uuid, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24
				});

				cookies.set('name', userDetails.candidateName, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24
				});
				cookies.set('enrollId', userDetails.enrollId, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24
				});

				return {
					success: true,
					message: 'Login successful!',
					// authToken: result.accessToken,
					user: userDetails
				};
			} else {
				return fail(401, {
					error: result.message || 'Invalid credentials.',
					loginDetails: { enrollmentId, uniqueId }
				});
			}
		} catch (err) {
			throw error(500, 'An unexpected error occurred. Please try again later.');
		}
	}
  }

