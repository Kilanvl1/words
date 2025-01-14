<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { Word } from '$lib/server/db/schema.js';
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let { word }: { word: Word } = $props();

	let isCorrect = $state<boolean | null>(null);
	let attempts = $state(0);
	let userTranslation = $state('');

	$effect(() => {
		word; // dependency tracking
		isCorrect = null;
		attempts = 0;
		userTranslation = '';
	});

	const handleSubmit: SubmitFunction = ({ formData, cancel }) => {
		const userTranslation = (formData.get('userTranslation') as string) ?? '';
		attempts++;
		// Case-insensitive comparison and trim whitespace
		isCorrect = userTranslation.trim().toLowerCase() === word.translation.trim().toLowerCase();
		if (!isCorrect) {
			cancel();
		}

		return async ({ update }) => {
			update({ reset: false });
		};
	};
</script>

<div class="mb-10 text-center text-2xl font-bold">{word.word}</div>

<div class="w-full space-y-4">
	<form method="POST" action="?/handleNonVerbSubmit" use:enhance={handleSubmit}>
		<Input type="hidden" name="wordId" value={word.id} />
		<Input
			bind:value={userTranslation}
			placeholder="Enter translation"
			name="userTranslation"
			class={cn(buttonVariants({ variant: 'outline' }), 'mb-2')}
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
						Hint: The correct translation is <br />"{word.translation}"
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
