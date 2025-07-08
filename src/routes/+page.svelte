<script lang="ts">
	import { dateDifference, trim0decimals } from "$lib/utils";
	import Tooltip from "$lib/Components/Tooltip.svelte";
	import {
		LineChart,
		Rule,
		Svg,
		Chart,
		Layer,
		Axis,
		LinearGradient,
		Highlight,
		Spline,
		Text,
		AnnotationLine,
		Points,
		Tooltip as ChartTooltip,
	} from "layerchart";
	import { SeriesState } from "/Users/sjr/Documents/Shared/Coding/Svelte/psa5/node_modules/layerchart/dist/components/charts/utils.svelte.js";
	import { scaleTime, scaleSqrt, scaleLinear } from "d3-scale";
	import { curveCatmullRom } from "d3-shape";
	import { onMount } from "svelte";
	import Dice_4 from "@lucide/svelte/icons/dice-4";
	// import { date, format, PeriodType, sortFunc, styles } from "@layerstack/utils";
	// import { trim0decimals, unique } from "$lib/utils";
	// import { Slider } from "@skeletonlabs/skeleton-svelte";
	// import { X } from "@lucide/svelte";
	let showannots = $state(true);
	let { data } = $props();
	let { psas, annots } = data;

	interface SeriesItem {
		key: "psa" | "psadt" | "psavel";
		color: string;
		props: {
			pcolor: string;
			threshold: number;
			lowcolor: string;
			highcolor: string;
			dashed: number;
		};
	}

	interface PsaData {
		date: Date;
		psa: number;
		psadt?: number;
		psavel?: number;
	}

	const series: SeriesItem[] = [
		{
			key: "psa",
			color: "var(--color-primary-500)",
			props: {
				pcolor: "primary-500",
				threshold: 4,
				lowcolor: "var(--color-primary-500)",
				highcolor: "var(--color-error-500)",
				dashed: 0,
			},
		},
		{
			key: "psadt",
			color: "var(--color-secondary-500)",
			props: {
				pcolor: "secondary-500",
				threshold: 2,
				lowcolor: "var(--color-secondary-500)",
				highcolor: "var(--color-error-500)",
				dashed: 4,
			},
		},
		{
			key: "psavel",
			color: "var(--color-tertiary-500)",
			props: {
				pcolor: "tertiary-500",
				threshold: 0.75,
				lowcolor: "var(--color-tertiary-500)",
				highcolor: "var(--color-error-500)",
				dashed: 6,
			},
		},
	];
</script>

<label>
	<input type="checkbox" bind:checked={showannots} class="checkbox" />
	<span class="pl-1">Show Annotations</span>
