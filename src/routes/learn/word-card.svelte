<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import type { Word } from '$lib/server/db/schema.js';
	import { fly } from 'svelte/transition';

	let { word }: { word: Word } = $props();
	let userInput = $state('');
	let isCorrect = $state<boolean | null>(null);
	let attempts = $state(0);

	function checkTranslation() {
		attempts++;
		// Case-insensitive comparison and trim whitespace
		isCorrect = userInput.trim().toLowerCase() === word.translation.trim().toLowerCase();
	}
</script>

<Carousel.Item>
	<Card.Root>
		<Card.Content class="flex aspect-square flex-col items-center justify-center gap-y-4 p-6">
			<div class="text-2xl font-bold">{word.word}</div>

			<div class="w-full max-w-sm space-y-4">
				<Input
					bind:value={userInput}
					placeholder="Enter translation"
					onkeydown={(e) => e.key === 'Enter' && checkTranslation()}
				/>

				<button
					class="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
					onclick={checkTranslation}
				>
					Check
				</button>

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
			</div>
		</Card.Content>
	</Card.Root>
</Carousel.Item>
