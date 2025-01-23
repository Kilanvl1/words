import { fail, redirect } from '@sveltejs/kit';
import { google } from '$lib/server/auth';
import type { PageServerLoad, RequestEvent } from './$types';
import { generateState, generateCodeVerifier } from 'arctic';
import { deleteSessionTokenCookie } from '$lib/server/db/actions/sessions';
import { invalidateSession } from '$lib/server/db/actions/sessions';

export const load: PageServerLoad = async (event) => {
	return {
		user: event.locals.user
	};
};

export const actions = {
	OAuth2: async (event: RequestEvent) => {
		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'profile']);

		event.cookies.set('google_oauth_state', state, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10, // 10 minutes
			sameSite: 'lax'
		});
		event.cookies.set('google_code_verifier', codeVerifier, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10, // 10 minutes
			sameSite: 'lax'
		});

		return redirect(302, url.toString());
	},
	logout: async (event) => {
		if (event.locals.session === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, '/');
	}
};
