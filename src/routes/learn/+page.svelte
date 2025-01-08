<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import WordCard from './word-card.svelte';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Button } from '$lib/components/ui/button';

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
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)} class="mx-auto w-full max-w-sm">
	<Carousel.Content>
		{#each data.words as word}
			<WordCard {word} />
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
	<div class="py-2 text-center text-sm text-muted-foreground">
		Slide {current} of {count}
	</div>
</Carousel.Root>

<a class={buttonVariants({ variant: 'outline' })} href="/">Back to home</a>
<Button onclick={() => window.location.reload()}>Reset</Button>
