<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import NonVerbCard from './non-verb-card.svelte';
	import VerbCard from './verb-card.svelte';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	let { data } = $props();
	let api = $state<CarouselAPI>();

	const count = $derived(api ? api.scrollSnapList().length : 0);
	let current = $state(0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});

	async function checkAndUpdateWords() {
		const currentTime = new Date();

		for (const word of data.words) {
			let scheduledTime = word.word.scheduled_update_time;

			if (scheduledTime) {
				scheduledTime = new Date(scheduledTime);

				if (currentTime >= scheduledTime) {
					try {
						await fetch('/api/updateStateOfWord', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({ wordId: word.word.id, stateOfWord: 'learning' })
						});
					} catch (error) {
						console.error('Failed to update word:', word.word.id, error);
					}
				}
			}
		}
	}

	onMount(() => {
		checkAndUpdateWords();
	});
</script>

<div class="flex h-screen flex-col items-center justify-center gap-y-8">
	<Carousel.Root setApi={(emblaApi) => (api = emblaApi)} class="mx-auto w-full max-w-sm">
		<Carousel.Content>
			{#each data.words as word}
				{#if word.word.state_of_word === 'learning'}
					{#if word.word.is_verb}
						<VerbCard {word} />
					{:else}
						<NonVerbCard word={word.word} />
					{/if}
				{/if}
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
		<div class="py-2 text-center text-sm text-muted-foreground">
			Slide {current} of {count}
		</div>
	</Carousel.Root>
	<div>
		<a class={buttonVariants({ variant: 'outline' })} href="/">Back to home</a>
		<Button onclick={() => window.location.reload()}>Reset</Button>
	</div>
</div>
