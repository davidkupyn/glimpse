<script lang="ts">
	import { interpolate } from 'polymorph-js'
	import { ArrowRight } from 'lucide-svelte'
	import { onDestroy, onMount } from 'svelte'
	import { tweened } from 'svelte/motion'
	import { fade } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'
	import { fadeScale } from '$lib/utils/fadeScale'

	const shapes = [
		'M109.6 -138.1C146.4 -99.8 183.5 -69.3 195.7 -30.1C208 9.2 195.4 57.4 167.1 87.3C138.9 117.3 95.1 129.1 54.5 139.4C13.9 149.7 -23.5 158.5 -61.9 152.3C-100.3 146 -139.8 124.8 -178.9 88.2C-218 51.6 -256.7 -0.2 -246.2 -40.6C-235.7 -80.9 -176 -109.8 -126.8 -146C-77.6 -182.1 -38.8 -225.6 -1.2 -224.1C36.4 -222.7 72.8 -176.5 109.6 -138.1',
		'M171 -197C171 -136.3 85.5 -68.2 75.3 33.5C65.1 135.1 130.2 270.3 117.2 297.2C104.3 324 13.3 242.7 -55.1 183.3C-123.6 123.9 -169.5 86.5 -176.9 43.5C-184.3 0.4 -153.1 -48.5 -117.2 -117.3C-81.3 -186.2 -40.7 -275.1 22.4 -293C85.5 -310.8 171 -257.7 171 -197',
		'M93.6 -97.1C106.1 -81.1 90.5 -40.5 100.7 10.1C110.8 60.8 146.6 121.6 134.1 148.1C121.6 174.6 60.8 166.8 26 140.8C-8.8 114.8 -17.7 70.7 -38 44.2C-58.3 17.7 -90.2 8.8 -121.1 -30.9C-152 -70.7 -182.1 -141.4 -161.8 -157.4C-141.4 -173.4 -70.7 -134.7 -15.1 -119.6C40.5 -104.5 81.1 -113.1 93.6 -97.1',
		'M125.8 -172.7C150.4 -129.2 149.1 -77.6 148.2 -33.4C147.3 10.8 146.8 47.7 139.3 99C131.8 150.3 117.2 216.1 82.9 229.1C48.7 242.1 -5.2 202.3 -65.1 180C-124.9 157.7 -190.6 152.9 -229.3 117.2C-268.1 81.5 -279.8 15.1 -267.1 -45.3C-254.3 -105.8 -217.2 -160.1 -168.6 -199.4C-120 -238.7 -60 -262.8 -4.7 -257.2C50.6 -251.6 101.1 -216.2 125.8 -172.7',
		'M106.2 -203C138.4 -165.3 165.7 -138.4 195.7 -106.4C225.7 -74.3 258.4 -37.2 265 3.8C271.7 44.8 252.3 89.7 231.2 137.2C210.1 184.6 187.3 234.8 148.5 247.9C109.7 260.9 54.8 237 9.8 219.9C-35.2 202.9 -70.3 192.8 -105.8 177.8C-141.3 162.8 -177.2 142.9 -194.6 112.4C-212 82 -211 41 -208.1 1.7C-205.2 -37.7 -200.5 -75.3 -185.1 -109.4C-169.8 -143.5 -143.9 -173.9 -111.3 -211.3C-78.7 -248.8 -39.3 -293.1 -1.2 -291.1C37 -289.1 74 -240.7 106.2 -203',
		'M48.1 -92.2C62.8 -74.7 75.6 -62.9 85.1 -48.4C94.6 -34 100.8 -17 112.3 6.7C123.9 30.3 140.7 60.7 137.5 85.9C134.2 111.2 110.9 131.4 84.6 149.9C58.3 168.4 29.2 185.2 8.3 170.8C-12.5 156.3 -25 110.6 -68 101.8C-111 93 -184.6 121 -228.3 110.2C-272.1 99.3 -286 49.7 -266.7 11.2C-247.3 -27.3 -194.7 -54.7 -163.9 -88C-133.2 -121.4 -124.3 -160.7 -100.7 -173C-77 -185.4 -38.5 -170.7 -10.9 -151.8C16.7 -132.9 33.3 -109.7 48.1 -92.2',
		'M73.2 -31.8C143.5 -2.8 282.7 -1.4 313.7 31C344.7 63.4 267.5 126.8 197.1 136.6C126.8 146.5 63.4 102.7 -10.1 112.9C-83.7 123 -167.3 187 -167.4 177.2C-167.4 167.3 -83.7 83.7 -94.9 -11.2C-106.1 -106.1 -212.1 -212.1 -212.1 -241.1C-212.1 -270.1 -106.1 -222.1 -52.3 -169.7C1.4 -117.4 2.8 -60.8 73.2 -31.8',
		'M109.1 -145.4C123.4 -94.8 104.7 -47.4 109.9 5.2C115.1 57.7 144.2 115.5 129.8 115.5C115.5 115.5 57.7 57.8 -2.5 60.2C-62.7 62.7 -125.4 125.4 -200.4 125.4C-275.4 125.4 -362.7 62.7 -376.7 -14C-390.7 -90.7 -331.5 -181.5 -256.5 -232.2C-181.5 -282.8 -90.7 -293.4 -21.7 -271.7C47.4 -250 94.8 -196.1 109.1 -145.4',
		'M88 -141.2C111.9 -138.5 127.8 -110.8 126.5 -83C125.2 -55.3 106.6 -27.7 115.1 4.9C123.6 37.5 159.2 75 151.6 87.2C144 99.4 93.1 86.2 60.6 102.1C28.1 118.1 14.1 163 -3.6 169.2C-21.2 175.3 -42.3 142.7 -66.1 121.7C-90 100.8 -116.4 91.7 -140 73.3C-163.6 55 -184.3 27.5 -191.9 -4.4C-199.6 -36.3 -194.2 -72.7 -174.8 -98.2C-155.4 -123.8 -121.9 -138.5 -90.5 -136.9C-59 -135.2 -29.5 -117.1 1.2 -119.3C32 -121.4 64 -143.9 88 -141.2',
		'M81.3 -143C97.6 -131.4 97.7 -94 118 -65.8C138.2 -37.7 178.6 -18.8 175.2 -2C171.7 14.8 124.4 29.7 103.1 56.1C81.9 82.5 86.7 120.5 73.8 150.6C61 180.7 30.5 202.8 4.1 195.8C-22.3 188.7 -44.7 152.4 -74.5 132.1C-104.4 111.9 -141.8 107.7 -144.7 88.3C-147.6 69 -116 34.5 -103.6 7.2C-91.2 -20.2 -98 -40.3 -97 -63C-96 -85.7 -87.3 -110.8 -69.8 -121.7C-52.3 -132.6 -26.2 -129.3 3.2 -134.8C32.5 -140.3 65 -154.6 81.3 -143'
	]

	const shape = tweened(shapes[0], {
		interpolate: (f, t) => interpolate([f, t]),
		easing: cubicInOut,
		duration: 3000
	})

	let interval: number
	let currentBlobIndex = 0

	let mounted = false
	onMount(() => {
		mounted = true
		$shape = shapes[currentBlobIndex + 1]
		interval = setInterval(() => {
			currentBlobIndex = (currentBlobIndex + 1) % shapes.length
			$shape = shapes[currentBlobIndex]
		}, 4000)
	})

	onDestroy(() => {
		clearInterval(interval)
	})
