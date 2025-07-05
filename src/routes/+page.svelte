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
	import { scaleTime, scaleSqrt } from "d3-scale";
	import { curveCatmullRom } from "d3-shape";
	// import { date, format, PeriodType, sortFunc, styles } from "@layerstack/utils";
	// import { trim0decimals, unique } from "$lib/utils";
	// import { Slider } from "@skeletonlabs/skeleton-svelte";
	// import { X } from "@lucide/svelte";
	let showannots = $state(true);
	let { data } = $props();
	let { psas, annots } = data;
	const errorRed = "rgb(255, 0, 0)";
	const series = [
		{
			key: "psa",
			color: "var(--color-primary-500)",
			threshold: 4,
			props: {
				threshold: 4,
				lowcolor: "var(--color-success-500)",
				highcolor: errorRed,
				dashed: 0,
			},
		},
		{
			key: "psadt",
			color: "var(--color-secondary-500)",
			threshold: 2,
			props: {
				threshold: 2,
				lowcolor: errorRed,
				highcolor: "var(--color-secondary-500)",
				dashed: 4,
			},
		},
		{
			key: "psavel",
			color: "var(--color-tertiary-500)",

			props: {
				threshold: 0.75,
				lowcolor: "var(--color-tertiary-500)",
				highcolor: errorRed,
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
		padding={{ top: 20, bottom: 60, left: 20, right: 90 }}
		data={psas}
		x="date"
		xScale={scaleTime()}
		yScale={scaleSqrt()}
		legend
		brush
		props={{ tooltip: { context: { mode: "quadtree" } } }}
		{series}>
		{#snippet marks({ context, visibleSeries, getSplineProps, getPointsProps })}
			{#each visibleSeries as s, i (s.key)}
				{@const thresholdOffset = context.yScale(4)}
				<LinearGradient
					stops={[
						[thresholdOffset, "var(--color-primary-500)"],
						[thresholdOffset, "var(--color-secondary-500)"],
					]}
					vertical>
					{#snippet children({ gradient })}
						<Spline stroke={gradient} curve={curveCatmullRom} y={s.key} {...getSplineProps(s, i)} />
						<Points
							r={6}
							{...getPointsProps(s, i)}
							fill={s.key === "psa" ? gradient : "transparent"} />
					{/snippet}
				</LinearGradient>
			{/each}

			<!-- {#each visibleSeries as s, i (s.key)}
				{@const seriesref = series.find((ser) => s.key === ser.key)}
				{@const highlightSeriesKey = s.key === "psa" ? "psadt" : "psa"}

				<LinearGradient
					stops={[
						[seriesref?.props.threshold, seriesref?.props.highcolor],
						[seriesref?.props.threshold, seriesref?.props.lowcolor],
					]}
					units="userSpaceOnUse"
					vertical>
					{#snippet children({ gradient })}
						<Spline
							data={psas}
							y={s.key}
							{...getSplineProps(s, i)}
							class={`stroke-2 ${series.props.dashed ? `[stroke-dasharray:${seriesref?.props.dashed}] opacity-50` : ""}`}
							stroke={gradient}
							curve={curveCatmullRom} />
					{/snippet}
					<Points r={6} {...getPointsProps(s, i)} fill={gradient} />
					<Labels
						offset={12}
						format={(value) =>
							s.key === "psa" || s.key === highlightSeriesKey || visibleSeries.length === 1
								? value
								: ""}
						class={`stroke-1 text-xs`}
						{...getLabelsProps(s, i)} />
				</LinearGradient>
			{/each} -->
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

		{#snippet aboveMarks({ context })}
			<AnnotationLine
				y={4}
				label="PSA (4.0)"
				props={{
					line: { class: "stroke-red-500 [stroke-dasharray:2,2]" },
					label: { class: "stroke-red-500 opacity-20" },
				}} />
			<AnnotationLine
				x={0.75}
				label="PSAV (0.75 ng/ml/year)"
				props={{
					line: { class: "stroke-red-500 [stroke-dasharray:2,2]" },
					label: { class: "stroke-red-500 opacity-20" },
				}} />
			<AnnotationLine
				x={2}
				label="PSADT (2 year)"
				props={{
					line: { class: "stroke-red-500 [stroke-dasharray:2,2]" },
					label: { class: "stroke-red-500 opacity-20" },
				}} />
			{#if showannots}
				{#each annots as anot}
					<AnnotationLine
						x={anot.date}
						label={anot.test}
						labelXOffset={4}
						props={{
							line: { class: "stroke-red-500 [stroke-dasharray:2,2]" },
							label: { class: "fill-red-500" },
						}} />
				{/each}
			{/if}
		{/snippet}
		{#snippet axis({ context, visibleSeries })}
			<Axis
				label="PSA"
				placement="left"
				scale={context.yScale}
				rule
				ticks={(scale) => [4, ...(scale.ticks?.() ?? [])]} />
			<Axis
				label="Date"
				placement="bottom"
				rule
				scale={context.xScale}
				class="text-xs text-gray-500" />
			{#if visibleSeries.some((s: any) => s.key === "psadt")}
				<Axis
					label="PSADT"
					placement="right"
					rule={{ class: "stroke-secondary-500" }}
					scale={context.yScale}
					labelProps={{
						dx: -50,
						class: "text-[14px] fill-secondary-500 stroke-transparent",
					}}
					format={(v) => (v.toFixed() === v ? v.toFixed() : v)}
					ticks={(scale) => [0.75, ...(scale.ticks?.() ?? [])]}
					tickLabelProps={{
						dx: 8,
						textAnchor: "start",
						class: `stroke-transparent font-semibold fill-secondary-500`,
					}}
					tickLength={6} />
			{/if}
			{#if visibleSeries.some((s: any) => s.key === "psavel")}
				<Axis
					label="PSAVelocity"
					placement="right"
					rule={{ class: "stroke-tertiary-500" }}
					scale={context.yScale}
					labelProps={{ dx: -50, class: "text-[14px] fill-tertiary-500 stroke-transparent" }}
					ticks={(scale) => [2, ...(scale.ticks?.() ?? [])]}
					tickLabelProps={{
						dx: 8,
						textAnchor: "start",
						class: `stroke-transparent font-semibold fill-tertiary-500`,
					}}
					class={`stroke-tertiary-500 ${visibleSeries.some((s: any) => s.key === "psadt") ? "translate-x-[50px]" : ""}`} />
			{/if}
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
