<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { Word } from '$lib/server/db/schema.js';
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { word }: { word: Word } = $props();
	let userInput = $state('');
	let isCorrect = $state<boolean | null>(null);
	let attempts = $state(0);

	const handleSubmit: SubmitFunction = ({ cancel }) => {
		attempts++;
		// Case-insensitive comparison and trim whitespace
		isCorrect = userInput.trim().toLowerCase() === word.translation.trim().toLowerCase();
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
			<div class="text-2xl font-bold">{word.word}</div>

			<div class="w-full max-w-sm space-y-4">
				<form method="POST" action="?/incrementConsecutive" use:enhance={handleSubmit}>
					<Input type="hidden" name="wordId" value={word.id} />
					<Input
						bind:value={userInput}
						placeholder="Enter translation"
						name="userInput"
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
