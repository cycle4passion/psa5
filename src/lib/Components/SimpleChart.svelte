<script lang="ts">
	import { onMount } from "svelte";
	import type { Component } from "svelte";
	import { ArcChart } from "layerchart";
	import { AreaChart } from "layerchart";
	import { BarChart } from "layerchart";
	import { LineChart } from "layerchart";
	import { PieChart } from "layerchart";
	import { ScatterChart } from "layerchart";

	let { chartType, data, ...rest } = $props();
	chartType = chartType.toLowerCase();
	let component: Component | null = $state(null);
	const simpleCharts = ["arc", "area", "bar", "line", "pie", "scatter"];

	onMount(async () => {
		if (simpleCharts.includes(chartType)) {
			component = (await import(`./${chartType}Chart.svelte`)).default;
		}
	});
</script>

{#if component}
	<component {data} {...rest}></component>
{:else}
	<p>Unknown chart type: {chartType}</p>
{/if}
