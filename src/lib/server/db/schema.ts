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
export const wordTable = pgTable('word', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => userTable.id)
		.notNull(),
	word: text('word').notNull(),
	translation: text('translation').notNull(),
	consecutiveCorrect: integer('consecutive_correct').notNull().default(0),
	threeInARow: boolean('three_in_a_row').notNull().default(false),
	stateOfWord: text('state_of_word', { enum: ['learning', 'mastered', 'refresh_tomorrow'] })
		.notNull()
		.default('learning'),
	scheduledUpdateTime: timestamp('scheduled_update_time'),
	isVerb: boolean('is_verb').notNull().default(false),
	verbConjugationId: integer('verb_conjugation_id').references(() => verbConjugation.id)
});

export type Word = InferSelectModel<typeof wordTable>;
export type NewWord = InferInsertModel<typeof wordTable>;

// Verb conjugation table
export const verbConjugation = pgTable('verb_conjugation', {
	id: serial('id').primaryKey(),
	eu: text('eu').notNull(),
	voceAndEle: text('voce_and_ele').notNull(),
	nos: text('nos').notNull(),
	elesAndVoces: text('eles_and_voces').notNull()
});

export type VerbConjugation = InferSelectModel<typeof verbConjugation>;
export type NewVerbConjugation = InferInsertModel<typeof verbConjugation>;
