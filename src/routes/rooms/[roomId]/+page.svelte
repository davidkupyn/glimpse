<script lang="ts">
	import { page } from '$app/stores'
	import {
		Check,
		ChevronLeft,
		Link,
		QrCode as QrCodeIcon,
		Download,
		ExternalLink,
		Clipboard
	} from 'lucide-svelte'
	import { scale } from 'svelte/transition'
	import { createDialog } from 'svelte-headlessui'
	import { qr } from '$lib/utils/qr-generator'
	import Transition from 'svelte-transition'
	import { tippy } from '$lib/actions/tippy'

	const qrModules = qr($page.url.href, {
		correction: 'M'
	})
	let copiedURL = false

	const qrDialog = createDialog({ label: 'QR Code' })

	let qrCanvas: HTMLCanvasElement
	let dataURL = ''
	let qrRendered = false

	$: {
		if ($qrDialog.expanded && !qrRendered && qrCanvas) {
			qrRendered = true

			const context = qrCanvas.getContext('2d')
			const cellSize = 6
			const padding = 28
			const foregroundColor = '#27272a'
			const backgroundColor = '#fafafa'
			qrCanvas.width = qrModules.length * cellSize + padding * 2
			qrCanvas.height = qrModules.length * cellSize + padding * 2

			if (context) {
				context.fillStyle = backgroundColor
				context.fillRect(0, 0, qrCanvas.width, qrCanvas.height)
			}
			qrModules.forEach((row, rowIndex) => {
				row.forEach((module, colIndex) => {
					if (context) {
						context.fillStyle = module ? foregroundColor : backgroundColor
						context.fillRect(
							padding + colIndex * cellSize,
							padding + rowIndex * cellSize,
							cellSize,
							cellSize
						)
					}
				})
			})

			dataURL = qrCanvas.toDataURL()
		}
	}
</script>

<div class="flex gap-6 items-center mb-6 md:mb-8">
	<button
		aria-label="Go back"
		use:tippy={{ content: 'Go back', delay: 500 }}
		class="inline-flex items-center p-2 focus-visible:text-base-900 dark:focus-visible:text-base-100 text-base-500 dark:text-base-400 justify-center dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 outline-none hover:text-base-800 dark:hover:text-base-100 transition-colors text-sm hover:bg-base-200/50 dark:hover:bg-base-900 rounded-lg"
		on:click={() => window.history.back()}
	>
		<ChevronLeft size={20} />
	</button>
	<h1 class="text-2xl font-bold md:text-3xl">{$page.params.roomId}</h1>
	<div class="flex gap-2">
		<div class="relative">
			<button
				on:click={qrDialog.open}
				use:tippy={{ content: 'Show QR Code' }}
				aria-label="Go back"
				class="inline-flex items-center p-2 focus-visible:text-base-900 dark:focus-visible:text-base-100 text-base-500 dark:text-base-400 justify-center dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 outline-none hover:text-base-800 dark:hover:text-base-100 transition-colors text-sm hover:bg-base-200/50 dark:hover:bg-base-900 rounded-lg"
			>
				<span in:scale>
					<QrCodeIcon size={20} />
				</span>
			</button>
		</div>
		<button
			aria-label="Copy URL"
			use:tippy={{ content: 'Copy URL' }}
			class="inline-flex items-center p-2 focus-visible:text-base-900 dark:focus-visible:text-base-100 text-base-500 dark:text-base-400 justify-center dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 outline-none hover:text-base-800 dark:hover:text-base-100 transition-colors text-sm hover:bg-base-200/50 dark:hover:bg-base-900 rounded-lg"
			on:click={() => {
				if (copiedURL) return
				copiedURL = true
				navigator.clipboard.writeText($page.url.href)
				setTimeout(() => {
					copiedURL = false
				}, 1000)
			}}
		>
			{#if copiedURL}
				<span in:scale>
					<Check class="text-green-600 dark:text-green-500" size={20} />
				</span>
			{:else}
				<span in:scale>
					<Link size={20} />
				</span>
			{/if}
		</button>
	</div>
</div>
<div class="flex flex-wrap gap-4" />

<div class="relative z-20">
	<Transition show={$qrDialog.expanded}>
		<Transition
			enter="ease-out duration-200"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="fixed inset-0 bg-base-800/40 dark:bg-base-950/60" on:click={qrDialog.close} />
		</Transition>

		<div class="fixed inset-0 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<Transition
					enter="ease-out duration-150"
					enterFrom="opacity-0 scale-75"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-150"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-75"
				>
					<div
						use:qrDialog.modal
						class="grid w-fit gap-8 rounded-2xl border border-base-300 dark:border-base-800 bg-base-200/50 dark:bg-base-950/50 backdrop-blur-md p-8"
					>
						<h2 class=" text-center text-xl font-semibold">Scan this QR code to join</h2>

						<canvas
							bind:this={qrCanvas}
							class="sm:[&>canvas]:w-64 [&>canvas]:w-52 mx-auto rounded-xl"
						/>
						<!-- <a
							href={dataURL}
							download="{$page.params.roomId.toLowerCase()}-qr-code.png"
							class="inline-flex items-center h-10 py-2 group px-4 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-base-50 dark:ring-offset-base-950 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
						>
							Download
						</a> -->
						<button
							on:click={qrDialog.close}
							class="inline-flex items-center h-10 py-2 group px-4 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-base-50 dark:ring-offset-base-950 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
						>
							Done
						</button>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</div>