</script>

{#key mounted}
	<div class="relative h-screen w-full overflow-hidden">
		<main
			class="z-10 absolute bg-base-50/10 dark:bg-base-950/50 backdrop-blur-xl md:backdrop-blur-2xl p-6 flex flex-col justify-center items-center inset-0 gap-8"
		>
			<h1
				in:fadeScale={{ duration: 400 }}
				class="text-center text-5xl md:text-7xl font-semibold bg-clip-text text-transparent bg-gradient-to-t from-base-950 via-base-900 to-base-500 dark:from-base-400 dark:via-base-100 dark:to-base-50"
			>
				See Tomorrow <span
					class="animate-text bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 dark:from-primary-300 dark:via-primary-500 dark:to-primary-800"
					>Now.</span
				>
			</h1>
			<p
				in:fade={{ duration: 400 }}
				class="text-center bg-clip-text text-transparent bg-gradient-to-t from-base-700 to-base-500 dark:from-base-400 dark:to-base-50 md:text-lg"
			>
				Predict the future of the world with Glimpse without waiting for 10 years.
			</p>
			<a
				in:fade={{ duration: 400 }}
				href="/rooms"
				class="inline-flex group items-center h-10 py-2 px-4 hover:pr-3 transition-all text-primary-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-base-50 dark:ring-offset-base-950 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
			>
				Get Started
				<ArrowRight class="w-4 h-4 ml-2 group-hover:ml-3 transition-[margin]" size={16} />
			</a>
		</main>

		<svg
			in:fade={{ duration: 150 }}
			xmlns="http://www.w3.org/2000/svg"
			class="max-sm:scale-150 absolute right-[10%] top-[90%] translate-x-1/2 -translate-y-1/2"
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
			in:fade={{ duration: 150 }}
			xmlns="http://www.w3.org/2000/svg"
			class="max-sm:scale-150 absolute left-[10%] top-[10%] -translate-x-1/2 -translate-y-1/2 -scale-x-100"
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
