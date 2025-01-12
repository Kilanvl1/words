import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

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
		.default('learning'),
	scheduledUpdateTime: timestamp('scheduled_update_time'),
	isVerb: boolean('is_verb').notNull().default(false),
	verbConjugationId: integer('verb_conjugation_id').references(() => verbConjugation.id)
});

export const verbConjugation = pgTable('verb_conjugation', {
	id: serial('id').primaryKey(),
	eu: text('eu').notNull(),
	voce: text('voce').notNull(),
	ele: text('ele').notNull(),
	nos: text('nos').notNull(),
	vos: text('vos').notNull(),
	eles: text('eles').notNull()
});

export type Word = InferSelectModel<typeof word>;
export type NewWord = InferInsertModel<typeof word>;
export type VerbConjugation = InferSelectModel<typeof verbConjugation>;
export type NewVerbConjugation = InferInsertModel<typeof verbConjugation>;
