<script lang="ts">
	import { enhance } from '$app/forms';
	import Trash from '$lib/components/icons/trash.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { form, data } = $props();
	let dialogOpen = $state(false);
	let clientErrorMessage = $state('');

	const handleSubmit: SubmitFunction = ({ formData, cancel }) => {
		if (!formData.get('word') || !formData.get('translation')) {
			cancel();
			clientErrorMessage = 'Please fill in all fields';
		}
		return async ({ result, update }) => {
			if (result.type === 'success') {
				console.log('got here');
				dialogOpen = false;
			} else {
				update();
			}
		};
	};
</script>

<div class="container">
	<h1 class="text-2xl font-bold">Your words</h1>
	<hr class="my-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
	{#each data.words as word}
		<div class="flex items-center gap-x-2">
			<p>{word.word} and {word.translation}</p>
			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={word.id} />
				<Button variant="ghost" size="icon" type="submit">
					<Trash />
				</Button>
			</form>
		</div>
	{/each}
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Add new word</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Add new word</Dialog.Title>
				<Dialog.Description>Add a new word here and click save when you're done.</Dialog.Description
				>
			</Dialog.Header>
			<form method="POST" action="?/create" class="grid gap-4 py-4" use:enhance={handleSubmit}>
				{#if !form?.success}<p class="text-red-500">{form?.message}</p>{/if}
				<p class="text-red-500">{clientErrorMessage}</p>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="word" class="text-right">Word</Label>
					<Input name="word" id="word" placeholder="Hello" class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="translation" class="text-right">Translation</Label>
					<Input name="translation" id="translation" placeholder="Hola" class="col-span-3" />
				</div>

				<Dialog.Footer>
					<Button type="submit">Add new word</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
	<a class={buttonVariants({ variant: 'outline' })} href="/">Back to home</a>
</div>
