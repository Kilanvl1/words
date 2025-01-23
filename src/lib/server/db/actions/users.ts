import { db } from '$lib/server/db';
import { userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserByGoogleId(googleId: string) {
	const [existingUser] = await db.select().from(userTable).where(eq(userTable.googleId, googleId));
	return existingUser;
}

export async function createUser(googleId: string, name: string) {
	const [newUser] = await db
		.insert(userTable)
		.values({ googleId: googleId, name: name })
		.returning();
	return newUser;
}
