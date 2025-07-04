<script lang="ts">
	import { dateDifference } from "$lib/utils";
	import { Popover } from "@skeletonlabs/skeleton-svelte";
	import { LineChart } from "layerchart";
	import { scaleLog, scaleTime } from "d3-scale";
	import { curveCatmullRom } from "d3-shape";
	// import { date, format, PeriodType, sortFunc, styles } from "@layerstack/utils";
	// import { trim0decimals, unique } from "$lib/utils";
	// import { Slider } from "@skeletonlabs/skeleton-svelte";
	// import { X } from "@lucide/svelte";
	let { data } = $props();
	let { psas } = data;
</script>

<div class="h-[500px] rounded-md border p-4">
	<LineChart
		data={psas}
		x="date"
		xScale={scaleTime()}
		yScale={scaleLog()}
		legend
		brush
		props={{ spline: { curve: curveCatmullRom }, highlight: { points: { r: 8, strokeWidth: 4 } } }}
		series={[
			{ key: "psa", color: "var(--color-primary-500)" },
			{ key: "psadt", color: "var(--color-secondary-500)" },
			{ key: "psavel", color: "var(--color-accent-500)" },
		]}>
	</LineChart>
</div>
