<script lang="ts">
	import useClipboard from "$lib/runes/useClipboard";
	import Tooltip from "$lib/components/Tooltip.svelte";
	import { ClipboardCopy } from "@lucide/svelte";
	const clipboard = useClipboard("intiialValue");

	type Props = {
		psa?: number;
	};

	// let { data } = $props();
	// let { data: psas } = data;
	// let psa = $state(psas[psas.length - 1].psa);

	let { psa = 10 }: Props = $props();
	let l = $state(10);
	let w = $state(10);
	let h = $state(10);
	let volume = $state(0);
	let measuredby = $state("CT");
	let measureunits = $state("cm");
	let volumetype = $state("Modified Bullet");
	let ellipsoidVolume;
	let modBulletVolume;

	calculateVolume();
	function calculateVolume() {
		if (!l || !w || !h) return "";
		let multiplier = measureunits === "mm" ? 10 ** 3 : 1;
		const box = l * w * h * multiplier;
		ellipsoidVolume = Number((box * 0.52).toFixed(0));
		modBulletVolume = Number((box * 0.66).toFixed(0));
		const newVolume = volumetype === "Modified Bullet" ? modBulletVolume : ellipsoidVolume;

		// Only announce if the volume has changed
		if (newVolume !== volume) {
			volume = newVolume;
			announceChange(
				`New prostate volume calculated: ${volume} cubic centimeters using ${volumetype} formula`,
			);
		}
	}

	// Add this function for screen reader announcements
	function announceChange(message: string) {
		const announcement = document.createElement("div");
		announcement.setAttribute("aria-live", "polite");
		announcement.setAttribute("class", "sr-only");
		document.body.appendChild(announcement);

		// Set the message after a brief delay to ensure it's announced
		setTimeout(() => {
			announcement.textContent = message;
			// Remove the element after announcement
			setTimeout(() => {
				document.body.removeChild(announcement);
			}, 1000);
		}, 100);
	}

	let psad = $derived.by(() => {
		if (!psa || !volume) return 0;
		const value = Number((psa / volume).toFixed(2));
		// Announce changes to screen readers
		announceChange(`New PSA density calculated: ${value}`);
		return value;
	});

	function selectAll(e: FocusEvent) {
		(e.currentTarget as HTMLInputElement).select();
	}
</script>

<svelte:head>
	<title>Prostate Volume and Density Calculator</title>
	<meta
		name="description"
		content="Determines prostate volume from length, width, and height measurements. If there is a existing or entered PSA value, then the PSA and volume are used to calculate the PSA density." />
</svelte:head>
<button
	class="btn btn-sm variant-ringed-primary hover:variant-filled-primary absolute top-20 right-5 rounded-full px-4 print:hidden"
	aria-label="Print this page"
	onclick={() => window.print()}>
	Print
