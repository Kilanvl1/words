<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button, buttonVariants } from '$lib/components/ui/button';

	import type { VerbConjugation } from '$lib/server/db/schema.js';
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { cn } from '$lib/utils';

	type WordDataForm = {
		id: string;
		translation: string;
	};

	type UserSubmit = {
		wordData: WordDataForm;
		conjugationData: VerbConjugation;
	};

	let { word, handleIncorrectAnswer, shouldReset = $bindable() } = $props();
	let userSubmit = $state<UserSubmit>({
		wordData: { id: '', translation: '' },
		conjugationData: {
			id: word.word.id,
			eu: '',
			voce: '',
			ele: '',
			nos: '',
			vos: '',
			eles: ''
		}
	});

	let isCorrect = $state<boolean | null>(null);
	let attempts = $state(0);
	let previousWordId = $state(word.word.word);

	$effect(() => {
		shouldReset;
		isCorrect = null;
		attempts = 0;
		userSubmit = {
			wordData: { id: '', translation: '' },
			conjugationData: {
				id: word.word.id,
				eu: '',
				voce: '',
				ele: '',
				nos: '',
				vos: '',
				eles: ''
			}
		};
		previousWordId = word.word;
	});

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		attempts++;
		// Case-insensitive comparison and trim whitespace

		isCorrect =
			userSubmit.wordData.translation.trim().toLowerCase() ===
				word.word.translation.trim().toLowerCase() &&
			userSubmit.conjugationData.eu.trim().toLowerCase() ===
				word.verb_conjugation.eu.trim().toLowerCase() &&
			userSubmit.conjugationData.voce.trim().toLowerCase() ===
				word.verb_conjugation.voce.trim().toLowerCase() &&
			userSubmit.conjugationData.ele.trim().toLowerCase() ===
				word.verb_conjugation.ele.trim().toLowerCase() &&
			userSubmit.conjugationData.nos.trim().toLowerCase() ===
				word.verb_conjugation.nos.trim().toLowerCase() &&
			userSubmit.conjugationData.vos.trim().toLowerCase() ===
				word.verb_conjugation.vos.trim().toLowerCase() &&
			userSubmit.conjugationData.eles.trim().toLowerCase() ===
				word.verb_conjugation.eles.trim().toLowerCase();

		if (!isCorrect) {
			if (attempts > 1) {
				handleIncorrectAnswer(word.word.id);
			}
			cancel();
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
			class="mb-4"
		/>
		<Input bind:value={userSubmit.conjugationData.eu} placeholder="Eu" name="userEu" class="mb-4"
		></Input>
		<Input
			bind:value={userSubmit.conjugationData.voce}
			placeholder="Voce"
			name="userVoce"
			class="mb-4"
		></Input>
		<Input bind:value={userSubmit.conjugationData.ele} placeholder="Ele" name="userEle" class="mb-4"
		></Input>
		<Input bind:value={userSubmit.conjugationData.nos} placeholder="Nos" name="userNos" class="mb-4"
		></Input>
		<Input bind:value={userSubmit.conjugationData.vos} placeholder="Vos" name="userVos" class="mb-4"
		></Input>
		<Input
			bind:value={userSubmit.conjugationData.eles}
			placeholder="Eles"
			name="userEles"
			class="mb-4"
		></Input>
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
						Hint: The first two letters are: <br />"
						<p class="font-bold">{word.word.translation.slice(0, 2)}</p>
						"
					</div>
				{/if}
				{#if attempts > 1}
					<div class="mt-2 text-sm">
						Hint: The correct translation is <br />"{word.word.translation}"
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
