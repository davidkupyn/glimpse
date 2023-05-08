<script lang="ts">
	import { fadeScale } from '$lib/utils/fadeScale'
	import { page } from '$app/stores'
	import { Check, ChevronLeft, Eye, EyeOff, Link } from 'lucide-svelte'
	import { crossfade, fly, scale } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { onMount } from 'svelte'
	import { superForm } from 'sveltekit-superforms/client'
	export let data

	const { form, errors, enhance } = superForm(data.form, {
		taintedMessage: null
	})

	const [send, receive] = crossfade({})

	let copiedURL = false
	const uuid = crypto.randomUUID().slice(0, 15)
	const url = $page.url.href.split('create')[0] + uuid
	let showPassword = false
	let passwordInput: HTMLInputElement
	let privateRoom: boolean = false
	let mounted = false
	onMount(() => {
		mounted = true
		$form.id = uuid
	})
	$: {
		if (mounted && passwordInput) passwordInput.type = showPassword ? 'text' : 'password'
	}
	$: $form.private = privateRoom ? 1 : 0
</script>

<a
	aria-label="Go back"
	class="inline-flex mb-6 md:mb-8 items-center px-3 h-9 focus-visible:text-base-900 dark:focus-visible:text-base-100 text-base-500 dark:text-base-400 justify-center dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 outline-none hover:text-base-800 dark:hover:text-base-100 transition-colors text-sm hover:bg-base-200/50 dark:hover:bg-base-900 rounded-lg"
	href="/rooms"
>
	<ChevronLeft size={20} class="mr-2 w-4 h-4" />
	Go Back
</a>
<form
	use:enhance
	method="POST"
	in:fadeScale={{ baseScale: 0.8 }}
	class="w-full overflow-hidden border rounded-3xl dark:border-base-900 border-base-300 p-6 grid gap-6 sm:w-[28rem] mx-auto"
>
	<h1 class="text-center font-semibold text-xl">Create a Room</h1>

	<div
		class="bg-base-200 transition dark:bg-base-900 rounded-lg data-[invalid]:ring-red-500 dark:focus-within:ring-primary-600 focus-within:ring-primary-500 ring-1 ring-transparent hover:ring-primary-500 dark:hover:ring-primary-600 px-4"
		data-invalid={$errors.title || $errors.description}
	>
		<fieldset class="grid gap-1 my-3">
			<input
				class="focus:ring-transparent w-full border-0 transition outline-none dark:placeholder:text-base-500 placeholder:text-base-400 text-xl font-medium bg-transparent p-0"
				type="text"
				name="title"
				bind:value={$form.title}
				placeholder="Title"
			/>
			{#if $errors.title}
				<small class="text-red-500">{$errors.title}</small>
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
	<div
		class="flex items-center border rounded-lg h-10 p-1 gap-2 border-base-300 dark:border-base-900"
	>
		<button
			type="button"
			class="outline-none focus-visible:bg-base-300/75 transition dark:focus-visible:bg-base-800 rounded group relative w-full h-full"
			on:click={() => (privateRoom = false)}
		>
			{#if privateRoom === false}
				<div
					in:receive|local={{ key: 'background', easing: cubicOut }}
					out:send|local={{ key: 'background', easing: cubicOut }}
					class="w-full h-full rounded bg-base-300/50 dark:bg-base-800/75"
				/>
			{/if}
			<span
				class="transition hover:text-base-800 group-focus-visible:text-base-700 dark:group-focus-visible:text-base-300 dark:hover:text-base-100 text-sm font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 {privateRoom ===
				false
					? 'text-base-800 dark:text-base-100'
					: 'text-base-600 dark:text-base-500'}"
			>
				Public
			</span>
		</button>
		<button
			type="button"
			class="outline-none focus-visible:bg-base-300/75 transition dark:focus-visible:bg-base-800 rounded group relative w-full h-full"
			on:click={() => (privateRoom = true)}
		>
			{#if privateRoom === true}
				<div
					in:receive={{ key: 'background', easing: cubicOut }}
					out:send={{ key: 'background', easing: cubicOut }}
					class="w-full h-full rounded bg-base-300/50 dark:bg-base-800/75"
				/>
			{/if}
			<span
				class="transition hover:text-base-800 group-focus-visible:text-base-700 dark:group-focus-visible:text-base-300 dark:hover:text-base-100 text-sm font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 {privateRoom ===
				true
					? 'text-base-800 dark:text-base-100'
					: 'text-base-600 dark:text-base-500'}"
			>
				Private
			</span>
		</button>
	</div>
	<input type="hidden" name="private" bind:value={$form.private} />
	<input type="hidden" name="id" bind:value={$form.id} />
	{#if privateRoom === true}
		<fieldset in:fly|local={{ x: -500, easing: cubicOut }} class="grid gap-1">
			<div
				class="flex w-full items-center data-[invalid]:ring-red-500 hover:ring-primary-500 dark:hover:ring-primary-600 rounded-lg overflow-hidden ring-1 ring-transparent duration-200 focus-within:ring-primary-500 dark:focus-within:ring-primary-600 bg-base-200 dark:bg-base-900 pr-2"
				data-invalid={$errors.password}
			>
				<input
					class="focus:ring-0 border-0 transition h-10 outline-none dark:placeholder:text-base-500 placeholder:text-base-400 bg-transparent w-full text-sm pl-4 pr-0"
					bind:this={passwordInput}
					bind:value={$form.password}
					name="password"
					placeholder="Password"
				/>
				<button
					type="button"
					class="p-1 focus-visible:bg-base-300/75 focus-visible:text-base-800 dark:focus-visible:bg-base-800 dark:focus-visible:text-base-200 outline-none rounded text-base-500 dark:text-base-400 hover:text-base-800 dark:hover:text-base-100 transition"
					on:click={() => {
						showPassword = !showPassword
					}}
				>
					{#if showPassword}
						<span in:scale>
							<Eye size={20} />
						</span>
					{:else}
						<span in:scale>
							<EyeOff size={20} />
						</span>
					{/if}
				</button>
			</div>
			{#if $errors.password}
				<small class="text-red-500">{$errors.password}</small>
			{/if}
		</fieldset>
	{:else}
		<fieldset in:fly|local={{ x: 500, easing: cubicOut }} class="grid gap-1">
			<div
				class="flex w-full items-center data-[invalid]:ring-red-500 hover:ring-primary-500 dark:hover:ring-primary-600 rounded-lg overflow-hidden ring-1 ring-transparent duration-200 focus-within:ring-primary-500 dark:focus-within:ring-primary-600 bg-base-200 dark:bg-base-900 pr-2"
			>
				<input
					readonly
					class="focus:ring-0 border-0 transition h-10 outline-none dark:placeholder:text-base-500 placeholder:text-base-400 bg-transparent w-full text-sm pl-4 pr-0"
					value={url}
				/>
				<button
					type="button"
					class="p-1 focus-visible:bg-base-300/75 focus-visible:text-base-800 dark:focus-visible:bg-base-800 dark:focus-visible:text-base-200 outline-none rounded text-base-500 dark:text-base-400 hover:text-base-800 dark:hover:text-base-100 transition"
					on:click={() => {
						if (copiedURL) return
						copiedURL = true
						navigator.clipboard.writeText(url)
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
		</fieldset>
	{/if}
	<button
		type="submit"
		class="inline-flex w-full group items-center h-10 py-2 px-4 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 ring-offset-base-50 dark:ring-offset-base-950"
	>
		Create a Room
	</button>
</form>
