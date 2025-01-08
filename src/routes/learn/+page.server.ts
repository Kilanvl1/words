import { db } from '$lib/server/db';
import { word } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		words: await db.select().from(word)
	};
};
