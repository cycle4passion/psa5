<script lang="ts">
	import { Tooltip as SkeletonTooltip } from "@skeletonlabs/skeleton-svelte";
	let openState = $state(false);
	//  import { TooltipProps } from "@skeletonlabs/skeleton-svelte/components/Tooltip/types.js";
	let { trigger, content } = $props();
</script>

<SkeletonTooltip
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	positioning={{ placement: "top" }}
	triggerBase="underline"
	contentBase="card bg-surface-800 preset-filled p-4"
	openDelay={200}
	arrow
	arrowBackground="!bg-surface-800">
	{@render trigger()}
	{@render content()}
</SkeletonTooltip>
