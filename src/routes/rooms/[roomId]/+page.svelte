<script lang="ts">
	import { page } from '$app/stores'
	import { Check, ChevronLeft, Link, Play, QrCode as QrCodeIcon } from 'lucide-svelte'
	import { fly, scale } from 'svelte/transition'
	import { createDialog } from 'svelte-headlessui'
	import { qr } from '$lib/utils/qr-generator'
	import Transition from 'svelte-transition'
	import { tippy } from '$lib/actions/tippy'
	import { onMount } from 'svelte'
	import { currentUser, pb } from '$lib/pocketbase.js'
	import { invalidate } from '$app/navigation'
	import { superForm } from 'sveltekit-superforms/client'
	import { flip } from 'svelte/animate'
	import { cubicOut } from 'svelte/easing'

	export let data

	const { form, errors, enhance } = superForm(data.form)
	const { enhance: joinEnhance } = superForm(data.joinForm, {
		taintedMessage: null
	})
	const { enhance: leaveEnhance } = superForm(data.leaveForm, {
		taintedMessage: null
	})
	const { enhance: startEnhance } = superForm(data.startForm, {
		taintedMessage: null
	})

	let copiedURL = false

	const qrDialog = createDialog({ label: 'QR Code' })

	let qrCanvas: HTMLCanvasElement
	let qrRendered = false

	$: {
		if ($qrDialog.expanded && !qrRendered && qrCanvas) {
			qrRendered = true
			const qrModules = qr($page.url.href, {
				correction: 'M'
			})
			const context = qrCanvas.getContext('2d')
			const cellSize = data.room.private && data.room.creator !== $currentUser?.id ? 4 : 6
			const padding = 24
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
		}
	}

	onMount(async () => {
		const unsubscribe = await pb.collection('options').subscribe('*', (subscription) => {
			invalidate('room')
		})

		return () => unsubscribe()
	})
</script>

