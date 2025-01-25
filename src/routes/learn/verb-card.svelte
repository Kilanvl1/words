<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button, buttonVariants } from '$lib/components/ui/button';

	import type { VerbConjugation } from '$lib/server/db/schema.js';
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { cn } from '$lib/utils';
	import type { InferredType } from '$lib/server/db/actions/words';

	type WordDataForm = {
		id: string;
		translation: string;
	};

	type UserSubmit = {
		wordData: WordDataForm;
		conjugationData: VerbConjugation;
	};

	let {
		word,
		handleIncorrectAnswer,
		shouldReset = $bindable()
	}: {
		word: InferredType[number];
		handleIncorrectAnswer: (wordId: number) => void;
		shouldReset: boolean;
	} = $props();
	let userSubmit = $state<UserSubmit>({
		wordData: { id: '', translation: '' },
		conjugationData: {
			id: word.word.id,
			eu: '',
			voceAndEle: '',
			nos: '',
			elesAndVoces: ''
		}
	});

	let isCorrect = $state<boolean | null>(null);
	let attempts = $state(0);

	$effect(() => {
		shouldReset;
		isCorrect = null;
		attempts = 0;
		userSubmit = {
			wordData: { id: '', translation: '' },
			conjugationData: {
				id: word.word.id,
				eu: '',
				voceAndEle: '',
				nos: '',
				elesAndVoces: ''
			}
		};
	});

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		attempts++;
		// Case-insensitive comparison and trim whitespace
		const euConjugation = word.verb_conjugation?.eu.trim().toLowerCase() ?? '';
		const voceAndEleConjugation = word.verb_conjugation?.voceAndEle.trim().toLowerCase() ?? '';
		const nosConjugation = word.verb_conjugation?.nos.trim().toLowerCase() ?? '';
		const elesAndVocesConjugation = word.verb_conjugation?.elesAndVoces.trim().toLowerCase() ?? '';

		isCorrect =
			userSubmit.wordData.translation.trim().toLowerCase() ===
				word.word.translation.trim().toLowerCase() &&
			userSubmit.conjugationData.eu.trim().toLowerCase() === euConjugation &&
			userSubmit.conjugationData.voceAndEle.trim().toLowerCase() === voceAndEleConjugation &&
			userSubmit.conjugationData.nos.trim().toLowerCase() === nosConjugation &&
			userSubmit.conjugationData.elesAndVoces.trim().toLowerCase() === elesAndVocesConjugation;

		if (!isCorrect) {
			cancel();
		}

		if (isCorrect && attempts === 3) {
			handleIncorrectAnswer(word.word.id);
		}

		return async ({ update }) => {
			update({ reset: false });
		};
	};
</script>

<div class="text-2xl font-bold">{word.word.word}</div>

<div class="w-full space-y-4">
	<form method="POST" action="?/handleVerbSubmit" use:enhance={handleSubmit}>
		<Input type="hidden" name="wordId" value={word.word.id} />
		<Input
			bind:value={userSubmit.wordData.translation}
			placeholder="Enter translation"
			name="userTranslation"
			class={cn(
				'mb-4',
				isCorrect !== null &&
					(userSubmit.wordData.translation.trim().toLowerCase() ===
					word.word.translation.trim().toLowerCase()
						? 'border-green-500'
						: 'border-red-500')
			)}
		/>
		<Input
			bind:value={userSubmit.conjugationData.eu}
			placeholder="Eu"
			name="userEu"
			class={cn(
				'mb-4',
				isCorrect !== null &&
					(userSubmit.conjugationData.eu.trim().toLowerCase() ===
					(word.verb_conjugation?.eu.trim().toLowerCase() ?? '')
						? 'border-green-500'
						: 'border-red-500')
			)}
		/>
		<Input
			bind:value={userSubmit.conjugationData.voceAndEle}
			placeholder="Voce/ele"
			name="userVoce"
			class={cn(
				'mb-4',
				isCorrect !== null &&
					(userSubmit.conjugationData.voceAndEle.trim().toLowerCase() ===
					(word.verb_conjugation?.voceAndEle.trim().toLowerCase() ?? '')
						? 'border-green-500'
						: 'border-red-500')
			)}
		/>
		<Input
			bind:value={userSubmit.conjugationData.nos}
			placeholder="Nos"
			name="userNos"
			class={cn(
				'mb-4',
				isCorrect !== null &&
					(userSubmit.conjugationData.nos.trim().toLowerCase() ===
					(word.verb_conjugation?.nos.trim().toLowerCase() ?? '')
						? 'border-green-500'
						: 'border-red-500')
			)}
		/>
		<Input
			bind:value={userSubmit.conjugationData.elesAndVoces}
			placeholder="Eles/voces"
			name="userEles"
			class={cn(
				'mb-4',
				isCorrect !== null &&
					(userSubmit.conjugationData.elesAndVoces.trim().toLowerCase() ===
					(word.verb_conjugation?.elesAndVoces.trim().toLowerCase() ?? '')
						? 'border-green-500'
						: 'border-red-500')
			)}
		/>
		<Button type="submit" class={cn(buttonVariants({ variant: 'hollow' }), 'w-full')}>Check</Button>
	</form>

	{#if isCorrect !== null}
		<div
			transition:fly={{ y: 20, duration: 300 }}
			class={`rounded-md p-4 text-center ${
				isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
			}`}
		>
			{#if isCorrect}
				Correct! 🎉
			{:else}
				Try again! Attempt {attempts}
				{#if attempts === 1}<div class="mt-2 text-sm">
						Hint: The first two letters are: <br />
						<p class="font-bold">"{word.word.translation.slice(0, 2)}"</p>
					</div>
				{/if}
				{#if attempts > 1}
					<div class="mt-2 text-sm">
						Hint: The correct translation is <br />
						<p class="font-bold">"{word.word.translation}"</p>
						<p class="font-bold">"{word.verb_conjugation?.eu}"</p>
						<p class="font-bold">"{word.verb_conjugation?.voceAndEle}"</p>
						<p class="font-bold">"{word.verb_conjugation?.nos}"</p>
						<p class="font-bold">"{word.verb_conjugation?.elesAndVoces}"</p>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
