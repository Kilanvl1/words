import { db } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
import { wordTable, verbConjugation } from '../schema';

export async function getWordsFromUserWithConjugation(userId: number) {
	const words = await db
		.select()
		.from(wordTable)
		.where(and(eq(wordTable.userId, userId), eq(wordTable.stateOfWord, 'learning')))
		.leftJoin(verbConjugation, eq(wordTable.verbConjugationId, verbConjugation.id));

	return words.sort((a, b) => a.word.id - b.word.id);
}

export type InferredType = Awaited<ReturnType<typeof getWordsFromUserWithConjugation>>;
