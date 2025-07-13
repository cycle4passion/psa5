<svelte:head>
	<title>Prostate Biomarkers Comparison</title>
	<meta
		name="description"
		content="Comprehensive comparison of prostate cancer biomarker tests including PSAD, PSA Velocity, and other diagnostic tools." />
</svelte:head>
<section class="max-w-[900px] mx-auto px-8">
	<h1 class="text-3xl font-bold text-center py-4 relative">
		Prostate Biomarkers
	</h1>
	<div class="absolute top-20 right-5 print:hidden">
		<button
			class="btn btn-sm variant-ringed-primary rounded-full hover:variant-filled-primary px-4"
			aria-label="Print this page"
			onclick={() => window.print()}>
			Print
		</button>
	</div>
	<blockquote
		class="border-left ml-5 pl-5 border-primary-500 border-s-[8px] print:hidden"
		cite="https://www.nccn.org/professionals/physician_gls/pdf/prostate.pdf">
		<header>
			<h2 class="pb-4">NCCN Guidelines</h2>
		</header>
		<div class="content">
			<p>
				In individuals who have not yet undergone biopsy but have a PSA of &gt;3
				ng/mL, the NCCN recommends at least one of the following tests be
				considered:
			</p>
			<div class="flex flex-wrap gap-x-2 gap-y-1 pl-[3rem] py-2">
				<span class="anchor font-medium"><a href="#fPSA">fPSA,</a></span>
				<span class="anchor font-medium"><a href="#phi">phi</a>,</span>
				<span class="anchor font-medium"
					><a href="#selectmdx">SelectMDx</a>,</span>
				<span class="anchor font-medium"><a href="#4kscore">4Kscore</a>,</span>
				<span class="anchor font-medium"
					><a href="#epi">ExoDx Prostate (Intelliscore) (EPI)</a></span>
			</div>

			<p>
				In individuals with a negative biopsy result but a higher risk for
				prostate cancer (eg, because of race, family history), the NCCN suggests
				the following tests be considered:
			</p>
			<div class="flex flex-wrap gap-x-2 gap-y-1 pl-[3rem] py-2">
				<span class="anchor font-medium"><a href="#fPSA">fPSA</a>,</span>
				<span class="anchor font-medium"><a href="#phi">phi</a>,</span>
				<span class="anchor font-medium"><a href="#4kscore">4Kscore</a>,</span>
				<span class="anchor font-medium"
					><a href="#confirmMDx">ConfirmMDx</a></span>
			</div>
		</div>
		<footer class="mt-4 text-xs italic">
			Source: <a
				href="https://www.nccn.org/professionals/physician_gls/pdf/prostate.pdf"
				class="anchor"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="NCCN Guidelines Version 2.2024 (opens in new tab)"
				>NCCN Guidelines Version 2.2024 (MP-22)</a>
		</footer>
	</blockquote>

	<div class="overflow-x-auto">
		<div class="inline-block min-w-full align-middle">
			<div
				class="table-container w-full border-collapse rounded-2xl border-4 overflow-clip my-6">
				<table
					class="table table-hover border-collapse w-full"
					role="grid"
					aria-labelledby="biomarkers-table-title">
					<caption id="biomarkers-table-title" class="sr-only">
						Prostate Cancer Biomarker Tests Comparison
					</caption>
					<thead>
						<tr>
							<th scope="col" class="font-bold p-2">Test Name</th>
							<th scope="col" class="font-bold p-2">Specimen Source</th>
							<th scope="col" class="font-bold p-2 text-center"
								>Medicare Approved</th>
							<th scope="col" class="font-bold p-2 text-center"
								>NCCN Approved</th>
							<th scope="col" class="font-bold p-2 text-center"
								>Negative Predictive Value</th>
							<th scope="col" class="font-bold p-2">Utility</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">
								<a
									href="https://www.pcrm.org/health-topics/prostate-cancer"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">PSAV</a>
							</th>
							<td
								>Blood - ≥3 PSA test results obtained over ≥18 mos to determine
								the rate of change in PSA levels. General rule &gt; 0.75/yr</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Yes</td>
							<td class="text-center">?</td>
							<td
								>May be considered alongside other criteria in determining
								whether biopsy should be performed when PSA levels are low Not
								helpful with PSA levels &gt;10 ng/mL</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1477608/"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">PSAD (PSA Density)</a>
							</th>
							<td
								>Blood PSA (ng/mL) divided by prostate volume (cc) from imaging</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Not specified</td>
							<td
								>Helps discriminate between prostate cancer and BPH. Traditional
								cutoff of 0.15 ng/mL/cc may spare unnecessary biopsies but has
								sensitivity concerns. Correlates with cancer aggressiveness and
								may predict adverse pathology. Recommended for biopsy-naïve
								patients with elevated PSA or negative mpMRI.</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://www.mayocliniclabs.com/test-catalog/Clinical+and+Interpretive/81944"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">%fPSA</a>
							</th>
							<td id="fPSA">Blood - Ratio of free to total PSA</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Yes</td>
							<td class="text-center">?</td>
							<td
								>May be useful in patients ≥50 yrs with normal DRE but total PSA
								of 4-10 ng/mL, particularly in those who have previously
								undergone. 25% fPSA cutoff detected 95% of prostate cancers
								while avoiding 20% of unnecessary prostate biopsies.2</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://lynxdx.com/my-prostate-score/providers/"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">MyProstateScore 2.0 (MPS2)</a>
							</th>
							<td id="mps2">Urine - 18 biomarkers</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Up to 99%</td>
							<td>Unknown</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://lynxdx.com/products/prostate-health-index/"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">phi</a>
							</th>
							<td id="phi">Blood - freePSA + totalPSA + proPSA = phi Score</td>
							<td class="text-center">Not specified</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Not specified</td>
							<td
								>May be useful in patients ≥50 yrs with normal DRE but total PSA
								of 4-10 ng/mL. Higher scores indicate a higher probability of
								cancer. May assist in distinguishing between cancerous and
								benign conditions and in distinguishing high-grade cancers from
								low-grade cancers</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://www.4kscore.com/"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">4Kscore® Test</a>
							</th>
							<td id="4kscore"
								>Blood - combines fPSA, tPSA, human kallikrein 2 (hK2), and
								intact PSA with consideration age, DRE results, and prior biopsy
								status.</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Yes</td>
							<td class="text-center">95%</td>
							<td
								>May be considered before biopsy and in those with a previous
								negative biopsy result who are considered to be at increased
								risk for prostate cancer</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://www.mdxhealth.com/healthcare-professional/selectmdx/"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">SelectMDx</a>
							</th>
							<td id="selectmdx"
								>Urine expression of DLX1 and HOXC6 in urine collected after DRE</td>
							<td class="text-center">Not specified</td>
							<td class="text-center">Yes</td>
							<td class="text-center">95%</td>
							<td
								>May reduce the likelihood of unnecessary biopsy. May be
								considered for individuals who have not undergone biopsy</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://www.clevelanddx.com/isopsa-testing"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">IsoPSA</a>
							</th>
							<td id="IsoPSA"
								>Blood - Structure-based PSA test that measures all PSA isoforms</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Not specified</td>
							<td class="text-center">Not specified</td>
							<td
								>Uses structure-focused approach to detect structural changes in
								PSA protein. May help reduce unnecessary biopsies and better
								identify high-grade disease (≥ Grade Group 2). FDA Breakthrough
								Device Designation.</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://www.exosomedx.com/healthcare-professionals/our-products/exodx-prostate-test"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">ExoDx™ Prostate Test (EPI)</a>
							</th>
							<td id="epi"
								>Urine (non-DRE) measures PCA3 and ERG RNA, normalized to SPDEF</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Not specified</td>
							<td class="text-center">91.3%</td>
							<td
								>Aids in distinguishing aggressive cancers from less aggressive
								cancers and benign conditions. May be useful for individuals
								being considered for initial or repeat biopsy</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://mdxhealth.com/healthcare-professional/confirmmdx/"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">ConfirmMDx</a>
							</th>
							<td id="confirmMDx"
								>Prostate biopsy tissue - Assesses hypermethylation of the
								promoter regions of GSTP1, APC, and RASSF1</td>
							<td class="text-center">Yes</td>
							<td class="text-center">Not specified</td>
							<td class="text-center">Yes</td>
							<td
								>May be useful for individuals being considered for repeat
								biopsy to aid in identifying those at higher risk for prostate
								cancer diagnosis</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://www.stockholm3.com/for-healthcare-professionals"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">Stockholm3</a>
							</th>
							<td id="stockholm3"
								>Blood - Combines PSA, clinical information, and genetic markers
								(232 SNPs)</td>
							<td class="text-center">Not specified</td>
							<td class="text-center">Not specified</td>
							<td class="text-center">Not specified</td>
							<td
								>Reduces unnecessary biopsies by 50% while detecting more
								aggressive cancers than PSA alone. CE marked and validated in
								European populations.</td>
						</tr>
						<tr>
							<th scope="row">
								<a
									href="https://www.mirnascientific.com/"
									class="anchor"
									target="_blank"
									rel="noopener noreferrer">MiR Sentinel™ PCP Test</a>
							</th>
							<td id="mir"
								>Urine - Small non-coding RNAs (sncRNA) biomarkers</td>
							<td class="text-center">Not specified</td>
							<td class="text-center">Not specified</td>
							<td class="text-center">98%</td>
							<td
								>Can detect molecular evidence of prostate cancer in men with
								clinical suspicion of prostate cancer.</td>
						</tr>
					</tbody>
				</table>

				<p class="p-2 text-xs italic">
					References:
					<a
						href="https://www.nccn.org/professionals/physician_gls/pdf/prostate.pdf"
						class="anchor"
						target="_blank"
						rel="noopener noreferrer">NCCN Guidelines</a
					>,
					<a
						class="anchor"
						href="https://arupconsult.com/content/prostate-cancer"
						target="_blank"
						rel="noopener noreferrer">Arup Consult</a
					>,
					<a
						class="anchor"
						href="https://www.pcmarkers.com/patients/prostate-cancer-screening-tests"
						target="_blank"
						rel="noopener noreferrer">PC Markers</a>
				</p>
				<p class="text-sm text-center">Last Updated 3/2/2025</p>
			</div>
		</div>
	</div>
</section>

<style>
	th,
	td {
		@apply border p-2 text-sm;
	}

	:global(.anchor) {
		@apply text-primary-500 hover:underline transition-colors duration-200;
	}

	@media print {
		@page {
			size: landscape;
		}

		table {
			page-break-inside: avoid;
		}
	}
</style>