</button>
<div class="mx-auto flex h-full items-center justify-center">
	<form class="card mx-10 rounded-xl p-4 shadow-lg" aria-labelledby="calculator-title" novalidate>
		<h1 id="calculator-title" class="pb-6 text-center text-3xl">Prostate Volume Calculator</h1>
		<section class="grid grid-cols-[360px_305px] gap-x-[50px] gap-y-4 p-4">
			<!-- Measurements Section -->
			<section aria-labelledby="measurements-title">
				<header class="flex pb-2 font-bold" id="measurements-title">
					<h2>Prostate Measurements:</h2>
					<fieldset class="flex items-center">
						<legend class="sr-only">Measurement Units</legend>
						<label class="pl-5"
							><input
								class="radio mr-2"
								tabindex="0"
								type="radio"
								value="cm"
								onchange={calculateVolume}
								bind:group={measureunits} />cm</label>
						<label class="pl-5"
							><input
								class="radio mr-2"
								type="radio"
								value="mm"
								onchange={calculateVolume}
								bind:group={measureunits} />mm</label>
					</fieldset>
				</header>

				<article class="grid grid-cols-[80px_70px_1fr] items-center gap-x-3 gap-y-2">
					<label class="grid justify-end" for="width">
						Width:
						<span class="sr-only">in {measureunits}</span>
					</label>
					<input
						id="width"
						type="number"
						class="input justify-center p-1 text-center"
						bind:value={w}
						onchange={calculateVolume}
						onfocus={selectAll}
						required
						min="0"
						aria-invalid={!w}
						aria-errormessage="width-error" />
					{#if !w}
						<div id="width-error" class="text-error-500" role="alert">Width is required</div>
					{:else}
						{measureunits}
					{/if}
					<label class="grid justify-end" for="height">Height:</label><input
						id="height"
						type="number"
						class="input p-1 text-center"
						bind:value={h}
						onchange={calculateVolume}
						onfocus={selectAll}
						required
						min="0"
						aria-invalid={!h}
						aria-errormessage="width-error" />
					{#if !h}
						<div id="height-error" class="text-error-500" role="alert">Height is required</div>
					{:else}
						{measureunits}
					{/if}
					<label class="grid justify-end" for="length">Length:</label><input
						id="length"
						type="number"
						class="input p-1 text-center"
						bind:value={l}
						onchange={calculateVolume}
						onfocus={selectAll}
						required
						min="0"
						aria-invalid={!l}
						aria-errormessage="length-error" />
					{#if !l}
						<div id="length-error" class="text-error-500" role="alert">Length is required</div>
					{:else}
						{measureunits}
					{/if}
					<span class="col-span-3 h-2"></span>
					<label for="psa" class="grid justify-end">PSA:</label>
					<input
						id="psa"
						type="number"
						aria-label="PSA value in ng/ml"
						aria-describedby="psa-units"
						min="0"
						step="0.1"
						required
						class="input p-1 text-center"
						bind:value={psa} />
					<span id="psa-units">ng/ml</span>
				</article>
			</section>

			<!-- Options Section -->
			<aside>
				<fieldset>
					<legend class="pb-2 font-bold">Measured By:</legend>
					<label class="pl-5" for="measuredbyct">
						<input
							id="measuredbyct"
							name="measuredby"
							class="radio mr-2"
							type="radio"
							value="CT"
							bind:group={measuredby}
							aria-label="Measured by CT" />
						by CT
					</label>
					<label class="pl-5" for="measuredbyus"
						><input
							id="measuredbyus"
							class="radio mr-2"
							name="measuredby"
							type="radio"
							value="US"
							bind:group={measuredby} />by US</label>
				</fieldset>

				<fieldset>
					<legend class="py-2 font-bold">Formula:</legend>
					<label class="pl-5" for="bullet"
						><input
							id="bullet"
							class="radio mr-2"
							name="formula"
							type="radio"
							value="Modified Bullet"
							onchange={calculateVolume}
							bind:group={volumetype} />Modified Bullet
						<div class="pl-7 text-xs italic">accurate for larger prostates</div>
					</label>
					<label class="pl-5" for="ellipsoid"
						><input
							id="ellipsoid"
							class="radio mr-2"
							name="formula"
							type="radio"
							value="Ellipsoid"
							onchange={calculateVolume}
							bind:group={volumetype} />Ellipsoid
						<div class="pl-7 text-xs italic">accurate for smaller prostates</div>
					</label>
				</fieldset>
			</aside>

			<!-- Results Section -->
			<section aria-labelledby="results-title" class="grid gap-y-4 pt-4">
				<h2 id="results-title" class="sr-only">Results</h2>

				<!-- Volume Result -->
				<div class="grid grid-cols-[140px_auto_30px] items-center gap-x-2">
					<h3 id="volume-label" class="grid justify-end">Prostate Volume:</h3>
					<span class="flex items-center gap-2">
						<input
							id="volume"
							type="number"
							class="input w-20 p-1 text-center"
							bind:value={volume}
							onfocus={selectAll} />
						ccs³
					</span>
					<Tooltip disabled={!volume}>
						{#snippet trigger()}
							<button
								type="button"
								disabled={!volume}
								aria-disabled={!volume}
								tabindex="-1"
								title=""
								aria-label="Copy prostate volume of {volume} cubic centimeters to clipboard"
								class="button btn copy hover:fill-secondary-500 size-7 fill-white p-1">
								<ClipboardCopy />
								<span class="sr-only">Copy Prostate Volume to clipboard</span>
							</button>
						{/snippet}
						Copy Prostate Volume to Clipboard
					</Tooltip>
				</div>

				<!-- Density Result -->
				<div class="grid grid-cols-[140px_auto_30px] items-center gap-x-2">
					<h3 id="density-label" class="grid justify-end">PSA Density:</h3>
					{#if psa && volume}
						<span
							class={psad <= 0.15 ? "text-green-500" : "text-red-500"}
							role="status"
							aria-live="polite"
							aria-atomic="true">
							{psad} ml³/ng/ml
							<span class="sr-only">{psad <= 0.15 ? "Normal" : "Elevated"} PSA density.</span>
							(&lt0.15)
						</span>
					{:else}
						<span class="text-sm italic">
							Missing{!psa ? " PSA" : ""}{!psa && !volume ? " and " : ""}{!volume ? " Volume" : ""}
						</span>
					{/if}
					<Tooltip disabled={!psad}>
						{#snippet trigger()}
							<button
								class="button btn copy hover:fill-secondary-500 size-7 fill-white p-1"
								type="button"
								disabled={!psad}
								tabindex="-1"
								title=""
								onclick={() =>
									clipboard.copy(`Prostate PSA Density: ${psad}ng/cc/cc³ (normal <0.15). `)}>
								<ClipboardCopy />
								<span class="sr-only"
									>{clipboard.copied ? "Copied" : "Copy"} Prostate Density to clipboard</span>
							</button>
						{/snippet}
						Copy Prostate Density to Clipboard
					</Tooltip>
				</div>
			</section>

			<!-- Combined Copy Button Section -->
			<article class="flex items-center gap-6 pt-5">
				<div class="size-8 rotate-45 border-2 border-b-0 border-l-0 border-white"></div>

				<!-- <Tooltip disabled={!psad || !volume}> -->
				<Tooltip>
					{#snippet trigger()}
						<button
							class="button btn copy hover:fill-secondary-500 size-7 fill-white p-1"
							tabindex="-1"
							type="button"
							title=""
							disabled={!psad || !volume}
							onclick={() =>
								clipboard.copy(
									`${measuredby} Calculated Prostate Volume (${volumetype} Formula): ${volume}ccs, Prostate PSA Density: ${psad}ng/cc/cc³ (normal <0.15). `,
								)}>
							<ClipboardCopy /></button>
						<span class="sr-only"
							>{clipboard.copied ? "Copied" : "Copy"} Prostate Volume and Density to clipboard</span>
					{/snippet}
				</Tooltip>
				Copy Prostate Volume & Density to Clipboard
			</article>
		</section>
	</form>
</div>

<style>
	input[type="number"]::-webkit-inner-spin-button,
	input[type="number"]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		-moz-appearance: textfield;
		margin: 0;
		appearance: none;
	}

	@media print {
		@page {
			size: landscape;
		}
	}
</style>
