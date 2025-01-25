import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db'; // adjust import path as needed
import { wordTable } from '$lib/server/db/schema'; // adjust import path as needed
import { eq, sql } from 'drizzle-orm';

export async function POST({ request }) {
	const { wordId } = await request.json();

	try {
		await db
			.update(wordTable)
			.set({
				consecutiveCorrect: sql`consecutive_correct + 1`,
				threeInARow: sql`consecutive_correct + 1 >= 3`
			})
			.where(eq(wordTable.id, wordId));

		const updatedWord = await db.select().from(wordTable).where(eq(wordTable.id, wordId));

		return json({ success: true, updatedWord });
	} catch (error) {
		return json(
			{ success: false, error: 'Failed to update consecutive correct count' },
			{ status: 500 }
		);
	}
}
