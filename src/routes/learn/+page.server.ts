import { db } from '$lib/server/db';
import { wordTable } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { getWordsFromUserWithConjugation } from '$lib/server/db/actions/words';

export const load: PageServerLoad = async (event) => {
	const userId = event.locals.user?.id;
	if (!userId) {
		throw redirect(302, '/');
	}
	return {
		words: await getWordsFromUserWithConjugation(userId)
	};
};

export const actions = {
	handleNonVerbSubmit: async ({ request }) => {
		const data = await request.formData();
		const wordId = data.get('wordId')?.toString();
		const userTranslation = data.get('userTranslation')?.toString();

		if (!wordId || !userTranslation) {
			return { success: false, error: 'Missing wordId or userTranslation' };
		}

		const wordFromDb = await db
			.select()
			.from(wordTable)
			.where(eq(wordTable.id, Number(wordId)));

		if (wordFromDb[0].translation.trim().toLowerCase() === userTranslation.trim().toLowerCase()) {
			await db
				.update(wordTable)
				.set({
					consecutiveCorrect: sql`consecutive_correct + 1`,
					threeInARow: sql`consecutive_correct + 1 >= 3`
				})
				.where(eq(wordTable.id, Number(wordId)));
		}

		return { success: true };
	},
	handleVerbSubmit: async ({ request }) => {
		const data = await request.formData();
		const wordId = data.get('wordId')?.toString();
		const userTranslation = data.get('userTranslation')?.toString();
		const userEu = data.get('userEu')?.toString();
		const userVoceAndEle = data.get('userVoceAndEle')?.toString();
		const userNos = data.get('userNos')?.toString();
		const userElesAndVoces = data.get('userElesAndVoces')?.toString();

		await db
			.update(wordTable)
			.set({
				consecutiveCorrect: sql`consecutive_correct + 1`,
				threeInARow: sql`consecutive_correct + 1 >= 3`
			})
			.where(eq(wordTable.id, Number(wordId)));

		return { success: true };
	},
	setToMastered: async ({ request }) => {
		const data = await request.formData();
		const wordId = data.get('wordId')?.toString();

		if (!wordId) {
			return { success: false, error: 'Missing wordId' };
		}

		await db
			.update(wordTable)
			.set({ stateOfWord: 'mastered' })
			.where(eq(wordTable.id, Number(wordId)));
	},
	setToRefreshTomorrow: async ({ request }) => {
		const data = await request.formData();
		const wordId = data.get('wordId')?.toString();

		if (!wordId) {
			return { success: false, error: 'Missing wordId' };
		}

		await db
			.update(wordTable)
			.set({ stateOfWord: 'refresh_tomorrow' })
			.where(eq(wordTable.id, Number(wordId)));
	}
} satisfies Actions;
