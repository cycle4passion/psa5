<script lang="ts">
	import { dateDifference, trim0decimals } from "$lib/utils";
	import { Temporal } from "temporal-polyfill";
	import SvelteTooltip from "$lib/components/Tooltip.svelte";
	import {
		LineChart,
		Rule,
		Svg,
		Chart,
		Layer,
		Axis,
		LinearGradient,
		Line,
		Highlight,
		Spline,
		Labels,
		Text,
		AnnotationLine,
		AnnotationPoint,
		Tooltip,
		Points,
		Tooltip as ChartTooltip,
		Legend,
	} from "layerchart";

	// TODO: tooltips for annotations
	// TODO: color for y annots maximums
	// TODO: redo tet of Legend
	// TODO: what is line at bottom?
	// TODO: points in above to but get cut off
	// TODO: hollow points above line
	// TODO: localstorage for showannots, series, brush
	// TODO: put back in other routes, etc.
	// TODO: https://next.layerchart.com/docs/components/LineChart#series_(individual_tooltip_with_highlight)

	import { scaleTime, scaleSqrt, scaleLinear } from "d3-scale";
	import { curveCatmullRom } from "d3-shape";
	import { format } from "@layerstack/utils";

	const colors = {
		colorprimary: "color-primary-500 color-secondary-500 color-tertiary-500",
		fillprimary: "fill-primary-500 fill-secondary-500 fill-tertiary-500",
		strokeprimary: "stroke-primary-500 stroke-secondary-500 stroke-tertiary-500",
	};

	let showannots = $state(true);
	let { data } = $props();
	let { psas, annots } = data;

	interface SeriesItem {
		key: "psa" | "psadt" | "psavel";
		pcolor: string;
		color: string;
		stroke?: string;
		fill?: string;
		threshold: number;
		lowcolor: string;
		highcolor: string;
		dashed: number;
	}

	interface PsaData {
		date: Date;
		psa: number;
		psadt?: number;
		psavel?: number;
	}

	// Replace the series2 Set with a Map
	const series2 = new Map<string, Omit<SeriesItem, "key">>([
		[
			"psa",
			{
				pcolor: "primary-500",
				color: "var(--color-primary-500)",
				stroke: "var(--stroke-primary-500)",
				fill: "var(--fill-primary-500)",
				threshold: 4,
				lowcolor: "var(--color-primary-500)",
				highcolor: "var(--color-error-500)",
				dashed: 0,
			},
		],
		[
			"psadt",
			{
				pcolor: "secondary-500",
				color: "var(--color-secondary-500)",
				stroke: "var(--stroke-secondary-500)",
				fill: "var(--fill-secondary-500)",
				threshold: 2,
				lowcolor: "var(--color-secondary-500)",
				highcolor: "var(--color-error-500)",
				dashed: 4,
			},
		],
		[
			"psavel",
			{
				pcolor: "tertiary-500",
				color: "var(--color-tertiary-500)",
				stroke: "var(--stroke-tertiary-500)",
				fill: "var(--fill-tertiary-500)",
				threshold: 0.75,
				lowcolor: "var(--color-tertiary-500)",
				highcolor: "var(--color-error-500)",
				dashed: 6,
			},
		],
	]);

	const series: SeriesItem[] = [
		{
			key: "psa",
			pcolor: "primary-500",
			color: "var(--color-primary-500)",
			stroke: "var(--stroke-primary-500)",
			stroke2: "stroke-primary-500",
			fill: "var(--fill-primary-500)",
			fill2: "fill-primary-500",
			threshold: 4,
			lowcolor: "var(--color-primary-500)",
			highcolor: "var(--color-error-500)",
			dashed: 0,
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
			pcolor: "secondary-500",
			color: "var(--color-secondary-500)",
			stroke: "var(--stroke-secondary-500)",
			stroke2: "stroke-secondary-500",
			fill: "var(--fill-secondary-500)",
			fill2: "fill-secondary-500",
			threshold: 2,
			lowcolor: "var(--color-secondary-500)",
			highcolor: "var(--color-error-500)",
			dashed: 4,
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
			pcolor: "tertiary-500",
			color: "var(--color-tertiary-500)",
			stroke: "var(--stroke-tertiary-500)",
			stroke2: "stroke-tertiary-500",
			fill: "var(--fill-tertiary-500)",
			fill2: "fill-tertiary-500",
			threshold: 0.75,
			lowcolor: "var(--color-tertiary-500)",
			highcolor: "var(--color-error-500)",
			dashed: 6,
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

<!-- note comment below needed to force TW to compile for combine template strings below o/w unrecognized -->
<!-- color-primary-500 color-secondary-500 color-tertiary-500 fill-primary-500 fill-secondary-500 fill-tertiary-500 stroke-primary-500 stroke-secondary-500 stroke-tertiary-500 -->
<label>
	<input type="checkbox" bind:checked={showannots} class="checkbox" />
	<span class="pl-1">Show Annotations</span>
</label>
<div
	class="border-primary-500/20 hover:border-primary-500/50 bg-surface-900 my-4 h-[500px] rounded-md border p-2">
	<LineChart
		grid={false}
		rule={false}
		padding={{ top: 10, bottom: 60, left: 40, right: 70 }}
		xPadding={[5, 10]}
		data={psas}
		yDomain={[0, Math.ceil(Math.max(...psas.map((p) => p.psa))) + 1]}
		x="date"
		xScale={scaleTime()}
		yScale={scaleSqrt()}
		brush
		{series}>
		{#snippet marks({
			context,
			visibleSeries,
			highlightKey,
			getSplineProps,
			getLabelsProps,
			getPointsProps,
		})}
			{#each visibleSeries as s, i (s.key)}
				{@const sref = series.find((ser) => s.key === ser.key)}
				<!-- {@const sref = series2.get(s.key)} -->
				{@const thresholdOffset = sref?.threshold ?? 0}
				<LinearGradient
					stops={[
						[thresholdOffset, "var(--color-red-500)"],
						[thresholdOffset, `var(--${sref?.color}`],
					]}
					units="userSpaceOnUse"
					vertical>
					{#snippet children({ gradient })}
						<Spline {...getSplineProps(s, i)} stroke={gradient} curve={curveCatmullRom} />
						{#if s.key === "psa" || highlightKey === s.key}
							<Points {...getPointsProps(s, i)} r={2} />
						{/if}
						<Labels
							{...getLabelsProps(s, i)}
							dy={-3}
							class={`${sref?.fill2} ${s.key === highlightKey ? "opacity-100" : "opacity-0"}`} />
					{/snippet}
				</LinearGradient>
			{/each}
		{/snippet}

		{#snippet aboveMarks({
			visibleSeries,
			context,
		}: {
			visibleSeries: any;
			series: any;
			context: any;
		})}
			<AnnotationLine
				y={15.0}
				label="PSA"
				props={{
					line: {
						class: `stroke-primary-500 opacity-40 [stroke-dasharray:2,2] [stroke-linecap:round]`,
					},
					label: {
						class: `stroke-primary-500 opacity-40 text-[8px] [stroke-linecap:round]`,
					},
				}} />

			<!-- {#each visibleSeries as s (s.key)}
				{@const sref = series.find((ser: any) => s.key === ser.key)}
				<AnnotationLine
					y={sref?.threshold}
					label={s.key.toUpperCase()}
					props={{
						line: {
							class: `${sref?.stroke2} opacity-40 [stroke-dasharray:2,2] [stroke-linecap:round]`,
						},
						label: {
							class: `${sref?.fill2} opacity-40 text-[8px] [stroke-linecap:round]`,
						},
					}} />
			{/each} -->
			<!-- {#if showannots}
				{#each annots as anot}
					<AnnotationLine
						x={anot.date}
						label={anot.test}
						labelPlacement="top-left"
						labelXOffset={4}
						props={{
							line: { class: "stroke-success-500/40 [stroke-dasharray:2,2]" },
							label: {
								class: "fill-success-500 opacity-40 text-[8px]",
								verticalAnchor: "end",
								rotate: -90,
								dy: 5,
								dx: 5,
							},
						}} />
				{/each}
			{/if} -->
		{/snippet}

		{#snippet axis({
			context,
			visibleSeries,
			series,
		}: {
			context: any;
			visibleSeries: any;
			series: any;
		})}
			<!-- note comment below needed to force TW to compile for combine template strings below o/w
			unrecognized fill-primary-500 fill-secondary-500 fill-tertiary-500 stroke-primary-500
			stroke-secondary-500 stroke-tertiary-500 -->
			<Axis
				placement="bottom"
				rule={{ class: "stroke-primary-500" }}
				tickLabelProps={{
					class: "stroke-transparent fill-primary-500",
				}}
				classes={{ tick: "stroke-primary-500" }} />
			{#each visibleSeries as s (s.key)}
				{@const sref = series.find((ser: any) => s.key === ser.key)}
				{@const ymax = Math.ceil(Math.max(...psas.map((p: any) => p[s.key])))}
				<Axis
					label={s.key.toUpperCase()}
					placement={s.key === "psa" ? "left" : "right"}
					scale={scaleSqrt([0, ymax], [context.height, 0])}
					ticks={(scale) => [...new Set([sref?.props.threshold, ...(scale.ticks?.() ?? [])])]}
					rule={{ class: `stroke-${sref?.props?.pcolor}` }}
					labelProps={{
						dx: s.key === "psa" ? 5 : -40,
						class: `fill-${sref?.pcolor} stroke-transparent`,
					}}
					tickLabelProps={{
						dx: s.key === "psa" ? -20 : 8,
						textAnchor: "start",
						class: `stroke-transparent fill-${sref?.props.pcolor}`,
					}}
					classes={{ tick: `stroke-${sref?.props.pcolor}` }}
					class={`transition-all ${sref.key === "psadt" && visibleSeries.some((s: any) => s.key === "psavel") ? "translate-x-[40px]" : ""}`} />
			{/each}
		{/snippet}

		{#snippet tooltip({ context, visibleSeries, series })}
			<Tooltip.Root class="rounded-xl p-4 shadow-xl" role="tooltip" aria-live="polite">
				{#snippet children({ data })}
					<!-- {@debug data} -->
					{#if data.annotation}
						<!-- <div class="whitespace-nowrap">
							aaaa{data.annotation.details}
						</div> -->
						<Tooltip.Header>
							{context.data.annotation.test} on {format(context.data.annotation.date, "day")}
						</Tooltip.Header>
						<div class="whitespace-nowrap">
							{@html context.data.annotation.value + " " + context.data.annotation.units}
						</div>
					{:else}
						<Tooltip.Header class="justify-center; flex">{format(data.date, "day")}</Tooltip.Header>
						<Tooltip.List>
							{#each visibleSeries as s}
								{@const sref = series.find((ser) => s.key === ser.key)}
								{@const units =
									sref?.key === "psa" ? " ng/ml" : sref?.key === "psadt" ? " years" : " ng/ml/year"}
								<Tooltip.Item
									label={s.key.toUpperCase()}
									value={data[s.key] + units}
									color={sref?.color} />
							{/each}
						</Tooltip.List>
					{/if}
				{/snippet}
			</Tooltip.Root>
		{/snippet}

		{#snippet legend({ getLegendProps })}
			<Legend {...getLegendProps()} tickFormat={(s) => s.toUpperCase()} />
		{/snippet}
	</LineChart>
</div>

<SvelteTooltip>
	{#snippet trigger()}Hover Me{/snippet}
	{#snippet content()}This is a tooltip.{/snippet}
</SvelteTooltip>
