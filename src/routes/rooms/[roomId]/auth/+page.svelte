<script lang="ts">
	import { fadeScale } from '$lib/utils/fadeScale'
	import { scale } from 'svelte/transition'
	import { ChevronLeft, Eye, EyeOff } from 'lucide-svelte'
	import { onMount } from 'svelte'
	import { superForm } from 'sveltekit-superforms/client'

	export let data
	const { form, errors, enhance } = superForm(data.form, {
		taintedMessage: null
	})

	let showPassword = false
	let passwordInput: HTMLInputElement
	let mounted = false
	onMount(() => {
		mounted = true
	})
	$: {
		if (mounted && passwordInput) passwordInput.type = showPassword ? 'text' : 'password'
	}
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
	method="POST"
	use:enhance
	in:fadeScale={{ baseScale: 0.8 }}
	class="mx-auto w-full border rounded-3xl dark:border-base-900 border-base-300 p-6 grid gap-6 sm:w-96"
>
	<h2 class="w-full text-center text-xl font-semibold">
		This room is private, enter password to continue
	</h2>
	<fieldset class="grid gap-1">
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
			<small class="text-red-500 text-left">{$errors.password}</small>
		{/if}
	</fieldset>
	<button
		type="submit"
		class="inline-flex items-center h-10 py-2 group px-4 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-base-300 dark:ring-offset-base-950 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
	>
		Enter
	</button>
</form>
