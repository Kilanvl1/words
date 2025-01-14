<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	let { title, description, href }: { title: string; description: string; href: string } = $props();
</script>

<div class="container max-w-[500px]">
	<a {href}>
		<Card>
			<CardHeader class="flex  h-[220px] flex-col items-center justify-center gap-y-4">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
		</Card>
	</a>
</div>
