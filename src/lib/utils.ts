import { Temporal } from "temporal-polyfill";

export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

export const trim0decimals = (num: number) =>
	num.toFixed() === num.toString() ? num.toFixed() : num.toString();

export function dateDifference(
	date1: string,
	date2: string,
	unit: "year" | "month" | "week" | "day" = "year",
) {
	if (!date1 || !date2) {
		throw new Error("Both date1 and date2 must be provided");
	}
	const plainDate1 = Temporal.Instant.from(date1).toZonedDateTimeISO("UTC").toPlainDate();
	const plainDate2 = Temporal.Instant.from(date2).toZonedDateTimeISO("UTC").toPlainDate();

	return plainDate2.since(plainDate1, { largestUnit: unit });
}

export function calcDoublingTime(
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

export function calcVelocity(
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