<div class="flex gap-6 items-center mb-6 md:mb-8">
	<a
		aria-label="Go back"
		use:tippy={{ content: 'Go back', delay: 500, placement: 'bottom' }}
		class="inline-flex items-center p-2 focus-visible:text-base-900 dark:focus-visible:text-base-100 text-base-500 dark:text-base-400 justify-center dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 outline-none hover:text-base-800 dark:hover:text-base-100 transition-colors text-sm hover:bg-base-200/50 dark:hover:bg-base-900 rounded-lg"
		href="/rooms"
	>
		<ChevronLeft size={20} />
	</a>
	<h1 class="text-2xl font-bold md:text-3xl">{data.room?.title}</h1>
	<div class="flex gap-2">
		<div class="relative">
			<button
				on:click={qrDialog.open}
				use:tippy={{ content: 'Show QR Code', placement: 'bottom' }}
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
			use:tippy={{ content: 'Copy URL', placement: 'bottom' }}
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
	{#if !data.room.started && data.room.creator === $currentUser?.id}
		<form
			transition:scale|local={{ duration: 150, easing: cubicOut }}
			method="POST"
			action="?/start"
			class="ml-auto"
			use:startEnhance
		>
			<button
				class="max-sm:hidden inline-flex items-center h-10 py-2 group px-4 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-base-50 dark:ring-offset-base-950 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
			>
				<Play class="w-4 h-4 mr-2 transition" size={16} />
				Start voting
			</button>
		</form>
	{/if}
</div>
<div class="flex flex-col md:flex-row gap-12">
	{#if data.joined && !data.enteredOption && !data.room.started}
		<div
			class="grid gap-3 w-full"
			transition:fly|local={{ x: -200, easing: cubicOut, duration: 150 }}
		>
			<form action="?/createOption" method="POST" use:enhance class="w-full grid gap-6">
				<h2 class="font-semibold text-xl">Submit your option</h2>
				<div
					class="bg-base-200 transition dark:bg-base-900 rounded-lg data-[invalid]:ring-red-500 dark:focus-within:ring-primary-600 focus-within:ring-primary-500 ring-1 ring-transparent hover:ring-primary-500 dark:hover:ring-primary-600 px-4"
					data-invalid={$errors.content || $errors.description}
				>
					<fieldset class="grid gap-1 my-3">
						<input
							class="focus:ring-transparent w-full border-0 transition outline-none dark:placeholder:text-base-500 placeholder:text-base-400 text-xl font-medium bg-transparent p-0"
							type="text"
							name="content"
							bind:value={$form.content}
							placeholder="Title"
						/>
						{#if $errors.content}
							<small class="text-red-500">{$errors.content}</small>
						{/if}
					</fieldset>
					<fieldset class="grid gap-1 mb-3">
						<textarea
							class="h-44 resize-none focus:ring-transparent border-0 transition outline-none dark:placeholder:text-base-500 placeholder:text-base-400 bg-transparent p-0"
							name="description"
							bind:value={$form.description}
							placeholder="Description"
						/>
						{#if $errors.description}
							<small class="text-red-500">{$errors.description}</small>
						{/if}
					</fieldset>
				</div>
				<div class="grid gap-3">
					<button
						type="submit"
						class="inline-flex w-full group items-center h-10 py-2 px-4 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 ring-offset-base-50 dark:ring-offset-base-950"
					>
						Submit
					</button>
				</div>
			</form>
			<form method="POST" action="?/leave" use:leaveEnhance>
				<button
					formaction="?/leave"
					class="inline-flex w-full items-center h-10 py-2 px-4 border dark:border-base-800 border-base-300 text-base-600 dark:text-base-300 dark:hover:text-base-50 hover:text-base-900 hover:bg-base-200/50 dark:hover:bg-base-800 justify-center rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-300 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-base-700 disabled:pointer-events-none dark:focus-visible:ring-offset-base-950"
				>
					Cancel
				</button>
			</form>
		</div>
		<span
			transition:fly|local={{ x: -200, easing: cubicOut, duration: 75 }}
			class="max-md:h-0.5 md:w-0.5 dark:bg-base-900 bg-base-200 rounded-full"
		/>
	{/if}
	<div class="flex flex-col gap-3 w-full md:mt-[3.25rem]">
		{#if !!data.options}
			{#each data.options as option, i (option.id)}
				<div
					animate:flip
					in:fly={{ y: 100, easing: cubicOut, delay: 25 * i }}
					class="border outline-none w-full focus-visible:bg-base-200 dark:focus-visible:bg-base-900 dark:focus-visible:text-base-50 focus-visible:text-base-800 border-base-300 dark:border-base-900 rounded-lg p-4 flex flex-col gap-2 dark:hover:bg-base-900 hover:bg-base-100 hover:text-base-800 dark:hover:text-base-50 dark:text-base-300 text-base-600 transition"
				>
					<p>{option.content}</p>
					{#if option.description}
						<p class="text-base-400 dark:text-base-500">{option.description}</p>
					{/if}
				</div>
			{/each}
		{:else}
			<p class="w-full text-center my-8 font-medium">No options yet</p>
		{/if}

		{#if !data.joined && !data.room.started}
			<form action="?/join" method="POST" use:joinEnhance class="mt-9 mx-auto w-full sm:w-64">
				<button
					in:scale|local={{ delay: 200, duration: 150, easing: cubicOut }}
					class="inline-flex w-full mx-auto group items-center h-10 py-2 px-4 transition text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 ring-offset-base-50 dark:ring-offset-base-950"
				>
					Join
				</button>
			</form>
		{/if}
	</div>
</div>

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
						class="grid w-fit gap-8 rounded-2xl border border-base-300 dark:border-base-800 bg-base-300/75 dark:bg-base-950/75 backdrop-blur-md p-8"
					>
						<h2 class=" text-center text-xl font-semibold">Scan this QR code to join</h2>

						<canvas
							bind:this={qrCanvas}
							class="sm:[&>canvas]:w-64 [&>canvas]:w-52 mx-auto rounded-xl"
						/>

						<button
							on:click={qrDialog.close}
							class="inline-flex items-center h-10 py-2 group px-4 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-base-300 dark:ring-offset-base-950 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
						>
							Done
						</button>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</div>

{#if !data.room.started && data.room.creator === $currentUser?.id}
	<form method="POST" action="?/start" class="ml-auto" use:startEnhance>
		<button
			class="fixed bottom-6 right-6 ease-out transition-all z-20 h-14 w-14 rounded-full bg-primary-500/80 dark:bg-primary-600/80 text-base-50 backdrop-blur-sm shadow-xl grid place-items-center sm:hidden"
			use:tippy={{ content: 'Create a room', placement: 'left' }}
		>
			<Play class="ml-1" size={20} />
		</button>
	</form>
{/if}
