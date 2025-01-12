<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import type { VerbConjugation } from '$lib/server/db/schema.js';
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	type WordDataForm = {
		id: string;
		translation: string;
	};

	type UserSubmit = {
		wordData: WordDataForm;
		conjugationData: VerbConjugation;
	};

	let { word } = $props();
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
			cancel();
		}

		return async ({ update }) => {
			update({ reset: false });
		};
	};
</script>

<Carousel.Item>
	<Card.Root>
		<Card.Content class="flex aspect-square flex-col items-center justify-center gap-y-4 p-6">
			<div class="text-2xl font-bold">{word.word.word}</div>

			<div class="w-full max-w-sm space-y-4">
				<form method="POST" action="?/handleVerbSubmit" use:enhance={handleSubmit}>
					<Input type="hidden" name="wordId" value={word.word.id} />
					<Input
						bind:value={userSubmit.wordData.translation}
						placeholder="Enter translation"
						name="userTranslation"
						class="mb-4"
					/>
					<Input
						bind:value={userSubmit.conjugationData.eu}
						placeholder="Eu"
						name="userEu"
						class="mb-4"
					/>
					<Input
						bind:value={userSubmit.conjugationData.voce}
						placeholder="Voce"
						name="userVoce"
						class="mb-4"
					/>
					<Input
						bind:value={userSubmit.conjugationData.ele}
						placeholder="Ele"
						name="userEle"
						class="mb-4"
					/>
					<Input
						bind:value={userSubmit.conjugationData.nos}
						placeholder="Nos"
						name="userNos"
						class="mb-4"
					/>
					<Input
						bind:value={userSubmit.conjugationData.vos}
						placeholder="Vos"
						name="userVos"
						class="mb-4"
					/>
					<Input
						bind:value={userSubmit.conjugationData.eles}
						placeholder="Eles"
						name="userEles"
						class="mb-4"
					/>
					<Button
						type="submit"
						class="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
					>
						Check
					</Button>
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
							{#if attempts >= 3}
								<div class="mt-2 text-sm">
									Hint: The correct translation is "{word.translation}"
								</div>
							{/if}
						{/if}
					</div>
				{/if}

				{#if word.three_in_a_row}
					<div
						in:fly={{ y: 20, duration: 300 }}
						class="rounded-md bg-green-100 p-4 text-center text-green-800"
					>
						<p>You've got this word correct {word.consecutive_correct} times in a row!</p>
						<div class="flex justify-between">
							<form method="POST" action="?/setToMastered">
								<Input type="hidden" name="wordId" value={word.id} />
								<Button type="submit">Mastered</Button>
							</form>
							<form method="POST" action="?/setToRefreshTomorrow">
								<Input type="hidden" name="wordId" value={word.id} />
								<Button type="submit">Refresh tomorrow</Button>
							</form>
						</div>
					</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</Carousel.Item>
