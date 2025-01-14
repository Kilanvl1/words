import { db } from '$lib/server/db';
import { verbConjugation, word } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	return {
		words: (
			await db
				.select()
				.from(word)
				.leftJoin(verbConjugation, eq(word.verb_conjugation_id, verbConjugation.id))
		).sort((a, b) => a.word.id - b.word.id)
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
			.from(word)
			.where(eq(word.id, Number(wordId)));

		if (wordFromDb[0].translation.trim().toLowerCase() === userTranslation.trim().toLowerCase()) {
			await db
				.update(word)
				.set({
					consecutive_correct: sql`consecutive_correct + 1`,
					three_in_a_row: sql`consecutive_correct + 1 >= 3`
				})
				.where(eq(word.id, Number(wordId)));
		}

		return { success: true };
	},
	handleVerbSubmit: async ({ request }) => {
		const data = await request.formData();
		const wordId = data.get('wordId')?.toString();
		const userTranslation = data.get('userTranslation')?.toString();
		const userEu = data.get('userEu')?.toString();
		const userVoce = data.get('userVoce')?.toString();
		const userEle = data.get('userEle')?.toString();
		const userNos = data.get('userNos')?.toString();
		const userVos = data.get('userVos')?.toString();
		const userEles = data.get('userEles')?.toString();

		await db
			.update(word)
			.set({
				consecutive_correct: sql`consecutive_correct + 1`,
				three_in_a_row: sql`consecutive_correct + 1 >= 3`
			})
			.where(eq(word.id, Number(wordId)));

		return { success: true };
	},
	setToMastered: async ({ request }) => {
		const data = await request.formData();
		const wordId = data.get('wordId')?.toString();

		if (!wordId) {
			return { success: false, error: 'Missing wordId' };
		}

		await db
			.update(word)
			.set({ state_of_word: 'mastered' })
			.where(eq(word.id, Number(wordId)));
	},
	setToRefreshTomorrow: async ({ request }) => {
		const data = await request.formData();
		const wordId = data.get('wordId')?.toString();

		if (!wordId) {
			return { success: false, error: 'Missing wordId' };
		}

		await db
			.update(word)
			.set({ state_of_word: 'refresh_tomorrow' })
			.where(eq(word.id, Number(wordId)));
	}
} satisfies Actions;
