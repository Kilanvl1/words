import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

// User table
export const userTable = pgTable('user', {
	id: serial('id').primaryKey(),
	googleId: text('google_id').notNull().unique(),
	name: text('name').notNull()
});

export type User = InferSelectModel<typeof userTable>;
export type NewUser = InferInsertModel<typeof userTable>;

// Session table
export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type Session = InferSelectModel<typeof sessionTable>;
export type NewSession = InferInsertModel<typeof sessionTable>;

// Word table
export const word = pgTable('word', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id')
		.references(() => userTable.id)
		.notNull(),
	word: text('word').notNull(),
	translation: text('translation').notNull(),
	consecutive_correct: integer('consecutive_correct').notNull().default(0),
	three_in_a_row: boolean('three_in_a_row').notNull().default(false),
	state_of_word: text('state_of_word', { enum: ['learning', 'mastered', 'refresh_tomorrow'] })
		.notNull()
		.default('learning'),
	scheduled_update_time: timestamp('scheduled_update_time'),
	is_verb: boolean('is_verb').notNull().default(false),
	verb_conjugation_id: integer('verb_conjugation_id').references(() => verbConjugation.id)
});

export type Word = InferSelectModel<typeof word>;
export type NewWord = InferInsertModel<typeof word>;

// Verb conjugation table
export const verbConjugation = pgTable('verb_conjugation', {
	id: serial('id').primaryKey(),
	eu: text('eu').notNull(),
	voce: text('voce').notNull(),
	ele: text('ele').notNull(),
	nos: text('nos').notNull(),
	vos: text('vos').notNull(),
	eles: text('eles').notNull()
});

export type VerbConjugation = InferSelectModel<typeof verbConjugation>;
export type NewVerbConjugation = InferInsertModel<typeof verbConjugation>;
