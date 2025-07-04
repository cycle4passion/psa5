import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

/* TODO:
	Age adjust PSa line
	Good colors: https://www.w3schools.com/Css/css_colors_rgb.asp
	notch interval: 2,5,10,All
	offset Y at top for
	print include tooltips for PSA points
*/

// export function linearRegression(inputArray, xKey, yKey) {
// 	const x = inputArray.map((element) => dayjs(element[xKey]).valueOf());
// 	const y = inputArray.map((element) => element[yKey]);
// 	const sumX = x.reduce((prev, curr) => prev + curr, 0);
// 	const avgX = sumX / x.length;
// 	const xDifferencesToAverage = x.map((value) => avgX - value);
// 	const xDifferencesToAverageSquared = xDifferencesToAverage.map((value) => value ** 2);
// 	const SSxx = xDifferencesToAverageSquared.reduce((prev, curr) => prev + curr, 0);
// 	const sumY = y.reduce((prev, curr) => prev + curr, 0);
// 	const avgY = sumY / y.length;
// 	const yDifferencesToAverage = y.map((value) => avgY - value);
// 	const xAndYDifferencesMultiplied = xDifferencesToAverage.map(
// 		(curr, index) => curr * yDifferencesToAverage[index]
// 	);
// 	const SSxy = xAndYDifferencesMultiplied.reduce((prev, curr) => prev + curr, 0);
// 	const slope = SSxy / SSxx;
// 	const intercept = avgY - slope * avgX;
// 	return slope;
// }

//const lines = ['Biopsy', 'PSA2', 'PxMRI', 'FusionBx'];

function dT(data: { x: string; y: number }[]): { x: string; y: number }[] {
	// dT = ln 2 / slope
	let last = data[0];
	const calcDt = (x1, y1, x2, y2) => {
		const diffX = dayjs(x2).diff(dayjs(x1), 'year', true);
		const slope = Math.log(y2) - Math.log(y1);
		const dt = parseFloat(((Math.log(2) * diffX) / slope).toFixed(1));
		//console.log(diffX, slope, dt);
		return isFinite(dt) ? dt : 0;
	};

	return data.map((current) => {
		const { x: x2, y: y2 } = current;
		const { x: x1, y: y1 } = last;
		last = current;
		return { x: x2, y: calcDt(x1, y1, x2, y2) };
	});
}

function velocity(data: { x: string; y: number }[]): { x: string; y: number }[] {
	/* avgVelocity = (x2-x1)/(y2-y1) */
	let last = data[0];
	const calcVel = (x1, y1, x2, y2) => {
		const diffX = dayjs(x2).diff(dayjs(x1), 'year', true);
		const diffY = y2 - y1;
		const vel = parseFloat((diffY / diffX).toFixed(2));
		return isFinite(vel) ? vel : 0;
	};

	return data.map((current) => {
		const { x: x2, y: y2 } = current;
		const { x: x1, y: y1 } = last;
		last = current;
		return { x: x2, y: calcVel(x1, y1, x2, y2) };
	});
}

function sort(arr: { x: string; y: number }[]) {
	return arr.sort((a, b) => {
		const dateA = new Date(a.x);
		const dateB = new Date(b.x);
		return dateA.getTime() - dateB.getTime();
	});
}

export function minValue(ctx) {
	const dataset = ctx.chart.data.datasets[0];
	const min = dataset.data.reduce((max, point) => Math.min(point, max), Infinity);
	return isFinite(min) ? min : 0;
}

export function maxValue(ctx) {
	const datasets = ctx.chart.data.datasets;
	const count = datasets[0].data.length;
	let max = 0;
	for (let i = 0; i < count; i++) {
		let sum = 0;
		for (const dataset of datasets) {
			sum += dataset.data[i];
		}
		max = Math.max(max, sum);
	}
	return max;
}
