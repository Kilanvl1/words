import { db } from '$lib/server/db';
import { word } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		words: await db.select().from(word)
	};
};

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const theWord = data.get('word')?.toString();
		const theTranslation = data.get('translation')?.toString();
		// TODO: server side validation
		if (!theWord || !theTranslation) {
			console.log('validation failed');
			return fail(400, {
				message: 'Please fill in all fields'
			});
		}

		await db.insert(word).values({
			word: theWord,
			translation: theTranslation
		});

		return {
			success: true,
			message: 'Word added successfully'
		};
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		await db.delete(word).where(eq(word.id, Number(id)));
	}
} satisfies Actions;
