import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db'; // adjust import path as needed
import { word } from '$lib/server/db/schema'; // adjust import path as needed
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
	const { wordId, stateOfWord } = await request.json();

	try {
		await db
			.update(word)
			.set({
				state_of_word: stateOfWord
			})
			.where(eq(word.id, wordId));

		return json({ success: true });
	} catch (error) {
		return json({ success: false, error: 'Failed to update state of word' }, { status: 500 });
	}
}
