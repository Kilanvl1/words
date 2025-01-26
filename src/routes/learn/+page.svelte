<script lang="ts">
	import NonVerbCard from './non-verb-card.svelte';
	import VerbCard from './verb-card.svelte';
	import { ChevronLeft, RotateCcw, Ellipsis, Trophy, RefreshCw } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { buttonVariants, Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	//let words = $derived(data.words.filter((word) => word.word.state_of_word === 'learning'));
	let words = $state(data.words);
	let currentWordIndex = $state(0);
	let currentWord = $derived(words[currentWordIndex]);
	let shouldReset = $state(false);

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
			let scheduledTime = word.word.scheduledUpdateTime;

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

	const updateStateOfWord = async (wordId: number, stateOfWord: string) => {
		try {
			const response = await fetch('/api/updateStateOfWord', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ wordId, stateOfWord })
			});
			if (response.ok) {
				invalidateAll();
			}
		} catch (error) {
			console.error('Failed to update word:', wordId, error);
		}
	};

	onMount(() => {
		checkAndUpdateWords();
	});

	const handleIncorrectAnswer = (id: number) => {
		// Generate a random number between 3 and 8
		const randomIndex = Math.floor(Math.random() * 6) + 3;

		let isRandomInxedInArray = true;
		if (randomIndex + currentWordIndex > words.length) {
			isRandomInxedInArray = false;
		}

		if (isRandomInxedInArray) {
			// Move word with id at position id in words to position randomIndex in words
			const wordToMove = words.find((word) => word.word.id === id) as (typeof words)[number];
			words.splice(currentWordIndex, 1);
			words.splice(randomIndex + currentWordIndex, 0, wordToMove);
		}
		toggleReset();
	};

	const scrollToNextWord = () => {
		currentWordIndex = (currentWordIndex + 1) % words.length;
		toggleReset();
	};

	const toggleReset = () => {
		shouldReset = !shouldReset;
	};
</script>

<div class={`min-h-screen ${colorArray[currentWordIndex % colorArray.length]}`}>
	<div class="m-auto flex min-h-[600px] max-w-96 flex-col justify-center p-4">
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
						<DropdownMenu.Item onclick={() => updateStateOfWord(currentWord.word.id, 'mastered')}>
							<Trophy class="mr-2 size-4" />
							<span>Set to mastered</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() => updateStateOfWord(currentWord.word.id, 'refresh_tomorrow')}
						>
							<RefreshCw class="mr-2 size-4" />
							<span>Refresh tomorrow</span>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<div class="mt-auto">
			<p class="text-sm text-gray-600">{currentWordIndex + 1} / {words.length}</p>
			{#if currentWord.word.isVerb}
				<VerbCard word={currentWord} {handleIncorrectAnswer} {scrollToNextWord} bind:shouldReset />
			{:else}
				<NonVerbCard
					word={currentWord.word}
					{handleIncorrectAnswer}
					{scrollToNextWord}
					bind:shouldReset
				/>
			{/if}
		</div>
		<div class="mt-auto flex w-full justify-between gap-x-4">
			<Button
				class={buttonVariants({ variant: 'hollow' })}
				onclick={() => {
					toggleReset();
					currentWordIndex = (currentWordIndex - 1 + words.length) % words.length;
				}}
			>
				Prev
			</Button>
			<Button
				class={buttonVariants({ variant: 'hollow' })}
				onclick={() => {
					toggleReset();
					currentWordIndex = (currentWordIndex + 1) % words.length;
				}}
			>
				Next
			</Button>
		</div>
	</div>
</div>
