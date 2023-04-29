import { cubicOut } from 'svelte/easing'

export function fadeScale(node: Element, { delay = 0, duration = 200, baseScale = 0.9 }) {
	const o = +getComputedStyle(node).opacity
	const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/)
	const s = m ? Number(m[1]) : 1
	const is = 1 - baseScale

	return {
		delay,
		duration,
		css: (t: number) => {
			const eased = cubicOut(t)
			return `opacity: ${eased * o}; transform: scale(${eased * s * is + baseScale})`
		}
	}
}
