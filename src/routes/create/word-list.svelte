<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Trash from '$lib/components/icons/trash.svelte';
	import * as Select from '$lib/components/ui/select';

	let { word } = $props();
	let stateOfWord = $state(word.state_of_word);

	const handleValueChange = async () => {
		try {
			const response = await fetch('/api/updateStateOfWord', {
				method: 'POST',
				body: JSON.stringify({ wordId: word.id, stateOfWord: stateOfWord })
			});
			if (!response.ok) {
				throw new Error('Failed to update state of word');
			}
		} catch (error) {
			console.error(error);
		}
	};
</script>

<div class="flex items-center gap-x-2">
	<p>{word.word} and {word.translation}</p>

	<Select.Root
		type="single"
		name="stateOfWord"
		bind:value={stateOfWord}
		onValueChange={handleValueChange}
	>
		<Select.Trigger class="max-w-max" name="stateOfWord">
			{stateOfWord}
		</Select.Trigger>
		<Select.Content class="max-w-10">
			<Select.Item value="learning">Learning</Select.Item>
			<Select.Item value="mastered">Mastered</Select.Item>
			<Select.Item value="refresh_tomorrow">Refresh tomorrow</Select.Item>
		</Select.Content>
	</Select.Root>

	<form method="POST" action="?/delete">
		<input type="hidden" name="id" value={word.id} />
		<Button variant="ghost" size="icon" type="submit">
			<Trash />
		</Button>
	</form>
</div>
