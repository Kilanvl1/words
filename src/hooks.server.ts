// src/hooks.server.ts
import { NODE_ENV } from '$env/static/private';
import { oauth2Client } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const authToken = event.cookies.get('auth_token');

	if (authToken) {
		const tokens = JSON.parse(authToken);
		oauth2Client.setCredentials(tokens);

		// Check if token needs refresh
		if (tokens.expiry_date && Date.now() > tokens.expiry_date) {
			const { credentials } = await oauth2Client.refreshAccessToken();
			event.cookies.set('auth_token', JSON.stringify(credentials), {
				path: '/',
				httpOnly: true,
				secure: NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7
			});
		}
		// Add user info to locals for use in routes
		event.locals.user = { authenticated: true };
	}

	return resolve(event);
};
