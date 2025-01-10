import { db } from '$lib/server/db';
import { word } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		words: (await db.select().from(word).where(eq(word.state_of_word, 'learning'))).sort(
			(a, b) => a.id - b.id
		)
	};
};

export const actions = {
	incrementConsecutive: async ({ request }) => {
		const data = await request.formData();
		const wordId = data.get('wordId')?.toString();
		const userInput = data.get('userInput')?.toString();

		if (!wordId || !userInput) {
			return { success: false, error: 'Missing wordId or userInput' };
		}

		const wordFromDb = await db
			.select()
			.from(word)
			.where(eq(word.id, Number(wordId)));

		if (wordFromDb[0].translation.trim().toLowerCase() === userInput.trim().toLowerCase()) {
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
