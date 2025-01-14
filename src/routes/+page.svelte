<script lang="ts">
	import MenuItem from './menu-item.svelte';
</script>

<div class="container mx-auto flex min-h-screen flex-col items-center justify-center gap-y-4">
	<MenuItem title="Learn" description="Practice your words." href="/learn" />
	<MenuItem title="Create" description="Add new words to your vocabulary." href="/create" />
</div>
