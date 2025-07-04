import { Temporal } from "temporal-polyfill";
import { dateDifference } from "$lib/utils";

type PsaData = { psa: number; date: string };
type FullPsaData = PsaData & {
	psadt: number;
	psavel: number;
};

export const load = async () => {
	const data: PsaData[] = [
		{
			psa: 0.4,
			date: "2002-09-07T04:00:00.000Z",
		},
		{
			psa: 1.2,
			date: "2010-09-10T04:00:00.000Z",
		},
		{
			psa: 3.4,
			date: "2016-01-06T04:00:00.000Z",
		},
		{
			psa: 9,
			date: "2020-01-06T04:00:00.000Z",
		},
		{
			psa: 12,
			date: "2023-05-08T04:00:00.000Z",
		},
		{
			psa: 35,
			date: "2024-09-08T04:00:00.000Z",
		},
	];

	const annots = [
		{ date: "2006-01-06T04:00:00.000Z", test: "TRUSBxPx", result: "N/A" },
		{ date: "2012-02-06T04:00:00.000Z", test: "Decipher", result: 9 },
		{ date: "2004-05-08T04:00:00.000Z", test: "MRI", result: "N/A" },
		{ date: "2020-07-08T04:00:00.000Z", test: "Fusion TRUSBxPX", result: "N/A" },
	];

	const fullPsaData: FullPsaData[] = addPSACalcs(data);
	// can't calculate dt/vel for first data point, so copy the second data point to the first
	fullPsaData[0].psadt = fullPsaData[1].psadt;
	fullPsaData[0].psavel = fullPsaData[1].psavel;

	return {
		psas: fullPsaData
			.sort(
				(a, b) =>
					Temporal.Instant.from(a.date).epochMilliseconds -
					Temporal.Instant.from(b.date).epochMilliseconds,
			)
			.map((p) => ({ ...p, date: new Date(p.date) })),
		annots: annots
			.sort(
				(a, b) =>
					Temporal.Instant.from(a.date).epochMilliseconds -
					Temporal.Instant.from(b.date).epochMilliseconds,
			)
			.map((a) => ({ ...a, date: new Date(a.date) })),
	};

	function addPSACalcs(data: PsaData[]): FullPsaData[] {
		if (data.length < 2) return [];

		return data.map((current, i, arr) => {
			const prev = arr[i - 1] ?? arr[1];
			const psadt = calcDoublingTime(prev.date, prev.psa, current.date, current.psa);
			const psavel = calcVelocity(prev.date, prev.psa, current.date, current.psa);
			return { ...current, psadt, psavel };
		});

		function calcDoublingTime(
			date1: string,
			value1: number,
			date2: string,
			value2: number,
			decimals = 1,
		) {
			const diffdate = dateDifference(date1, date2).years;
			const psaRatio = value2 / value1;
			const psadt = diffdate / Math.log(psaRatio);
			return isFinite(psadt) ? parseFloat(psadt.toFixed(decimals)) : 0;
		}
		function calcVelocity(
			time1: string,
			value1: number,
			time2: string,
			value2: number,
			decimals = 2,
		) {
			const diffdate = dateDifference(time1, time2).years;
			const diffValues = value2 - value1;
			const vel = diffValues / diffdate;
			return isFinite(vel) ? parseFloat(vel.toFixed(decimals)) : 0;
		}
	}
};
