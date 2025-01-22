<script lang="ts">
	import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	let { title, description, href }: { title: string; description: string; href?: string } =
		$props();
</script>

<div class="container max-w-[500px]">
	{#if href}
		<a {href}>
			<Card>
				<CardHeader class="flex  h-[220px] flex-col items-center justify-center gap-y-4">
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
			</Card>
		</a>
	{:else}
		<Card>
			<CardHeader class="flex  h-[220px] flex-col items-center justify-center gap-y-4">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
				<form method="post" action="?/OAuth2">
					<Button type="submit">Sign in with Google</Button>
				</form>
			</CardHeader>
		</Card>
	{/if}
</div>
