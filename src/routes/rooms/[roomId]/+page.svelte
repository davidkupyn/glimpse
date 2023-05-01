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
