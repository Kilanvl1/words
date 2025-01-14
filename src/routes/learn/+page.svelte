<script lang="ts">
	import NonVerbCard from './non-verb-card.svelte';
	import VerbCard from './verb-card.svelte';
	import { ChevronLeft, RotateCcw, Ellipsis, Trophy, RefreshCw } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { buttonVariants, Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils';
	let { data } = $props();
	let words = $state(data.words.filter((word) => word.word.state_of_word === 'learning'));
	let currentWordIndex = $state(0);
	let currentWord = $derived(words[currentWordIndex]);

	const colorArray = [
		'bg-[#6F8DE6]',
		'bg-[#E7C96F]',
		'bg-[#6FE679]',
		'bg-[#FFD11C]',
		'bg-[#E77079]',
		'bg-[#A570E5]',
		'bg-[#71E6DA]'
	];

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

<div class={`min-h-screen ${colorArray[currentWordIndex % colorArray.length]}`}>
	<div class="m-auto flex min-h-[844px] max-w-96 flex-col justify-center p-4">
		<div class="flex gap-x-2">
			<a class={buttonVariants({ variant: 'circle' })} href="/"><ChevronLeft /></a>
			<Button class={buttonVariants({ variant: 'circle' })} onclick={() => window.location.reload()}
				><RotateCcw /></Button
			>
			<DropdownMenu.Root
				><DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'circle' }), 'ml-auto')}>
					<Ellipsis /></DropdownMenu.Trigger
				>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
						<DropdownMenu.Item>
							<Trophy class="mr-2 size-4" />
							<span>Set to mastered</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<RefreshCw class="mr-2 size-4" />
							<span>Refresh tomorrow</span>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<div class="mt-auto">
			<p class="text-sm text-gray-600">{currentWordIndex + 1} / {words.length}</p>
			{#if currentWord.word.is_verb}
				<VerbCard word={currentWord} />
			{:else}
				<NonVerbCard word={currentWord.word} />
			{/if}
		</div>
		<div class="mt-auto flex w-full justify-between gap-x-4">
			<Button
				class={buttonVariants({ variant: 'hollow' })}
				onclick={() => (currentWordIndex = (currentWordIndex - 1 + words.length) % words.length)}
			>
				Prev
			</Button>
			<Button
				class={buttonVariants({ variant: 'hollow' })}
				onclick={() => (currentWordIndex = (currentWordIndex + 1) % words.length)}
			>
				Next
			</Button>
		</div>
	</div>
</div>
