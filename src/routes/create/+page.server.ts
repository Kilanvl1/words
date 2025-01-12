import { db } from '$lib/server/db';
import { verbConjugation, word } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		words: (await db.select().from(word)).sort((a, b) => a.id - b.id)
	};
};

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const theWord = data.get('word')?.toString();
		const theTranslation = data.get('translation')?.toString();
		const theIsVerb = data.get('isVerb') === 'on';
		const theEu = data.get('eu')?.toString();
		const theVoce = data.get('voce')?.toString();
		const theEle = data.get('ele')?.toString();
		const theNos = data.get('nos')?.toString();
		const theVos = data.get('vos')?.toString();
		const theEles = data.get('eles')?.toString();
		// TODO: server side validation
		if (!theWord || !theTranslation) {
			return fail(400, {
				message: 'Please fill in all fields'
			});
		}

		if (theIsVerb && theEu && theVoce && theEle && theNos && theVos && theEles) {
			const conjugation = await db
				.insert(verbConjugation)
				.values({
					eu: theEu,
					voce: theVoce,
					ele: theEle,
					nos: theNos,
					vos: theVos,
					eles: theEles
				})
				.returning();
			await db.insert(word).values({
				word: theWord,
				translation: theTranslation,
				isVerb: theIsVerb,
				verbConjugationId: conjugation[0].id
			});
		} else {
			await db.insert(word).values({
				word: theWord,
				translation: theTranslation,
				isVerb: theIsVerb
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
		await db.delete(word).where(eq(word.id, Number(id)));
	},
	updateStateOfWord: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const stateOfWord = data.get('stateOfWord')?.toString() as
			| 'mastered'
			| 'learning'
			| 'refresh_tomorrow';
		await db
			.update(word)
			.set({ state_of_word: stateOfWord })
			.where(eq(word.id, Number(id)));
	}
} satisfies Actions;
