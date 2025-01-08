import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	age: integer('age')
});

export const word = pgTable('word', {
	id: serial('id').primaryKey(),
	word: text('word').notNull(),
	translation: text('translation').notNull()
});

export type Word = InferSelectModel<typeof word>;
export type NewWord = InferInsertModel<typeof word>;
