<script lang="ts">
	import { ArrowRight } from 'lucide-svelte'
	import { onDestroy, onMount } from 'svelte'
	import { tweened } from 'svelte/motion'
	import { fade } from 'svelte/transition'
	// @ts-expect-error
	import { interpolate } from 'flubber'
	import { cubicInOut, cubicOut } from 'svelte/easing'

	const shapes = [
		'M109.6 -138.1C146.4 -99.8 183.5 -69.3 195.7 -30.1C208 9.2 195.4 57.4 167.1 87.3C138.9 117.3 95.1 129.1 54.5 139.4C13.9 149.7 -23.5 158.5 -61.9 152.3C-100.3 146 -139.8 124.8 -178.9 88.2C-218 51.6 -256.7 -0.2 -246.2 -40.6C-235.7 -80.9 -176 -109.8 -126.8 -146C-77.6 -182.1 -38.8 -225.6 -1.2 -224.1C36.4 -222.7 72.8 -176.5 109.6 -138.1',
		'M171 -197C171 -136.3 85.5 -68.2 75.3 33.5C65.1 135.1 130.2 270.3 117.2 297.2C104.3 324 13.3 242.7 -55.1 183.3C-123.6 123.9 -169.5 86.5 -176.9 43.5C-184.3 0.4 -153.1 -48.5 -117.2 -117.3C-81.3 -186.2 -40.7 -275.1 22.4 -293C85.5 -310.8 171 -257.7 171 -197',
		'M67.9 -120.4C94.4 -102.3 126.9 -97.1 131.1 -79.2C135.2 -61.3 111.1 -30.7 127.9 9.7C144.6 50 202.2 100 194 110.8C185.7 121.7 111.6 93.3 68.3 92C25 90.6 12.5 116.3 -3.7 122.7C-19.8 129 -39.7 116 -70.1 110C-100.6 103.9 -141.7 104.7 -161.2 87.5C-180.8 70.3 -178.9 35.2 -165.2 7.9C-151.5 -19.3 -126 -38.7 -103.1 -50.1C-80.1 -61.5 -59.8 -64.9 -43.1 -88.8C-26.3 -112.6 -13.2 -156.8 3.7 -163.3C20.7 -169.8 41.3 -138.6 67.9 -120.4',
		'M125.8 -172.7C150.4 -129.2 149.1 -77.6 148.2 -33.4C147.3 10.8 146.8 47.7 139.3 99C131.8 150.3 117.2 216.1 82.9 229.1C48.7 242.1 -5.2 202.3 -65.1 180C-124.9 157.7 -190.6 152.9 -229.3 117.2C-268.1 81.5 -279.8 15.1 -267.1 -45.3C-254.3 -105.8 -217.2 -160.1 -168.6 -199.4C-120 -238.7 -60 -262.8 -4.7 -257.2C50.6 -251.6 101.1 -216.2 125.8 -172.7',
		'M48.1 -92.2C62.8 -74.7 75.6 -62.9 85.1 -48.4C94.6 -34 100.8 -17 112.3 6.7C123.9 30.3 140.7 60.7 137.5 85.9C134.2 111.2 110.9 131.4 84.6 149.9C58.3 168.4 29.2 185.2 8.3 170.8C-12.5 156.3 -25 110.6 -68 101.8C-111 93 -184.6 121 -228.3 110.2C-272.1 99.3 -286 49.7 -266.7 11.2C-247.3 -27.3 -194.7 -54.7 -163.9 -88C-133.2 -121.4 -124.3 -160.7 -100.7 -173C-77 -185.4 -38.5 -170.7 -10.9 -151.8C16.7 -132.9 33.3 -109.7 48.1 -92.2'
	]

	const shape = tweened(shapes[0], {
		interpolate,
		easing: cubicInOut,
		duration: 4000
	})

	let interval: number
	let currentBlobIndex = 0

	function fadeScale(node: Element, { delay = 0, duration = 200, baseScale = 0.9 }) {
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

	let mounted = false
	onMount(() => {
		mounted = true
		$shape = shapes[currentBlobIndex + 1]
		interval = setInterval(() => {
			currentBlobIndex = (currentBlobIndex + 1) % shapes.length
			$shape = shapes[currentBlobIndex]
		}, 5000)
	})

	onDestroy(() => {
		clearInterval(interval)
	})
</script>

{#key mounted}
	<div class="relative h-screen w-full overflow-hidden">
		<main
			class="z-10 absolute bg-zinc-950/50 backdrop-blur-xl md:backdrop-blur-2xl p-6 flex flex-col justify-center items-center inset-0 gap-8"
		>
			<h1
				in:fadeScale={{}}
				class="text-center text-5xl md:text-7xl font-semibold bg-clip-text text-transparent bg-gradient-to-t from-zinc-300 via-zinc-100 to-zinc-50"
			>
				See Tomorrow <span
					class="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-600 to-primary-800"
					>Now.</span
				>
			</h1>
			<p
				in:fade
				class="text-center bg-clip-text text-transparent bg-gradient-to-t from-zinc-400 to-zinc-50 md:text-lg"
			>
				Predict the future of the world with Glimpse without waiting for 10 years.
			</p>
			<button
				in:fade
				class="inline-flex group items-center h-10 py-2 px-4 hover:pr-3 transition-all text-primary-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-zinc-950 bg-primary-600 hover:bg-primary-700"
			>
				Get Started
				<ArrowRight class="w-4 h-4 ml-2 group-hover:ml-3 transition-[margin]" size={16} />
			</button>
		</main>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="absolute right-[10%] top-[90%] translate-x-1/2 -translate-y-1/2"
			version="1.1"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 700 700"
			><defs
				><radialGradient id="gradient">
					<stop offset="0%" style="stop-color:var(--color-primary-400);" />
					<stop offset="100%" style="stop-color:var(--color-primary-800);" />
				</radialGradient>
			</defs>
			<g transform="translate(350 350)">
				<path d={$shape} fill="url(#gradient)" />
			</g>
		</svg>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="absolute left-[10%] top-[10%] -translate-x-1/2 -translate-y-1/2 -scale-x-100"
			version="1.1"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 1200 1200"
		>
			<g transform="translate(600 600)">
				<path d={$shape} fill="url(#gradient)" />
			</g>
		</svg>
	</div>
{/key}
