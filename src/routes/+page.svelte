<script lang="ts">
	import MenuItem from './menu-item.svelte';
	import { User } from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils';
	let { data } = $props();
</script>

<div class="bg-[#E7C96F]">
	<div class="container mx-auto flex min-h-screen flex-col items-center justify-center gap-y-4">
		{#if data.user}
			<DropdownMenu.Root
				><DropdownMenu.Trigger
					class={cn(buttonVariants({ variant: 'circle' }), 'absolute right-4 top-4')}
				>
					<User /></DropdownMenu.Trigger
				>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
						<DropdownMenu.Item>
							<form method="post" action="?/logout">
								<Button type="submit">Logout</Button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<MenuItem title="Learn" description="Practice your words." href={`/learn`} />
			<MenuItem title="Create" description="Add new words to your vocabulary." href="/create" />
		{:else}
			<MenuItem title="Login" description="Login to begin using words." />
		{/if}
	</div>
</div>
