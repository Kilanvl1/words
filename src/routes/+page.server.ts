import { redirect } from '@sveltejs/kit';
import { oauth2Client } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
		authenticated: event.locals?.user?.authenticated
	};
};

export const actions = {
	OAuth2: async ({}) => {
		const authorizeUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: ['https://www.googleapis.com/auth/userinfo.profile openid'],
			prompt: 'consent'
		});

		throw redirect(302, authorizeUrl);
	},
	logout: async ({ cookies }) => {
		cookies.delete('auth_token', { path: '/' });
		throw redirect(303, '/login');
	}
};
