import { redirect } from '@sveltejs/kit';
import { NODE_ENV } from '$env/static/private';
import { oauth2Client } from '$lib/server/auth';

export const GET = async ({ url, cookies }) => {
	const code = url.searchParams.get('code') ?? '';

	try {
		const response = await oauth2Client.getToken(code);

		oauth2Client.setCredentials(response.tokens);

		const user = oauth2Client.credentials;

		console.log('Auth tokens received', user);

		cookies.set('auth_token', JSON.stringify(user), {
			path: '/',
			httpOnly: true,
			secure: NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7
		});
	} catch (error) {
		console.error('Error logging in with Google', error);
	}
	throw redirect(303, '/');
};
