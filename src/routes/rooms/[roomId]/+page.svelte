<script lang="ts">
	import { page } from '$app/stores'
	import {
		Check,
		ChevronLeft,
		Link,
		QrCode,
		Download,
		ExternalLink,
		Clipboard
	} from 'lucide-svelte'
	import { scale } from 'svelte/transition'
	import { createMenu } from 'svelte-headlessui'
	import Transition from 'svelte-transition'

	const qrMenu = createMenu({ label: 'QR Code' })
	let copiedURL = false

	const qrMenuOptions = [
		// {
		// 	label: 'Copy QR Code',
		// 	icon: Clipboard
		// },
		{
			label: 'Open QR Code',
			icon: ExternalLink
		},
		{
			label: 'Download QR Code',
			icon: Download
		}
	]
</script>

<div class="flex gap-6 items-center mb-6 md:mb-8">
	<button
		aria-label="Go back"
		class="inline-flex items-center p-2 focus-visible:text-base-900 dark:focus-visible:text-base-100 text-base-500 dark:text-base-400 justify-center dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 outline-none hover:text-base-800 dark:hover:text-base-100 transition-colors text-sm hover:bg-base-200/50 dark:hover:bg-base-900 rounded-lg"
		on:click={() => window.history.back()}
	>
		<ChevronLeft size={20} />
	</button>
	<h1 class="text-2xl font-bold md:text-3xl">{$page.params.roomId}</h1>
	<div class="flex gap-2">
		<div class="relative">
			<button
				use:qrMenu.button
				aria-label="Go back"
				class="inline-flex items-center p-2 focus-visible:text-base-900 dark:focus-visible:text-base-100 text-base-500 dark:text-base-400 justify-center dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 outline-none hover:text-base-800 dark:hover:text-base-100 transition-colors text-sm hover:bg-base-200/50 dark:hover:bg-base-900 rounded-lg"
			>
				<span in:scale>
					<QrCode size={20} />
				</span>
			</button>
			<Transition
				show={$qrMenu.expanded}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-75"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-75"
			>
				<ul
					use:qrMenu.items
					class="absolute -left-24 origin-top md:left-0 md:origin-top-left mt-3 w-56 divide-y divide-base-900 rounded-lg border border-base-800 bg-base-950/50 backdrop-blur-md shadow-lg ring-opacity-5 focus:outline-none"
				>
					{#each qrMenuOptions as option (option)}
						{@const active = $qrMenu.active === option.label}
						<li class="px-1 py-1">
							<button
								use:qrMenu.item
								class="flex w-full items-center rounded-sm px-2 py-2 text-sm font-medium transition {active
									? 'bg-base-900 text-base-50'
									: 'text-base-400'}"
							>
								<svelte:component this={option.icon} class="w-5 h-5 mr-3" />
								{option.label}
							</button>
						</li>
					{/each}
				</ul>
			</Transition>
		</div>
		<button
			aria-label="Copy URL"
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

<!-- 
<script lang="ts">
	import { fadeScale } from '$lib/utils/fadeScale'
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
	import { createMenu, createDialog } from 'svelte-headlessui'
	import QrCreator from '$lib/utils/qrCreator'
	import { onMount } from 'svelte'
	import Transition from 'svelte-transition'
	let copiedURL = false

	const qrDialog = createDialog({ label: 'QR Code' })

	let qrCanvas: HTMLElement
	let dataURL = ''
	let qrRendered = false
	$: {
		if ($qrDialog.expanded && !qrRendered) {
			qrRendered = true
			QrCreator.render(
				{
					text: $page.url.href,
					radius: 0.2,
					ecLevel: 'M',
					fill: '#e4e4e7',
					size: 1024
				},
				qrCanvas
			)
			const canvas = qrCanvas.children[0] as HTMLCanvasElement
			dataURL = canvas.toDataURL()
		}
	}
</script>

<div class="flex gap-6 items-center mb-6 md:mb-8">
	<button
		aria-label="Go back"
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
<div class="flex flex-wrap gap-4" /> -->
<!-- 
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
			<div class="fixed inset-0 bg-base-950/60" on:click={qrDialog.close} />
		</Transition>

		<div class="fixed inset-0 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<Transition
					enter="ease-out duration-200"
					enterFrom="opacity-0 scale-90"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-90"
				>
					<div
						transition:fadeScale={{ duration: 200 }}
						use:qrDialog.modal
						class="grid w-fit gap-8 rounded-2xl border border-base-800 bg-base-950/50 backdrop-blur-md p-8"
					>
						<h2 class=" text-center text-xl font-semibold text-base-300">
							Scan this QR code to join
						</h2>

						 <div bind:this={qrCanvas} class="sm:[&>canvas]:w-64 [&>canvas]:w-52 mx-auto" />
						<a
							href={dataURL}
							download="{$page.params.roomId.toLowerCase()}-qr-code.png"
							class="inline-flex items-center h-10 py-2 group px-4 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-base-50 dark:ring-offset-base-950 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
						>
							Download
						</a> 
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
</div> -->
