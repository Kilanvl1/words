import { db } from '$lib/server/db';
import { verbConjugation, wordTable } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user === null) {
		return redirect(302, '/login');
	}
	return {
		words: (
			await db
				.select()
				.from(wordTable)
				.where(eq(wordTable.userId, Number(event.locals.user.id)))
		).sort((a, b) => a.id - b.id)
	};
};

export const actions = {
	create: async ({ locals, request }) => {
		if (locals.user === null) {
			return redirect(302, '/login');
		}
		const data = await request.formData();
		const word = data.get('word')?.toString();
		const translation = data.get('translation')?.toString();
		const isVerb = data.get('isVerb') === 'on';
		const eu = data.get('eu')?.toString();
		const voceAndEle = data.get('voceAndEle')?.toString();
		const nos = data.get('nos')?.toString();
		const elesAndVoces = data.get('elesAndVoces')?.toString();
		// TODO: server side validation
		if (!word || !translation) {
			return fail(400, {
				message: 'Please fill in all fields'
			});
		}

		if (isVerb && eu && voceAndEle && nos && elesAndVoces) {
			const conjugation = await db
				.insert(verbConjugation)
				.values({
					eu,
					voceAndEle,
					nos,
					elesAndVoces
				})
				.returning();
			await db.insert(wordTable).values({
				userId: locals.user.id,
				word: word,
				translation: translation,
				isVerb: isVerb,
				verbConjugationId: conjugation[0].id
			});
		} else {
			await db.insert(wordTable).values({
				userId: locals.user.id,
				word: word,
				translation: translation,
				isVerb: isVerb
			});
		}

		return {
			success: true,
			message: 'Word added successfully'
		};
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		await db.delete(wordTable).where(eq(wordTable.id, Number(id)));
	},
	updateStateOfWord: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const stateOfWord = data.get('stateOfWord')?.toString() as
			| 'mastered'
			| 'learning'
			| 'refresh_tomorrow';
		await db
			.update(wordTable)
			.set({ stateOfWord })
			.where(eq(wordTable.id, Number(id)));
	}
} satisfies Actions;
