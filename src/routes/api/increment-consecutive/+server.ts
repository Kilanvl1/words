import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db'; // adjust import path as needed
import { word } from '$lib/server/db/schema'; // adjust import path as needed
import { eq, sql } from 'drizzle-orm';

export async function POST({ request }) {
	const { wordId } = await request.json();

	try {
		await db
			.update(word)
			.set({
				consecutive_correct: sql`consecutive_correct + 1`,
				three_in_a_row: sql`consecutive_correct + 1 >= 3`
			})
			.where(eq(word.id, wordId));

		const updatedWord = await db.select().from(word).where(eq(word.id, wordId));

		return json({ success: true, updatedWord });
	} catch (error) {
		return json(
			{ success: false, error: 'Failed to update consecutive correct count' },
			{ status: 500 }
		);
	}
}
