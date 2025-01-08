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

<div class="container">
	<a {href}>
		<Card>
			<CardHeader class="flex flex-col items-center justify-center gap-y-4">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
		</Card>
	</a>
</div>