</label>
<div class="border-primary-500/20 hover:border-primary-500/50 my-4 h-[500px] rounded-md border p-2">
	<LineChart
		padding={{ top: 20, bottom: 60, left: 40, right: 90 }}
		data={psas}
		x="date"
		xScale={scaleTime()}
		yScale={scaleSqrt()}
		brush
		legend
		grid={false}
		{series}>
		{#snippet marks({ context, visibleSeries, getSplineProps, getPointsProps })}
			{#each visibleSeries as s, i (s.key)}
				{@const sref = series.find((ser) => s.key === ser.key)}
				{@const thresholdOffset = context.yScale(sref?.props.threshold ?? 0)}
				<LinearGradient
					stops={[
						[thresholdOffset, "var(--color-primary-500)"],
						[thresholdOffset, "var(--color-error-500)"],
					]}
					units="userSpaceOnUse"
					vertical>
					{#snippet children({ gradient })}
						<Spline stroke={gradient} curve={curveCatmullRom} {...getSplineProps(s, i)} />
						<Points
							r={5}
							opacity={s.key === "psa" ? 100 : 0}
							stroke={s.key === "psa" ? gradient : "transparent"} />
					{/snippet}
				</LinearGradient>
			{/each}
		{/snippet}

		{#snippet highlight({ context })}
			{#if context.tooltip.data}
				<Highlight
					lines
					points={{
						fill:
							context.y(context.tooltip.data) > 50
								? "var(--color-red-500)"
								: "var(--color-green-500)",
					}} />
			{/if}
		{/snippet}

		{#snippet aboveMarks({
			visibleSeries,
			series,
			context,
		}: {
			visibleSeries: any;
			series: any;
			context: any;
		})}
			{@const sref = series.find((s: any) => s.key === "psa")}
			{#each visibleSeries as s (s.key)}
				{@const seriesref = series.find((ser: any) => s.key === ser.key)}
				<Text
					x={context.xScale(context.x(s))}
					y={context.yScale(sref?.props.threshold ?? 0) - 10}
					class={`text-[10px] fill-${seriesref?.props.pcolor} font-semibold`}
					textAnchor="middle">
					{trim0decimals(sref?.props.threshold)}
				</Text>
			{/each}
			{#each visibleSeries as s (s.key)}
				{@const seriesref = series.find((ser: any) => s.key === ser.key)}
				<AnnotationLine
					y={seriesref?.props?.threshold}
					label={s.key.toUpperCase()}
					labelXOffset={10}
					props={{
						line: { class: `stroke-${seriesref?.props.pcolor}/40 [stroke-dasharray:2,2]` },
						label: { class: `fill-${seriesref?.props.pcolor} opacity-40 text-[8px]` },
					}} />
			{/each}
			{#if showannots}
				{#each annots as anot}
					<AnnotationLine
						x={anot.date}
						label={anot.test}
						labelXOffset={4}
						props={{
							line: { class: "stroke-success-500/40 [stroke-dasharray:2,2]" },
							label: { class: "fill-success-500 opacity-40 text-[8px]" },
						}} />
				{/each}
			{/if}
		{/snippet}

		{#snippet axis({
			context,
			visibleSeries,
			series,
		}: {
			visibleSeries: any;
			series: any;
			context: any;
		})}
			{#each visibleSeries as s (s.key)}
				{@const sref = series.find((s: any) => s.key === s.key)}
				{@const ymax = Math.ceil(Math.max(...context.data.map((s: any) => s[s.key] ?? 0)))}

				<Axis
					label={s.key.toUpperCase()}
					placement={s.key === "psa" ? "left" : "right"}
					format={(v) => v || ""}
					rule={{ class: `stroke-${sref?.props?.pcolor}` }}
					scale={scaleSqrt([0, ymax], [context.height, 0])}
					labelProps={{
						dx: s.key === "psa" ? 0 : -50,
						class: `fill-${sref?.props.pcolor} stroke-transparent`,
					}}
					ticks={(scale) => [...new Set([sref?.props.threshold, ...(scale.ticks?.() ?? [])])]}
					tickLabelProps={{
						dx: s.key === "psa" ? -20 : 8,
						textAnchor: "start",
						class: `stroke-transparent fill-${sref?.props.pcolor}`,
					}}
					classes={{ tick: `stroke-${sref?.props.pcolor}` }}
					class={`transition-all ${sref.key === "psadt" && visibleSeries.some((s) => s.key === "psavel") ? "translate-x-[50px]" : ""}`}
					tickLength={6} />
			{/each}
		{/snippet}

		<!-- {#snippet tooltip({ context, series })}
			{@const activeSeriesColor = series.find((s) => s.key === context.tooltip.data?.test)?.color}
			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>{format(context.x(data))}</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label={psas.test} value={data.value} color={activeSeriesColor} />
					</Tooltip.List>
				{/snippet}
			</Tooltip.Root>
		{/snippet} -->
	</LineChart>
</div>

<Tooltip>
	{#snippet trigger()}Hover Me{/snippet}
	{#snippet content()}This is a tooltip.{/snippet}
</Tooltip>
