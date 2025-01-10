import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel, sql, SQL } from 'drizzle-orm';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	age: integer('age')
});

export const word = pgTable('word', {
	id: serial('id').primaryKey(),
	word: text('word').notNull(),
	translation: text('translation').notNull(),
	consecutive_correct: integer('consecutive_correct').notNull().default(0),
	three_in_a_row: boolean('three_in_a_row').notNull().default(false),
	state_of_word: text('state_of_word', { enum: ['learning', 'mastered', 'refresh_tomorrow'] })
		.notNull()
		.default('learning')
});

export type Word = InferSelectModel<typeof word>;
export type NewWord = InferInsertModel<typeof word>;
