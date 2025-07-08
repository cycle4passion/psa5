<script lang="ts">
	import { Tooltip as SkeletonTooltip } from "@skeletonlabs/skeleton-svelte";
	let openState = $state(false);
	let { trigger, content } = $props();
	const bgstuff = "!bg-surface-800 dark:!bg-surface-100";
</script>

<SkeletonTooltip
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	positioning={{ placement: "top" }}
	triggerBase="underline"
	contentBase={`card ${bgstuff} preset-filled p-3`}
	openDelay={200}
	arrow
	arrowBackground={`${bgstuff}`}
	{trigger}
	{content} />
